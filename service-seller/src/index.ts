import * as route from "./routes/index.js";
import database from "./database/index.js";
import compression from "compression";
import { ApiError, errorHandler, ERROR_EVENTS } from "@lovelacers/common";
import { logger, RateLimiter } from "@lovelacers/common";
import { catchError } from "./utils/index.js";
import { Request, Response } from "express";
import { app } from "./app.js";

const main = async () => {
  try {
    const requiredEnvVars = [
      "NODE_ENV",
      "AGENT_JWT_KEY",
      "TOKEN_EXPIRATION",
      "DATABASE_HOST",
      "DATABASE_PORT",
      "DATABASE_USER",
      "DATABASE_PASSWORD",
      "DATABASE_NAME",
      "REDIS_RATELIMIT_URL",
    ];

    for (const key of requiredEnvVars) {
      if (!process.env[key]) {
        throw new Error(`Missing environment variable: ${key}`);
      }
    }

    ERROR_EVENTS.forEach((e: string) =>
      process.on(e, (err) => catchError(err))
    );

    const databasePort = parseInt(process.env.DATABASE_PORT as string);

    database.connect({
      host: process.env.DATABASE_HOST,
      port: databasePort,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    });

    const rateLimiter = new RateLimiter({
      source: "service-seller",
      redisUrl: process.env.REDIS_RATELIMIT_URL as string,
      jwtSecret: process.env.AGENT_JWT_KEY as string,
      maxRequests: 100,
      windowSeconds: 120,
    });

    app.post(
      "/api/seller/create-seller",

      rateLimiter.middlewareIp(),
      ...route.createSellerMiddlewares,

      route.createSellerHandler
    );

    app.post(
      "/api/seller/verify-seller",

      rateLimiter.middlewareIp(),
      ...route.verifySellerMiddlewares,

      route.verifySellerHandler
    );

    app.post(
      "/api/seller/login-seller",

      rateLimiter.middlewareIp(),
      ...route.loginSellerMiddlewares,

      route.loginSellerHandler
    );

    app.post(
      "/api/seller/recovery-seller",

      rateLimiter.middlewareIp(),
      ...route.recoverySellerMiddlewares,

      route.recoverySellerHandler
    );

    app.post(
      "/api/seller/update-password",

      rateLimiter.middlewareIp(),
      ...route.updatePasswordMiddlewares,

      route.updatePasswordHandler
    );

    app.get(
      "/api/seller/current-seller",

      rateLimiter.middlewareIp(),
      ...route.currentSellerMiddlewares,

      route.currentSellerHandler
    );

    app.get(
      "/api/seller/logout-seller",
      rateLimiter.middlewareIp(),
      route.logoutHandler
    );

    app.get(
      "/api/seller/ping",
      rateLimiter.middlewareIp(),
      (req: Request, res: Response) => {
        res.status(200).json({ success: true, data: { message: "Test OK" } });
      }
    );
    
    app.all("*", (req, _res, next) => {
      next(
        new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`, {
          code: "ROUTE_NOT_FOUND",
        })
      );
    });

    app.use(errorHandler);

    app.use(compression());

    app.listen(8000, () => logger.info(`express server listening in 8000`));
  } catch (e) {
    catchError(e);
  }
};

main();
