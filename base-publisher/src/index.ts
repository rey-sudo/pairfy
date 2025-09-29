import {
  DiscardPolicy,
  jetstreamManager,
  RetentionPolicy,
  StorageType,
} from "@nats-io/jetstream";
import { catchError, errorEvents, sleep } from "./utils/index.js";
import { database } from "./database/client.js";
import { connect } from "@nats-io/transport-node";
import { logger } from "@lovelacers/common";

const main = async () => {
  try {
    const requiredEnvVars = [
      "POD_NAME",
      "DATABASE_HOST",
      "DATABASE_PORT",
      "DATABASE_PASSWORD",
      "DATABASE_NAME",
      "DATABASE_USER",
      "STREAM_NAME",
      "STREAM_SUBJECT",
      "QUERY_INTERVAL",
      "QUERY_LIMIT",
      "NATS_SERVERS"
    ];

    for (const key of requiredEnvVars) {
      if (!process.env[key]) {
        throw new Error(`${key} error`);
      }
    }
    
    errorEvents.forEach((e: string) => process.on(e, (err) => catchError(err)));

    const databasePort = parseInt(process.env.DATABASE_PORT as string, 10);

    const queryLimit = parseInt(process.env.QUERY_LIMIT as string, 10);
    
    const queryInterval = parseInt(process.env.QUERY_INTERVAL as string, 10)

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
      reconnect: true,
      pingInterval: 20 * 1000,
      maxPingOut: 5,
      reconnectTimeWait: 10 * 1000,
    });

    const jetStreamManager = await jetstreamManager(natsClient, {
      checkAPI: false,
    });

    await jetStreamManager.streams.add({
      name: process.env.STREAM_NAME,
      subjects: [process.env.STREAM_SUBJECT as string],
      retention: RetentionPolicy.Limits,
      storage: StorageType.File,
      max_age: 0,
      max_msgs: -1,
      max_bytes: -1,
      discard: DiscardPolicy.Old,
      max_consumers: -1,
      num_replicas: 3,
    });

    await jetStreamManager.streams.info(process.env.STREAM_NAME as string);

    const jetStream = jetStreamManager.jetstream();

    let connection: any = null;

    while (true) {
      await sleep(queryInterval);

      try {
        connection = await database.client.getConnection();

        const [findEvents] = await connection.query(
          `
          SELECT * FROM events
          WHERE published = ?
          ORDER BY created_at ASC
          LIMIT ? 
          FOR UPDATE SKIP LOCKED`,
          [false, queryLimit]
        );

        if (findEvents.length < 1) {
          console.log("🕕 Waiting for events.");
          continue;
        }

        console.log("✅ Publishing: " + findEvents.length);

        for (const EVENT of findEvents) {
          try {
            await connection.beginTransaction();

            //////////////////////////////////////////////////////////////////////////////////////////////////////////////

            const [updateEvent] = await connection.execute(
              "UPDATE events SET published = ? WHERE id = ?",
              [true, EVENT.id]
            );

            if (updateEvent.affectedRows !== 1) {
              throw new Error("updateEventError");
            }

            const eventSubject = process.env.STREAM_NAME + "." + EVENT.type;

            const eventData = JSON.stringify(EVENT);

            const publishEvent = await jetStream.publish(
              eventSubject,
              eventData,
              {
                msgID: EVENT.id,
              }
            );

            if (!publishEvent.seq) {
              throw new Error("eventPublishError");
            }

            /////////////////////////////////////////////////////////////////////////////////////////////////////////////

            await connection.commit();
          } catch (err) {
            logger.error(err);

            continue;
          }
        }
      } catch (error: any) {
        logger.error({
          service: `${process.env.STREAM_NAME as string}-publisher`,
          event: "publisher.error",
          message: "publisher error",
          error: error.message,
          stack: error.stack,
        });

        if (connection) await connection.rollback();
      } finally {
        if (connection) connection.release();
      }
    }
  } catch (err) {
    catchError(err);
  }
};

main();
