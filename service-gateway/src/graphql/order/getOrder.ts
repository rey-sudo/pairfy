import database from "../../database/client.js";
import { findOrderByUser } from "../../common/findOrderByUser.js";
import { ApiGraphQLError, ERROR_CODES, decompress } from "@lovelacers/common";
import { getOrderSchema } from "../../validators/getOrder.js";
import { findOrderBySeller } from "../../common/findOrderBySeller.js";

export const getOrder = async (_: any, args: any, context: any) => {
  let connection = null;

  try {
    const validateParams = getOrderSchema.safeParse(args.getOrderInput);

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

    console.log(params);

    const { sellerData: SELLER, userData: USER } = context;

    connection = await database.client.getConnection();

    if (USER) {
      const ORDER = await findOrderByUser(
        connection,
        params.id,
        USER.pubkeyhash
      );

      if (!ORDER) {
        throw new ApiGraphQLError(404, "Order not found", {
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      const product = decompress(ORDER.product_snapshot);

      const address = null;

      const shipping = ORDER.shipping_metadata;

      const session = `${ORDER.id}:${ORDER.buyer_pubkeyhash}:${ORDER.seller_id}`;

      return {
        order: ORDER,
        product,
        address,
        shipping,
        session
      };
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    if (SELLER) {
      const ORDER = await findOrderBySeller(connection, params.id, SELLER.id);

      if (!ORDER) {
        throw new ApiGraphQLError(404, "Order not found", {
          code: ERROR_CODES.NOT_FOUND,
        });
      }

      const product = decompress(ORDER.product_snapshot);

      const address = ORDER.pending_metadata;

      const shipping = ORDER.shipping_metadata;

      const session = `${ORDER.id}:${ORDER.buyer_pubkeyhash}:${ORDER.seller_id}`;

      return {
        order: ORDER,
        product,
        address,
        shipping,
        session,
      };
    }
  } catch (err: any) {
    throw err;
  } finally {
    if (connection) connection.release();
  }
};
