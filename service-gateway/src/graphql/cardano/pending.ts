import database from "../../database/client.js";
import { pendingTransactionBuilder } from "../../cardano/builders/pending.js";
import {
  getContractFee,
  getContractPrice,
  getContractQuote,
} from "../../lib/index.js";
import { pendingEndpointSchema } from "../../validators/cardano/pending.js";
import {
  ApiGraphQLError,
  ERROR_CODES,
  findProductById,
  findSellerById,
  UserToken,
  compress,
} from "@lovelacers/common";
import { redisChat, redisPrice } from "../../database/redis.js";
import { insertOrder } from "../../lib/order.js";
import { chunkMetadata } from "../../lib/metadata.js";
import { createChat } from "../../lib/chat.js";

export const pendingEndpoint = async (_: any, args: any, context: any) => {
  let connection = null;

  try {
    if (!context.userData) {
      throw new ApiGraphQLError(401, "Invalid Credentials", {
        code: ERROR_CODES.UNAUTHORIZED,
      });
    }

    const validateParams = pendingEndpointSchema.safeParse(
      args.pendingEndpointInput
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

    const timestamp = Date.now();

    const { userData: USER } = context as { userData: UserToken };

    connection = await database.client.getConnection();

    const findProduct = await findProductById(connection, params.product_id);

    if (!findProduct) {
      throw new ApiGraphQLError(404, "Product not found", {
        code: ERROR_CODES.NOT_FOUND,
      });
    }

    const findSeller = await findSellerById(connection, findProduct.seller_id);

    if (!findSeller) {
      throw new ApiGraphQLError(404, "Seller not found", {
        code: ERROR_CODES.NOT_FOUND,
      });
    }

    const getAssetPrice = await redisPrice.client.get(`price:${params.asset}`);

    if (!getAssetPrice) {
      throw new ApiGraphQLError(404, "Asset not found", {
        code: ERROR_CODES.NOT_FOUND,
      });
    }

    const assetPrice = parseFloat(getAssetPrice);

    //////////////////////////////////////////////////////////////////////////////////// START TRANSACTION

    await connection.beginTransaction();

    const contractPrice: number = getContractPrice(
      findProduct.discount,
      findProduct.discount_value,
      findProduct.price,
      params.order_units,
      assetPrice,
      params.asset
    );

    const contractQuote: number = getContractQuote(
      findProduct.discount,
      findProduct.discount_value,
      findProduct.price,
      params.order_units
    );

    const contractFee: number = getContractFee(contractPrice, 10);

    const operatorPkh = process.env.OPERATOR_PKH as string;

    console.log(operatorPkh);

    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    const scheme = {
      public: {},
      private: "x".repeat(344),
    };

    const metadata = chunkMetadata(JSON.stringify(scheme), 64);

    const BUILDER = await pendingTransactionBuilder(
      operatorPkh,
      USER.address,
      findSeller.pubkeyhash,
      BigInt(contractPrice),
      BigInt(contractFee),
      metadata
    );

    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    const orderContent = {
      id: BUILDER.threadTokenPolicyId,
      type: "cardano",
      seller_id: findProduct.seller_id,
      country: findProduct.country,
      buyer_pubkeyhash: USER.pubkeyhash,
      buyer_address: USER.address,
      buyer_wallet: USER.wallet_name,
      buyer_username: USER.username,
      buyer_rsa_version: USER.rsa_version,
      buyer_rsa_public_key: USER.rsa_public_key,
      seller_pubkeyhash: findSeller.pubkeyhash,
      seller_address: findSeller.address,
      seller_wallet: findSeller.wallet_name,
      seller_username: findSeller.username,
      seller_rsa_version: findSeller.rsa_version,
      product_id: findProduct.id,
      product_snapshot: compress(findProduct),
      contract_address: BUILDER.stateMachineAddress,
      contract_params: BUILDER.serializedParams,
      contract_price: contractPrice,
      contract_quote: contractQuote,
      contract_fee: contractFee,
      contract_units: params.order_units,
      asset_name: params.asset,
      asset_price: assetPrice,
      watch_until: BUILDER.watchUntil,
      pending_until: BUILDER.pendingUntil,
      shipping_until: BUILDER.shippingUntil,
      expire_until: BUILDER.expireUntil,
      created_at: timestamp,
      updated_at: timestamp,
      schema_v: 0,
    };

    const [insert1] = await insertOrder(connection, orderContent);

    if (insert1.affectedRows !== 1) {
      throw new ApiGraphQLError(500, "Error creating order", {
        code: ERROR_CODES.INTERNAL_ERROR,
      });
    }

    const chatKey = `chat:${orderContent.id}:${orderContent.buyer_pubkeyhash}:${orderContent.seller_id}`;

    await createChat(
      redisChat.client,
      chatKey,
      orderContent.buyer_pubkeyhash,
      "Hello 👋"
    );

    //////////////////////////////////////////////////////////////////////////////////// END TRANSACTION

    await connection.commit();

    return {
      success: true,
      message:
        "The transaction has been generated successfully, sign it and send it to the network.",
      data: {
        cbor: BUILDER.cbor,
        order: BUILDER.threadTokenPolicyId,
        seller_rsa_public_key: findSeller.rsa_public_key,
      },
    };
  } catch (err: any) {
    if (connection) await connection.rollback();

    throw err;
  } finally {
    if (connection) connection.release();
  }
};
