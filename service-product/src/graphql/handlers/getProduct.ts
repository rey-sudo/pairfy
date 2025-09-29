import database from "../../database/client.js";
import {
  ApiGraphQLError,
  ERROR_CODES,
  findProductBySeller,
  findMediasByProductId,
  sortMediaByPosition
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
  
    const SELLER = context.sellerData;
  
    connection = await database.client.getConnection();

    const findProduct = await findProductBySeller(
      connection,
      params.id,
      SELLER.id
    );

    if (!findProduct) {
      throw new ApiGraphQLError(404, "Product not found", {
        code: ERROR_CODES.NOT_FOUND,
      });
    }

    const findMedia = await findMediasByProductId(connection, findProduct.id);

    const response = {
      product: findProduct,
      media: findMedia.length ? sortMediaByPosition(findProduct.media_position, findMedia) : []
    };

    return response;
  } catch (error: any) {
    throw error;
  } finally {
    if (connection) connection.release();
  }
};
