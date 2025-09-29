import database from "../../database/client.js";
import { ApiGraphQLError, ERROR_CODES, SellerToken } from "@lovelacers/common";
import { collectedTransactionBuilder } from "../../cardano/builders/collected.js";
import { findOrderBySeller } from "../../common/findOrderBySeller.js";
import { collectedEndpointSchema } from "../../validators/cardano/collected.js";

export const collectedEndpoint = async (_: any, args: any, context: any) => {
  let connection = null;

  try {
    if (!context.sellerData) {
      throw new ApiGraphQLError(401, "Invalid credentials", {
        code: ERROR_CODES.UNAUTHORIZED,
      });
    }

    const validateParams = collectedEndpointSchema.safeParse(
      args.collectedEndpointInput
    );

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

    const { sellerData: SELLER } = context as {
      sellerData: SellerToken;
    };

    connection = await database.client.getConnection();

    const ORDER = await findOrderBySeller(
      connection,
      params.order_id,
      SELLER.id
    );

    if (!ORDER) {
      throw new ApiGraphQLError(404, "Order not found", {
        code: ERROR_CODES.NOT_FOUND,
      });
    }

    if (ORDER.finished) {
      throw new Error("ORDER_FINISHED");
    }

    if (ORDER.contract_state === 4) {
      throw new Error("ALREADY_COLLECTED");
    }

    if (![2, 3].includes(ORDER.contract_state)) {
      throw new Error("WRONG_STATE");
    }

    const BUILDER = await collectedTransactionBuilder(
      SELLER.address,
      ORDER.contract_params
    );

    return {
      success: true,
      data: {
        cbor: BUILDER.cbor,
      },
    };
  } catch (err: any) {
    if (connection) await connection.rollback();

    throw err;
  } finally {
    if (connection) connection.release();
  }
};
