import express from "express";
import http from "http";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { catchError, errorEvents } from "./utils/index.js";
import { assets, books, feed, products } from "./graphql/resolvers.js";
import { database } from "./database/client.js";
import { typeDefs } from "./graphql/types.js";
import { redisPriceClient, redisFeedClient, redisBooks } from "./database/redis.js";
import {
  ApiGraphQLError,
  ERROR_CODES,
  getPublicAddress,
  logger,
  normalizeGraphError,
  RateLimiter,
} from "@lovelacers/common";

const main = async () => {
  try {
    const requiredEnvVars = [
      "NODE_ENV",
      "DATABASE_HOST",
      "DATABASE_PORT",
      "DATABASE_USER",
      "DATABASE_PASSWORD",
      "DATABASE_NAME",
      "AGENT_JWT_KEY",
      "EMBEDDING_HOST",
      "REDIS_PRICE_HOST",
      "REDIS_FEED_HOST",
      "REDIS_BOOKS_HOST",
      "REDIS_RATELIMIT_HOST",
    ];

    for (const varName of requiredEnvVars) {
      if (!process.env[varName]) {
        throw new Error(`${varName} error`);
      }
    }

    errorEvents.forEach((e: string) => process.on(e, (err) => catchError(err)));

    console.log("✅ ENV variables configured");

    ///////////////////////////////////////////////////////////////////////////////////

    const app = express();

    const httpServer = http.createServer(app);

    const resolvers = {
      Query: {
        ...products.Query,
        ...assets.Query,
        ...feed.Query,
        ...books.Query
      },
    };

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
      formatError: (formattedError, error) => {
        logger.error({
          service: "service-query",
          event: "graphql.error",
          message: "service-query graphql error",
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

    console.log("✅ database connected");

    await redisPriceClient
      .connect({
        url: process.env.REDIS_PRICE_HOST,
        connectTimeout: 100000,
        keepAlive: 100000,
      })
      .then(() => console.log("✅ redisPriceClient connected"))
      .catch((err: any) => catchError(err));

    await redisFeedClient
      .connect({
        url: process.env.REDIS_FEED_HOST,
        connectTimeout: 100000,
        keepAlive: 100000,
      })
      .then(() => console.log("✅ redisFeedClient connected"))
      .catch((err: any) => catchError(err));

    await redisBooks
      .connect({
        url: process.env.REDIS_BOOKS_HOST,
        connectTimeout: 100000,
        keepAlive: 100000,
      })
      .then(() => console.log("✅ redisBooksClient connected"))
      .catch((err: any) => catchError(err));

    const rateLimiter = new RateLimiter({
      source: "service-query",
      redisUrl: process.env.REDIS_RATELIMIT_HOST as string,
      jwtSecret: process.env.AGENT_JWT_KEY as string,
      maxRequests: 100,
      windowSeconds: 60,
    });

    console.log("✅ rateLimiter configured");

    app.set("trust proxy", 1);

    app.use(express.json({ limit: "1mb" }));

    app.use(express.urlencoded({ limit: "1mb", extended: true }));

    app.use(getPublicAddress);

    await server.start();

    app.use(
      "/api/query/graphql",
      expressMiddleware(server, {
        context: async ({ req }) => {
          const publicAddress = req.publicAddress;

          if (!publicAddress) {
            throw new ApiGraphQLError(401, "Unauthorized", {
              code: ERROR_CODES.UNAUTHORIZED,
            });
          }

          const allowed = await rateLimiter.checkIp(publicAddress);

          if (!allowed) {
            throw new ApiGraphQLError(429, "Rate limit exceeded", {
              code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
            });
          }

          return { publicAddress };
        },
      })
    );

    await new Promise<void>((resolve) =>
      httpServer.listen({ port: 8004 }, resolve)
    );

    logger.info("Online");
  } catch (err) {
    catchError(err);
  }
};

main();
