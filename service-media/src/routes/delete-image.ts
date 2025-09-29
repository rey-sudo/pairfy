import database from "../database/index.js";
import { Request, Response } from "express";
import { sellerMiddleware, sellerRequired, SellerToken } from "@lovelacers/common";

const deleteImageMiddlewares: any = [sellerMiddleware, sellerRequired];

const deleteImageHandler = async (req: Request, res: Response) => {

  const SELLER = req.sellerData as SellerToken;

  const params = req.body;

  let connection: any = null;

  try {
    connection = await database.client.getConnection();

    await connection.beginTransaction();

    for (const mediaName of params.images) {
      const [result] = await connection.execute(
        "DELETE FROM media WHERE media_name = ? AND seller_id = ?",
        [mediaName, SELLER.id]
      );

      if (result.affectedRows !== 1) {
        throw new Error("INTERNAL_ERROR");
      }
    }

    await connection.commit();

    res.status(200).send({ success: true });
  } catch (err: any) {
    await connection.rollback();

  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export { deleteImageMiddlewares, deleteImageHandler };
