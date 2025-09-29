import { logger } from "@lovelacers/common";

export const catchError = (error?: any) => {
  logger.error(`EXIT=>${error}`);

  return process.exit(1);
};

export const checkRedis = (redisClient: any) => {
  let interval: any;

  const ping = async () => {
    try {
      await redisClient.client.ping();
      console.log("Redis Online");
    } catch (err) {
      console.error("checkRedisError", err);
      clearInterval(interval);
    }
  };

  interval = setInterval(ping, 10_000);
};

export const errorEvents: string[] = [
  "exit",
  "SIGINT",
  "SIGTERM",
  "SIGQUIT",
  "uncaughtException",
  "unhandledRejection",
  "SIGHUP",
  "SIGCONT",
];
