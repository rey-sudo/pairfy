import database from "../../database/client.js";
import { ApiGraphQLError, ERROR_CODES, findBookBySeller } from "@lovelacers/common";
import { verifyParams } from "../../validators/editBook.js";
import { updateBook } from "../../common/updateBook.js";
import { redisBooks } from "../../database/redis.js";

export const editBook = async (_: any, args: any, context: any) => {
  let connection = null;

  try {
    const validateParams = verifyParams.safeParse(args.editBookInput);

    if (!validateParams.success) {
      throw new ApiGraphQLError(
        400,
        `Invalid params: ${validateParams.error.flatten()}`,
        {
          code: ERROR_CODES.VALIDATION_ERROR,
        }
      );
    }

    const params = validateParams.data;

    console.log(params);

    const { sellerData: SELLER } = context;

    connection = await database.client.getConnection();

    const findBook = await findBookBySeller(connection, params.id, SELLER.id);

    if (!findBook) {
      throw new ApiGraphQLError(404, "The book does not exist", {
        code: ERROR_CODES.NOT_FOUND,
      });
    }

    await connection.beginTransaction();

    ///////////////////////////////////////////////////////////////// START TRANSACTION

    const updateContent = {
      keeping_stock: params.keeping_stock,
      ready_stock: params.ready_stock,
      purchase_limit: params.purchase_limit,
      purchase_limit_value: params.purchase_limit_value,
      stop_purchases: params.stop_purchases,
      schema_v: findBook.schema_v + 1
    };

    const update1 = await updateBook(
      connection,
      findBook.id,
      findBook.schema_v,
      updateContent
    );

    if (update1.affectedRows !== 1) {
      throw new ApiGraphQLError(409, "Version mismatch or not found", {
        code: ERROR_CODES.UPDATE_CONFLICT,
      });
    }

    const BOOK = await findBookBySeller(connection, findBook.id, findBook.seller_id);

    await redisBooks.client.set(findBook.id, JSON.stringify(BOOK))

    ///////////////////////////////////////////////////////////////// END TRANSACTION

    await connection.commit();

    return {
      success: true,
      message: "The book has been successfully updated.",
    };
  } catch (err: any) {
    if (connection) await connection.rollback();

    throw err;
  } finally {
    if (connection) connection.release();
  }
};
