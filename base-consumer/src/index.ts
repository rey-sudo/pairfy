import { jetstreamManager } from "@nats-io/jetstream";
import {
  catchError,
  checkHandlerVariables,
  createConsumer,
  disableConnections,
} from "./utils/index.js";
import { connect } from "@nats-io/transport-node";
import database from "./database/client.js";
import { ERROR_EVENTS, logger, sleep } from "@lovelacers/common";

const main = async () => {
  try {
    const requiredEnvVars = [
      "POD_NAME",
      "STREAM_LIST",
      "FILTER_SUBJECTS",
      "SERVICE_NAME",
      "CONSUMER_GROUP",
      "DURABLE_NAME",
      "DATABASE_HOST",
      "DATABASE_PORT",
      "DATABASE_USER",
      "DATABASE_PASSWORD",
      "DATABASE_NAME",
      "NATS_SERVERS",
    ];

    for (const varName of requiredEnvVars) {
      if (!process.env[varName]) {
        throw new Error(`${varName} error`);
      }
    }

    checkHandlerVariables();

    ERROR_EVENTS.forEach((e: string) =>
      process.on(e, (err) => disableConnections(e, err))
    );

    const MODU = await import(
      `./handlers/${process.env.SERVICE_NAME}/index.js`
    );

    /////////////////////////////////////////////////////////////////////////

    const databasePort = parseInt(process.env.DATABASE_PORT as string);

    database.connect({
      host: process.env.DATABASE_HOST,
      port: databasePort,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      waitForConnections: true,
      connectionLimit: 150,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 5000,
      connectTimeout: 30000,
      timezone: "Z",
      supportBigNumbers: true,
      bigNumberStrings: true,
    });

    const natsClient = await connect({
      name: process.env.POD_NAME as string,
      servers: (process.env.NATS_SERVERS as string).split(","),
      pingInterval: 20 * 1000,
      maxPingOut: 5,
      reconnectTimeWait: 10 * 1000,
    });

    const jetStreamManager = await jetstreamManager(natsClient, {
      checkAPI: false,
    });

    const jetStream = jetStreamManager.jetstream();

    const streamList = (process.env.STREAM_LIST as string).split(",");

    const filterSubjects: any = process.env.FILTER_SUBJECTS
      ? process.env.FILTER_SUBJECTS.split(",").map((subject) => subject.trim())
      : [];

    console.log("✅ Filters:", filterSubjects);

    ////////////////////////////////////////////////////////////////////////////////////////////////

    try {
      await Promise.all(
        streamList.map((stream) =>
          createConsumer(
            jetStreamManager,
            stream,
            process.env.DURABLE_NAME as string,
            process.env.CONSUMER_GROUP as string,
            filterSubjects
          )
        )
      );

      const startStreamConsumer = async (stream: string) => {
        const consumer = await jetStream.consumers.get(
          stream,
          process.env.DURABLE_NAME
        );

        if (!consumer) {
          throw new Error(`🚨 There is no consumer: ${stream}`);
        }

        while (true) {
          console.log(`🕒 Waiting for events on stream: ${stream}`);

          const message = await consumer.next();

          if (message) {
            const processed = await MODU.processEvent(message); //returns always boolean

            if (processed) {
              await message.ack();
            } else {
              await message.nak(30_000);
            }
          }

          if (!message) {
            await sleep(30_000);
            console.log(`❌ Empty queue for stream: ${stream}`);
          }
        }
      };

      for (const stream of streamList) {
        startStreamConsumer(stream);
      }
    } catch (err: any) {
      logger.error({
        service: process.env.SERVICE_NAME,
        event: "consumer.error",
        message: "Consumer error",
        error: err,
      });
      await disableConnections(database, natsClient);

      throw err;
    }
  } catch (err) {
    catchError(err);
  }
};

main();
