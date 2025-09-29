import express from "express";
import http from "http";
import database from "./database/client.js";
import cookieSession from "cookie-session";
import { ApolloServer } from "@apollo/server";
import { catchError } from "./utils/index.js";
import { typeDefs } from "./graphql/types.js";
import { books, cardano, order } from "./graphql/resolvers.js";
import { agentMiddleware } from "./middleware/agent.js";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import {
  ApiGraphQLError,
  ERROR_CODES,
  ERROR_EVENTS,
  getPublicAddress,
  logger,
  normalizeGraphError,
  RateLimiter,
} from "@lovelacers/common";
import {
  redisBooks,
  redisState,
  redisPrice,
  redisChat,
} from "./database/redis.js";

const main = async () => {
  try {
    const requiredEnvVars = [
      "NODE_ENV",
      "NETWORK_ENV",
      "REDIS_STATE_HOST",
      "REDIS_RATELIMIT_HOST",
      "REDIS_BOOKS_HOST",
      "REDIS_PRICE_HOST",
      "REDIS_CHAT_HOST",
      "TX_VALID_TIME",
      "TX_WATCH_WINDOW",
      "PENDING_RANGE",
      "SHIPPING_RANGE",
      "APPEAL_RANGE",
      "DELIVERY_TOLERANCE",
      "AGENT_JWT_KEY",
      "EXPIRING_RANGE",
      "FEE_PERCENT",
      "DATABASE_NAME",
      "DATABASE_USER",
      "DATABASE_HOST",
      "DATABASE_PORT",
      "DATABASE_PASSWORD",
      "KUPO_KEY",
      "OGMIOS_KEY",
      "WEAVIATE_HOST",
      "OPERATOR_PKH"
    ];

    for (const varName of requiredEnvVars) {
      if (!process.env[varName]) {
        throw new Error(`${varName} error`);
      }
    }

    ERROR_EVENTS.forEach((e: string) =>
      process.on(e, (err) => catchError(err))
    );

    ////////////////////////////////////////////////////////////////////

    const app = express();

    const httpServer = http.createServer(app);

    const resolvers = {
      Query: {
        ...books.Query,
        ...order.Query,
      },
      Mutation: {
        ...books.Mutation,
        ...cardano.Mutation,
      },
    };

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
      formatError: (formattedError, error) => {
        logger.error({
          service: "service-gateway",
          event: "graphql.error",
          message: "service-gateway graphql error",
          error: formattedError,
          stack: error,
        });

        return normalizeGraphError(error);
      },
    });

    await redisState
      .connect({
        service: "service-gateway",
        url: process.env.REDIS_STATE_HOST,
        connectTimeout: 100000,
        keepAlive: 100000,
      })
      .then(() => console.log("✅ redisState connected"))
      .catch((err: any) => catchError(err));

    await redisPrice
      .connect({
        service: "service-gateway",
        url: process.env.REDIS_PRICE_HOST,
        connectTimeout: 100000,
        keepAlive: 100000,
      })
      .then(() => console.log("✅ redisPrice connected"))
      .catch((err: any) => catchError(err));

    await redisBooks
      .connect({
        service: "service-gateway",
        url: process.env.REDIS_BOOKS_HOST,
        connectTimeout: 100000,
        keepAlive: 100000,
      })
      .then(() => console.log("✅ redisBooks connected"))
      .catch((err: any) => catchError(err));

    await redisChat
      .connect({
        service: "service-gateway",
        url: process.env.REDIS_CHAT_HOST,
        connectTimeout: 100000,
        keepAlive: 100000,
      })
      .then(() => console.log("✅ redisChat connected"))
      .catch((err: any) => catchError(err));

    const databasePort = parseInt(process.env.DATABASE_PORT as string);

    database.connect({
      host: process.env.DATABASE_HOST,
      port: databasePort,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    });

    const rateLimiter = new RateLimiter({
      source: "service-gateway",
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

    app.use(agentMiddleware);

    await server.start();

    app.use(
      "/api/gateway/graphql",
      expressMiddleware(server, {
        context: async ({ req }) => {
          const { sellerData, userData } = req;
          
          if (!sellerData && !userData) {
            throw new ApiGraphQLError(401, "Unauthorized", {
              code: ERROR_CODES.UNAUTHORIZED,
            });
          }

          const agentId = sellerData?.id || userData.pubkeyhash;

          const isAllowed = await rateLimiter.checkId(agentId);

          if (!isAllowed) {
            throw new ApiGraphQLError(429, "Rate limit exceeded", {
              code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
            });
          }

          return {
            sellerData,
            userData,
          };
        },
      })
    );

    await new Promise<void>((resolve) =>
      httpServer.listen({ port: 8006 }, resolve)
    );

    logger.info("ONLINE");
  } catch (err) {
    catchError(err);
  }
};

main();
