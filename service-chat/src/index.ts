import express from "express";
import Redis from "ioredis";
import cookieSession from "cookie-session";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { catchError } from "./utils/index.js";
import { redisClient } from "./database/redis.js";
import { typeDefs } from "./graphql/types.js";
import { messages } from "./graphql/resolvers.js";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { useServer } from "graphql-ws/lib/use/ws";
import { WebSocketServer } from "ws";
import { createServer } from "http";
import {
  ApiGraphQLError,
  ERROR_CODES,
  ERROR_EVENTS,
  getPublicAddress,
  logger,
  normalizeGraphError,
  RateLimiter,
  verifyToken,
} from "@lovelacers/common";
import { agentMiddleware } from "./common/agent.js";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

const main = async () => {
  try {
    const requiredEnvVars = ["AGENT_JWT_KEY", "REDIS_CHAT_HOST", "REDIS_RATELIMIT_HOST"];

    for (const varName of requiredEnvVars) {
      if (!process.env[varName]) {
        throw new Error(`${varName} error`);
      }
    }

    ERROR_EVENTS.forEach((e: string) =>
      process.on(e, (err) => catchError(err))
    );

    //////////////////////////////////////////////////////////////////////////////////////////////////

    await redisClient
      .connect({
        url: process.env.REDIS_CHAT_HOST,
        connectTimeout: 100000,
        keepAlive: 100000,
        retryStrategy: (times: any) => Math.min(times * 50, 2000),
      })
      .then(() => console.log("✅ redisClient connected"))
      .catch((err: any) => catchError(err));
      
    const pubsubOptions = {
      connectTimeout: 100000,
      keepAlive: 100000,
      retryStrategy: (times: any) => Math.min(times * 50, 2000),
    };

    const pubSub = new RedisPubSub({
      publisher: new Redis(process.env.REDIS_CHAT_HOST as string, pubsubOptions),
      subscriber: new Redis(process.env.REDIS_CHAT_HOST as string, pubsubOptions),
    });

    const rateLimiter = new RateLimiter({
      source: "service-chat",
      redisUrl: process.env.REDIS_RATELIMIT_HOST as string,
      jwtSecret: process.env.AGENT_JWT_KEY as string,
      maxRequests: 100,
      windowSeconds: 60,
    });

    const app = express();

    const httpServer = createServer(app);

    const resolvers = {
      Query: {
        ...messages.Query,
      },
      Mutation: {
        ...messages.Mutation,
      },
    };

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
      formatError: (formattedError, error) => {
        logger.error({
          service: "service-chat",
          event: "graphql.error",
          message: "service-chat graphql error",
          error: formattedError,
          stack: error,
        });

        return normalizeGraphError(error);
      },
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
      "/api/chat/graphql",
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
            redisClient: redisClient.client,
            pubSub,
          };
        },
      })
    );

    await new Promise<void>((resolve) =>
      httpServer.listen({ port: 8010 }, resolve)
    );

    logger.info("ONLINE");
  } catch (err) {
    catchError(err);
  }
};

main();
