import database from "../../database/client.js";
import { receivedTransactionBuilder } from "../../cardano/builders/received.js";
import { ApiGraphQLError, ERROR_CODES, UserToken } from "@lovelacers/common";
import { findOrderByUser } from "../../common/findOrderByUser.js";
import { receivedEndpointSchema } from "../../validators/cardano/received.js";

export const receivedEndpoint = async (_: any, args: any, context: any) => {
  let connection = null;

  try {
    if (!context.userData) {
      throw new ApiGraphQLError(401, "Invalid credentials", {
        code: ERROR_CODES.UNAUTHORIZED,
      });
    }

    const validateParams = receivedEndpointSchema.safeParse(
      args.receivedEndpointInput
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

    const { userData: USER } = context as { userData: UserToken };

    connection = await database.client.getConnection();

    const ORDER = await findOrderByUser(
      connection,
      params.order_id,
      USER.pubkeyhash
    );

    if (!ORDER) {
      throw new ApiGraphQLError(404, "Order not found", {
        code: ERROR_CODES.NOT_FOUND,
      });
    }

    if (ORDER.finished) {
      throw new Error("ORDER_FINISHED");
    }

    if (ORDER.contract_state === 3) {
      throw new Error("ALREADY_RECEIVED");
    }

    if (ORDER.contract_state !== 2) {
      throw new Error("WRONG_STATE");
    }

    const BUILDER = await receivedTransactionBuilder(
      USER.address,
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
