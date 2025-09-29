import "express-async-errors";
import cookieSession from "cookie-session";
import express from "express";
import helmet from "helmet";
import { getPublicAddress } from "@lovelacers/common";

const app = express();

const sessionOptions: object = {
  name: 'session',
  maxAge: 7 * 24 * 60 * 60 * 1000, 
  signed: false,
  secure: false,
  httpOnly: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax'
};

app.set("trust proxy", 1);

app.use(helmet());

app.use(express.json({ limit: '1mb' }));

app.use(express.urlencoded({ limit: '1mb', extended: true }));

app.use(cookieSession(sessionOptions));

app.use(getPublicAddress);

export { app };

//END
