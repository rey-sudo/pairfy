import database from "../../database/client.js";
import { ApiGraphQLError, ERROR_CODES, SellerToken } from "@lovelacers/common";
import { getOrdersSchema } from "../../validators/order/getOrders.js";

export const getOrders = async (_: any, args: any, context: any) => {
  let connection = null;

  try {
    const verifyParams = getOrdersSchema.safeParse(args.getOrdersInput);

    if (!verifyParams.success) {
      throw new ApiGraphQLError(
        400,
        `Invalid params ${JSON.stringify(verifyParams.error.flatten())}`,
        {
          code: ERROR_CODES.VALIDATION_ERROR,
        }
      );
    }

    const { cursor, reverseCursor } = verifyParams.data;

    const { sellerData: SELLER } = context as { sellerData: SellerToken };

    if (cursor && reverseCursor) {
      throw new ApiGraphQLError(
        400,
        "Cannot use both cursor and reverseCursor",
        {
          code: ERROR_CODES.VALIDATION_ERROR,
        }
      );
    }

    const pageSize = 16;
    const realLimit = pageSize + 1;

    const queryParams: any[] = [SELLER.id];

    let whereClause = "WHERE seller_id = ?";
    let orderClause = "ORDER BY created_at DESC, id DESC";
    let isReversing = false;

    if (cursor) {
      const [createdAt, id] = cursor.split("_");
      whereClause += " AND (created_at < ? OR (created_at = ? AND id < ?))";
      queryParams.push(createdAt, createdAt, id);
    }

    if (reverseCursor) {
      const [createdAt, id] = reverseCursor.split("_");
      whereClause += " AND (created_at > ? OR (created_at = ? AND id > ?))";
      queryParams.push(createdAt, createdAt, id);
      orderClause = "ORDER BY created_at ASC, id ASC";
      isReversing = true;
    }

    const query = `
      SELECT * FROM orders
      ${whereClause}
      ${orderClause}
      LIMIT ?
    `;

    queryParams.push(realLimit);

    connection = await database.client.getConnection();

    const [result] = await connection.query(query, queryParams);

    const hasMore = result.length > pageSize;

    const orders = hasMore ? result.slice(0, pageSize) : result;

    let nextCursor: string | null = null;

    if (hasMore) {
      const item = isReversing ? result[pageSize] : orders[orders.length - 1];
      nextCursor = `${item.created_at}_${item.id}`;
    }

    const finalOrders = isReversing ? orders.reverse() : orders;

    const [[{ total_count }]] = await connection.query(
      "SELECT COUNT(*) AS total_count FROM orders WHERE seller_id = ?",
      [SELLER.id]
    );

    const resultLength = result.length;
    const isAdvancing = !!cursor;

    const isInitialLoad = !cursor && !reverseCursor;

    const hasPrevMore =
      !isInitialLoad &&
      ((!isReversing && (isAdvancing || hasMore)) || (isReversing && hasMore));

    const hasNextMore =
      (!isReversing && hasMore) ||
      (isReversing && (isAdvancing || resultLength > 0));

    return {
      orders: finalOrders,
      nextCursor,
      hasPrevMore,
      hasNextMore,
      totalCount: total_count,
    };
  } catch (err) {
    if (connection) await connection.rollback();
    throw err;
  } finally {
    if (connection) connection.release();
  }
};
