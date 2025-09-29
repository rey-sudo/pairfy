import database from "../../database/client.js";
import {
  ApiGraphQLError,
  createEvent,
  ERROR_CODES,
  findProductBySeller,
  SellerToken,
  deleteProductById
} from "@lovelacers/common";
import { verifyParams } from "../../validators/deleteProduct.js";

export const deleteProduct = async (_: any, args: any, context: any) => {
  const timestamp = Date.now();

  let connection = null;

  try {
    const validateParams = verifyParams.safeParse(args.deleteProductInput);

    if (!validateParams.success) {
      const errors = JSON.stringify(validateParams.error.flatten());
      throw new ApiGraphQLError(400, `Validation failed: ${errors}`, {
        code: ERROR_CODES.VALIDATION_ERROR,
      });
    }

    const params = validateParams.data;

    const SELLER = context.sellerData as SellerToken;

    connection = await database.client.getConnection();

    await connection.beginTransaction();

    ////////////////////////////////////////////////////////////////////

    const findProduct = await findProductBySeller(
      connection,
      params.id,
      SELLER.id
    );

    if (!findProduct) {
      throw new ApiGraphQLError(404, "The product does not exist.", {
        code: ERROR_CODES.NOT_FOUND,
      });
    }

    const isDeleted = await deleteProductById(
      connection,
      findProduct.id,
      findProduct.schema_v
    );

    if (isDeleted.affectedRows !== 1) {
      throw new ApiGraphQLError(404, "Product not found or version mismatch.", {
        code: ERROR_CODES.NOT_FOUND,
      });
    }

    await createEvent(
      connection,
      timestamp,
      "service-product",
      "DeleteProduct",
      JSON.stringify(findProduct),
      SELLER.id
    );

    ////////////////////////////////////////////////////////////////////

    await connection.commit();

    return {
      success: true,
      message: "The product has been deleted successfully.",
    };
  } catch (err: any) {
    if (connection) await connection.rollback();
    throw err;
  } finally {
    if (connection) connection.release();
  }
};
