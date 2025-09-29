import database from "../database/index.js";
import validatedUpload from "../utils/multer.js";
import {
  sellerRequired,
  getFileId,
  ApiError,
  ERROR_CODES,
  SellerToken,
} from "@lovelacers/common";
import { Request, Response, RequestHandler, NextFunction } from "express";
import { minioClient } from "../database/minio.js";
import { insertFile, mediaGroupExists } from "../utils/media.js";

const updateFilesMiddlewares: RequestHandler[] = [
  sellerRequired,
  validatedUpload,
];

const updateFilesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let connection: any = null;
  const newIds: string[] = [];
  const oldIds: string[] = [];

  try {
    const SELLER = req.sellerData as SellerToken;

    const files = req.files as Express.Multer.File[];

    if (!files?.length) {
      throw new ApiError(400, "No valid files uploaded", {
        code: ERROR_CODES.VALIDATION_ERROR,
      });
    }

    const mediaGroupId = req.body.mediaGroupId;

    connection = await database.client.getConnection();

    const validGroup = await mediaGroupExists(
      connection,
      mediaGroupId,
      SELLER.id
    );

    if (!validGroup) {
      throw new ApiError(400, "Invalid media group", {
        code: ERROR_CODES.VALIDATION_ERROR,
      });
    }

    const originalIds = req.body.fileIds

    console.log(originalIds, req.body.mediaGroupId);

    await connection.beginTransaction();

    ///////////////////////////////////////////////////////////////////////////////////////

    const timestamp = Date.now();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const fileId = getFileId();

      const mediaPath = `groups/${mediaGroupId}/${fileId}-${file.originalname}`;

      await minioClient.client.putObject(
        process.env.MINIO_BUCKET as string,
        mediaPath,
        file.buffer,
        file.size,
        {
          "Content-Type": file.mimetype,
        }
      );

      const fileScheme = {
        id: fileId,
        media_group_id: mediaGroupId,
        agent_id: SELLER.id,
        mime_type: file.mimetype,
        position: i,
        filename: file.originalname,
        media_path: mediaPath,
        status: "pending",
        created_at: timestamp,
      };

      await insertFile(connection, fileScheme);

      newIds.push(fileId);
      oldIds.push(originalIds[i]);
    }

    ///////////////////////////////////////////////////////////////////////////////////////

    await connection.commit();

    res.status(200).send({
      success: true,
      data: {
        media_group_id: mediaGroupId,
        file_ids: newIds,
        old_ids: oldIds,
      },
    });
  } catch (error) {
    if (connection) await connection.rollback();

    next(error);
  } finally {
    if (connection) connection.release();
  }
};

export { updateFilesMiddlewares, updateFilesHandler };
