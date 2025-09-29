import express from "express";
import database from "../database/index.js";
import { ApiError, createEvent, ERROR_CODES } from "@lovelacers/common";
import type { Request, Response, NextFunction } from "express";
import { verifyParams } from "../validators/verify-group.js";
import { internalAuth } from "../utils/internalAuth.js";
import { generateMediaUrl } from "../utils/index.js";

export const verifyGroupMiddlewares: any = [
  express.json({ limit: "1mb", strict: true, type: ["application/json"] }),
  internalAuth,
];

export const verifyGroupHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let connection;

  try {
    const validateParams = verifyParams.safeParse(req.body);

    if (!validateParams.success) {
      throw new ApiError(400, "Invalid input", {
        code: ERROR_CODES.VALIDATION_ERROR,
        details: validateParams.error.format(),
      });
    }

    console.log(validateParams.data);

    const { product_id, media_group_id, agent_id, file_ids } =
      validateParams.data;

    connection = await database.client.getConnection();

    await connection.beginTransaction();

    ///////////////////////////////////////////////////////////////////////////////////////////

    const timestamp = Date.now();

    const [rows] = await connection.query(
      `SELECT * FROM files 
         WHERE media_group_id = ? 
         AND agent_id = ?
         AND id IN (?)`,
      [media_group_id, agent_id, file_ids]
    );

    if (rows.length === 0) {
      throw new ApiError(404, "No matching files found", {
        code: ERROR_CODES.NOT_FOUND,
      });
    }

    const foundIds = rows.map((r: any) => r.id);

    const missing = file_ids.filter((id) => !foundIds.includes(id));

    if (missing.length > 0) {
      throw new ApiError(404, "Missing file_ids", {
        code: ERROR_CODES.NOT_FOUND,
      });
    }

    await connection.query(
      `
       UPDATE files SET status = 'processing' 
       WHERE id IN (?) 
       AND media_group_id = ? 
       AND agent_id = ?
       AND status = 'pending'
       `,
      [foundIds, media_group_id, agent_id]
    );

    const pendingFiles = rows.filter((file: any) => file.status === "pending");

    for (const file of pendingFiles) {
      file.product_id = product_id;

      await createEvent(
        connection,
        timestamp,
        "service-media",
        "CreateFile",
        JSON.stringify(file),
        agent_id
      );
    }

    const firstFile = rows.filter((file: any) => file.id === file_ids[0]);

    const thumbnail_url = generateMediaUrl(
      media_group_id,
      firstFile[0].id,
      firstFile[0].filename,
      "small",
      "webp"
    );
    
    ///////////////////////////////////////////////////////////////////////////////////////////

    await connection.commit();

    res.status(200).json({
      success: true,
      data: { media_group_id, file_ids, thumbnail_url },
    });
  } catch (error) {
    if (connection) await connection.rollback();
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
