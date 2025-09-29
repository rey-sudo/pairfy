import database from "../database/index.js";
import validatedUpload from "../utils/multer.js";
import {
  getMediaGroupId,
  sellerRequired,
  getFileId,
  ApiError,
  ERROR_CODES,
  SellerToken,
} from "@lovelacers/common";
import { Request, Response, RequestHandler, NextFunction } from "express";
import { minioClient } from "../database/minio.js";

const createFilesMiddlewares: RequestHandler[] = [
  sellerRequired,
  validatedUpload,
];

const createFilesHandler = async (req: Request, res: Response, next: NextFunction) => {
  let connection: any = null;
  const response: string[] = [];

  try {
    const SELLER = req.sellerData as SellerToken;

    const files = req.files as Express.Multer.File[];

    if (!files?.length) {
      throw new ApiError(400, "No valid files uploaded", {
        code: ERROR_CODES.VALIDATION_ERROR,
      });
    }

    connection = await database.client.getConnection();

    await connection.beginTransaction();

    ///////////////////////////////////////////////////////////////////////////////////////

    const mediaGroupId = getMediaGroupId();

    const timestamp = Date.now();

    for (let i = 0; i < files.length; i++) {

      const file = files[i];

      const position = i;

      const fileId = getFileId();

      const mediaPath = `groups/${mediaGroupId}/${fileId}-${file.originalname}`;

      await minioClient.client.putObject(process.env.MINIO_BUCKET as string, mediaPath, file.buffer, file.size, {
        "Content-Type": file.mimetype,
      });

      await connection.execute(
        `
        INSERT INTO files (
          id,
          media_group_id,
          agent_id,
          mime_type,
          position,
          filename,
          media_path,
          status,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          fileId,
          mediaGroupId,
          SELLER.id,
          file.mimetype,
          position,
          file.originalname,
          mediaPath,
          "pending",
          timestamp,
        ]
      );

      response.push(fileId);
    }

    ///////////////////////////////////////////////////////////////////////////////////////

    await connection.commit();

    res.status(200).send({
      success: true,
      data: {
        media_group_id: mediaGroupId,
        file_ids: response,
      },
    });
  } catch (error) {
    if (connection) await connection.rollback();
    
    next(error)
  } finally {
    if (connection) connection.release();
  }
};

export { createFilesMiddlewares, createFilesHandler };
