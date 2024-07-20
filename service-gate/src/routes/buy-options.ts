import DB from "../db";
import { Request, Response } from "express";
import { BadRequestError } from "../errors";
import { _ } from "../utils/pino";

const buyOptionsMiddlewares: any = [];

const buyOptionsHandler = async (req: Request, res: Response) => {
  const params = req.params;

  let connection = null;

  try {
    connection = await DB.client.getConnection();

    const [products] = await connection.execute(
      `
      SELECT *
      FROM products
      WHERE id = ?
      `,
      [params.id]
    );

    if (products.length === 0) {
      throw new BadRequestError("NO_PRODUCT");
    }

    const [response] = await connection.execute(
      `
      SELECT
        id,
        mode,
        contract_units,
        contract_price,
        contract_collateral,
        product_discount,
        COUNT(*) OVER (PARTITION BY product_id, contract_stage) AS slot_count
      FROM 
        slots
      WHERE
        product_id = ?
      AND
        contract_stage = ?    
      `,
      [params.id, "waiting"]
    );

    await connection.commit();

    res.status(200).send({ success: true, payload: response });
  } catch (err: any) {
    await connection.rollback();

    _.error(err);

    res.status(200).send({ success: false });
  } finally {
    connection.release();
  }
};

export { buyOptionsMiddlewares, buyOptionsHandler };
