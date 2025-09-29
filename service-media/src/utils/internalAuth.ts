import type { Request, Response, NextFunction } from "express";
import { ApiError, ERROR_CODES } from "@lovelacers/common";

const INTERNAL_SECRET = process.env.INTERNAL_ENDPOINT_SECRET;

if (!INTERNAL_SECRET) {
  throw new Error("INTERNAL_SECRET must be defined");
}

export function internalAuth(req: Request, _res: Response, next: NextFunction) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    throw new ApiError(401, "Unauthorized: missing or malformed Authorization header", {
      code: ERROR_CODES.VALIDATION_ERROR,
    });
  }

  const token = auth.replace("Bearer ", "").trim();

  if (token !== INTERNAL_SECRET) {
    throw new ApiError(403, "Forbidden: invalid internal secret", {
      code: ERROR_CODES.VALIDATION_ERROR,
    });
  }

  next();
}
