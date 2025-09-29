import express from "express";
import http from "http";
import cookieSession from "cookie-session";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { catchError } from "./utils/index.js";
import { database } from "./database/client.js";
import { typeDefs } from "./graphql/types.js";
import { notification } from "./graphql/resolvers.js";
import { agentMiddleware } from "./common/agentAuth.js";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApiGraphQLError, ERROR_CODES, ERROR_EVENTS, getPublicAddress, logger, normalizeGraphError, RateLimiter } from "@lovelacers/common";

const main = async () => {
  try {
    const requiredEnvVars = [
      "DATABASE_HOST",
      "DATABASE_PORT",
      "DATABASE_USER",
      "DATABASE_PASSWORD",
      "DATABASE_NAME",
      "AGENT_JWT_KEY",
      "REDIS_RATELIMIT_HOST"
    ];
    
    for (const varName of requiredEnvVars) {
      if (!process.env[varName]) {
        throw new Error(`${varName} error`);
      }
    }

    ERROR_EVENTS.forEach((e: string) => process.on(e, (err) => catchError(err)));

    ///////////////////////////////////////////////////////////////////////
    
    const app = express();

    const httpServer = http.createServer(app);
    
    const resolvers = {
      Query: {
        ...notification.Query,
      },
      Mutation: {
        ...notification.Mutation,
      },
    };
    
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
      formatError: (formattedError, error) => {
        logger.error({
          service: "service-notification",
          event: "graphql.error",
          message: "service-notification graphql error",
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
      source: "service-notification",
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
      "/api/notification/graphql",
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
            userData
          };
        },
      })
    );

    await new Promise<void>((resolve) =>
      httpServer.listen({ port: 8009 }, resolve)
    );

    logger.info("ONLINE");
  } catch (err) {
    catchError(err);
  }
};

main();
