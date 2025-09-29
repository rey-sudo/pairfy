import "express-async-errors";
import express from "express";
import helmet from "helmet";
import cookieSession from "cookie-session";
import { getPublicAddress, sellerMiddleware } from "@lovelacers/common";

const app = express();

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

app.use(helmet());

app.use(getPublicAddress);

app.use(sellerMiddleware);

export { app };
