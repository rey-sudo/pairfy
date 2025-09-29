import http from "http";
import express from "express";
import database from "./database/client.js";
import cookieSession from "cookie-session";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { typeDefs } from "./graphql/types.js";
import { products } from "./graphql/resolvers.js";
import { catchError } from "./utils/index.js";
import {
  sellerMiddleware,
  normalizeGraphError,
  logger,
  getPublicAddress,
  RateLimiter,
  ApiGraphQLError,
  ERROR_CODES,
  SellerToken,
  ERROR_EVENTS,
} from "@lovelacers/common";

const main = async () => {
  try {
    const requiredEnvVars = [
      "NODE_ENV",
      "AGENT_JWT_KEY",
      "DATABASE_HOST",
      "DATABASE_PORT",
      "DATABASE_USER",
      "DATABASE_PASSWORD",
      "DATABASE_NAME",
      "REDIS_RATELIMIT_HOST",
      "INTERNAL_ENDPOINT_SECRET",
    ];

    for (const varName of requiredEnvVars) {
      if (!process.env[varName]) {
        throw new Error(`${varName} error`);
      }
    }

    ERROR_EVENTS.forEach((e: string) => process.on(e, (err) => catchError(err)));

    ///////////////////////////////////////////////////////////////////////////////////

    const app = express();

    const httpServer = http.createServer(app);

    const resolvers = {
      Query: {
        ...products.Query,
      },
      Mutation: {
        ...products.Mutation,
      },
    };

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],

      formatError: (formattedError, error) => {
        logger.error({
          service: "service-product",
          event: "graphql.error",
          message: "service-product graphql error",
          error: formattedError,
          stack: error,
        });

        return normalizeGraphError(error);
      },
    });

    const databasePort = parseInt(process.env.DATABASE_PORT as string);

    database.connect({
      host: process.env.DATABASE_HOST,
      port: databasePort,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    });

    const rateLimiter = new RateLimiter({
      source: "service-product",
      redisUrl: process.env.REDIS_RATELIMIT_HOST as string,
      jwtSecret: process.env.AGENT_JWT_KEY as string,
      maxRequests: 100,
      windowSeconds: 60,
    });

    const sessionOptions: object = {
      name: "session",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      signed: false,
      secure: false,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "lax" : "lax",
    };

    app.set("trust proxy", 1);

    app.use(cookieSession(sessionOptions));

    app.use(express.json({ limit: "5mb" }));

    app.use(express.urlencoded({ limit: "5mb", extended: true }));

    app.use(getPublicAddress);

    app.use(sellerMiddleware);

    await server.start();

    app.use(
      "/api/product/graphql",
      expressMiddleware(server, {
        context: async ({ req }) => {
          if (!req.sellerData) {
            throw new ApiGraphQLError(401, "Unauthorized", {
              code: ERROR_CODES.UNAUTHORIZED,
            });
          }

          const sellerData = req.sellerData as SellerToken;

          const allowed = await rateLimiter.checkId(sellerData.id);

          if (!allowed) {
            throw new ApiGraphQLError(429, "Rate limit exceeded", {
              code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
            });
          }

          return { sellerData };
        },
      })
    );

    await new Promise<void>((resolve) =>
      httpServer.listen({ port: 8001 }, resolve)
    );

    logger.info("Online");
  } catch (err) {
    catchError(err);
  }
};

main();
