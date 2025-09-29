import { Queue, Worker } from "bullmq";
import { testHandler } from "./handlers/index.js";
import { redisBooks, redisState } from "./database/redis.js";
import { ERROR_EVENTS, logger, sleep } from "@lovelacers/common";
import { findOrdersCustom } from "./lib/order.js";
import { database } from "./database/client.js";
import { catchError } from "./utils/index.js";

const main = async () => {
  try {
    const requiredEnvVars = [
      "DATABASE_HOST",
      "DATABASE_PORT",
      "DATABASE_USER",
      "DATABASE_PASSWORD",
      "DATABASE_NAME",
      "QUERY_LIMIT",
      "QUERY_INTERVAL",
      "SCAN_RANGE",
      "BLOCKFROST_HOST",
      "BLOCKFROST_KEY",
      "KUPO_KEY",
      "OGMIOS_KEY",
      "REDIS_BOOKS_HOST",
      "REDIS_STATE_HOST",
    ];

    for (const varName of requiredEnvVars) {
      if (!process.env[varName]) {
        throw new Error(`${varName} error`);
      }
    }
    const timestamp = Date.now();
    const queryInterval = parseInt(process.env.QUERY_INTERVAL as string);
    const queryLimit = parseInt(process.env.QUERY_LIMIT as string);
    const databasePort = parseInt(process.env.DATABASE_PORT as string);
    const scanRange = timestamp - parseInt(process.env.SCAN_RANGE as string);

    console.log({
      QUERY_INTERVAL: queryInterval,
      QUERY_LIMIT: queryLimit,
      DATABASE_PORT: databasePort,
      SCAN_RANGE: scanRange,
    });

    await redisState
      .connect({
        url: process.env.REDIS_STATE_HOST,
        connectTimeout: 100000,
        keepAlive: 100000,
      })
      .then(() => console.log("✅ redisState connected"))
      .catch((err: any) => catchError(err));

    await redisBooks
      .connect({
        url: process.env.REDIS_BOOKS_HOST,
        connectTimeout: 100000,
        keepAlive: 100000,
      })
      .then(() => console.log("✅ redisBooks connected"))
      .catch((err: any) => catchError(err));

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

    //////////////////////////////////////////////////////////////////////////////////////

    const queue = new Queue("threadtokenQueue", {
      connection: { url: process.env.REDIS_STATE_HOST },
    });

    const worker = new Worker("threadtokenQueue", testHandler, {
      autorun: true,
      drainDelay: 10,
      settings: {
        backoffStrategy: () => -1,
      },
      connection: { url: process.env.REDIS_STATE_HOST },
      concurrency: 100, //TEST
      lockDuration: 120_000,
      stalledInterval: 120_000,
      maxStalledCount: 1,
    });

    worker.on("failed", async (job: any, err) => {
      console.error("❌ Failed", job.id, err);
    });

    worker.on("completed", async (job: any, result) => {
      try {
        const { id, finished } = result;

        console.log("✅ Completed", id);

        if (finished) {
          const removed = await queue.removeJobScheduler(id);

          if (removed) {
            console.log("✅ Deleted", id);
          }
        }
      } catch (err) {
        logger.error({
          service: "service-state",
          event: "bull.error",
          message: "bull completed error",
          error: err,
        });
      }
    });

    worker.on("error", (err) => {
      logger.error(err);
    });

    worker.on("stalled", (jobId: any) => {
      console.log("⚠️ Stalled", jobId);
    });

    worker.on("drained", () => {
      console.log("✅ Drained");
    });

    ERROR_EVENTS.forEach((e: string) =>
      process.on(e, async (err) => {
        logger.error({
          service: "service-state",
          event: "signal.error",
          message: e,
          error: err,
        });
        await worker.close();
        await database.client.end();
        await redisState.client.close();
        await redisBooks.client.close();
        process.exit(1);
      })
    );

    let connection: any = null;

    while (true) {
      console.log("🔍 Scanning new orders.");

      try {
        connection = await database.client.getConnection();

        const findOrders = await findOrdersCustom(
          connection,
          scanRange,
          queryLimit
        );

        if (!findOrders.length) {
          console.log("🚫 There are no more orders.");
        }

        /////////////////////////////////////////////////////////////////////////////// ITERATE ORDERS

        for (const order of findOrders) {
          try {
            const createJob = await queue.upsertJobScheduler(
              order.id,
              {
                every: 60_000,
                jobId: order.id,
              },
              {
                name: order.id,
                data: order,
                opts: {
                  attempts: 0,
                  removeOnComplete: true,
                  removeOnFail: true,
                },
              }
            );

            logger.info({
              service: "service-state",
              event: "job.created",
              message: "job created",
              jobId: createJob.name,
            });

            console.log("✅ Job added", createJob.name);
          } catch (err) {
            logger.error({
              service: "service-state",
              event: "job.error",
              message: "job error",
              error: err,
              jobId: order.id,
            });

            continue;
          }
        }

        /////////////////////////////////////////////////////////////////////////////// ITERATE ORDERS END
      } catch (err: any) {
        logger.error({
          service: "service-state",
          event: "mysql.error",
          message: "mysql error",
          error: err,
        });

        if (connection) await connection.rollback();
      } finally {
        if (connection) connection.release();
      }

      await sleep(queryInterval);
    }
  } catch (err) {
    catchError(err);
  }
};

main();
