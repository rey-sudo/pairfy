import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { logger, SellerToken, UserToken } from "@lovelacers/common";

declare global {
  interface Request {
    sellerData?: SellerToken;
  }
}

declare global {
  interface Request {
    userData?: UserToken;
  }
}

export const agentMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const privateKey = process.env.AGENT_JWT_KEY as string;

    const sessionData = jwt.verify(req.session.jwt, privateKey) as any;

    if (sessionData.role === "SELLER") {
      req.sellerData = sessionData;

      return next();
    }

    if (sessionData.role === "USER") {
      req.userData = sessionData;

      return next();
    }
  } catch (err) {
    logger.error(err);
  }

  return next();
};
