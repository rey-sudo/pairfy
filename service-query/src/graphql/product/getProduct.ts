import { database } from "../../database/client.js";
import {
  ApiGraphQLError,
  ERROR_CODES,
  findMediasByProductId,
  sortMediaByPosition,
  findProductById,
} from "@lovelacers/common";
import { getProductSchema } from "../../validators/getProduct.js";

export const getProduct = async (_: any, args: any, context: any) => {
  let connection = null;

  try {
    const validateParams = getProductSchema.safeParse(args.getProductInput);

    if (!validateParams.success) {
      throw new ApiGraphQLError(
        400,
        `Invalid params ${JSON.stringify(validateParams.error.flatten())}`,
        {
          code: ERROR_CODES.VALIDATION_ERROR,
        }
      );
    }

    const params = validateParams.data;

    console.log(params); //TEST

    connection = await database.client.getConnection();

    const findProduct = await findProductById(connection, params.id);

    if (!findProduct) {
      throw new ApiGraphQLError(404, "Product not found", {
        code: ERROR_CODES.NOT_FOUND,
      });
    }

    const product = findProduct;

    const findMedia = await findMediasByProductId(connection, product.id);

    const response = {
      product,
      media: findMedia.length
        ? sortMediaByPosition(product.media_position, findMedia)
        : [],
    };

    return response;
  } catch (err: any) {
    throw err;
  } finally {
    if (connection) connection.release();
  }
};
