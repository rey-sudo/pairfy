import { Request, Response, NextFunction } from "express";
import { ApiError, ERROR_CODES } from "@lovelacers/common";
import { verifyParams } from "../validators/get-file.js";
import { minioClient } from "../database/minio.js";

export const getFileMiddlewares: any = [];

export const getFileHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (process.env.NODE_ENV !== "development") {
      throw new ApiError(403, "Access denied", {
        code: ERROR_CODES.FORBIDDEN
      });
    }

    const validateParams = verifyParams.safeParse(req.params);

    if (!validateParams.success) {
      throw new ApiError(400, "Invalid input", {
        code: ERROR_CODES.VALIDATION_ERROR,
        details: validateParams.error.format(),
      });
    }

    const { groupId, filename } = validateParams.data;

    if (!groupId || !filename) {
      throw new ApiError(400, "Missing groupId or filename", {
        code: ERROR_CODES.VALIDATION_ERROR,
      });
    }

    const mediaPath = `groups/${groupId}/${filename}`;

    const stream = await minioClient.client.getObject(process.env.MINIO_BUCKET as string, mediaPath);

    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

    res.setHeader("Access-Control-Allow-Origin", "*");

    stream.pipe(res);
  } catch (err) {
    next(err);
  }
};
