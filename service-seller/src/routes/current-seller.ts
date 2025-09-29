import database from "../database/index.js";
import { Request, Response } from "express";
import { ApiError, ERROR_CODES, sellerMiddleware } from "@lovelacers/common";
import { findSellerPrivateKey } from "../common/findSellerPrivateKey.js";

export const currentSellerMiddlewares: any = [sellerMiddleware];

export const currentSellerHandler = async (req: Request, res: Response) => {
  let connection = null;

  try {
    if (!req.sellerData) {
      throw new ApiError(401, "Invalid credentials", {
        code: ERROR_CODES.INVALID_CREDENTIALS,
      });
    }
    
    connection = await database.client.getConnection();

    const encryptedPrivateKey = await findSellerPrivateKey(
      connection,
      req.sellerData.id
    );

    const sellerData = {
      ...req.sellerData,
      rsa_private_key: encryptedPrivateKey,
    };

    res.status(200).send({ success: true, data: sellerData });
  } catch (err: any) {
    throw err;
  } finally {
    if (connection) connection.release();
  }
};
