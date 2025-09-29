import { countNotifications } from "../../common/countNotifications.js";
import { ApiGraphQLError, ERROR_CODES } from "@lovelacers/common";
import { getCursorSchema } from "../../validators/getCursor.js";
import { database } from "../../database/client.js";

export const getCursor = async (_: any, args: any, context: any) => {
  let connection = null;

  try {
    const validation = getCursorSchema.safeParse(args.getCursorInput);

    if (!validation.success) {
      throw new ApiGraphQLError(
        400,
        `Invalid params ${JSON.stringify(validation.error.flatten())}`,
        {
          code: ERROR_CODES.VALIDATION_ERROR,
        }
      );
    }

    const { cursor, reverseCursor } = validation.data;
    const { sellerData: SELLER } = context;

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
    let whereClause = "WHERE owner = ?";
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
    SELECT *
    FROM notifications
    ${whereClause}
    ${orderClause}
    LIMIT ?
  `;

    queryParams.push(realLimit);

    connection = await database.client.getConnection();

    const [result] = await connection.query(query, queryParams);

    const hasMore = result.length > pageSize;

    const notifications = hasMore ? result.slice(0, pageSize) : result;

    let nextCursor: string | null = null;

    if (hasMore) {
      const item = isReversing
        ? result[pageSize]
        : notifications[notifications.length - 1];
      nextCursor = `${item.created_at}_${item.id}`;
    }

    const finalNotifications = isReversing
      ? notifications.reverse()
      : notifications;

    const totalCount = await countNotifications(connection, SELLER.id);

    const isAdvancing = !!cursor;

    const isInitialLoad = !cursor && !reverseCursor;

    const hasPrevMore =
      !isInitialLoad &&
      ((!isReversing && (isAdvancing || hasMore)) || (isReversing && hasMore));

    const hasNextMore =
      (!isReversing && hasMore) ||
      (isReversing && (isAdvancing || result.length > 0));

    return {
      notifications: finalNotifications,
      nextCursor,
      hasPrevMore,
      hasNextMore,
      totalCount
    };
  } catch (err) {
    if (connection) await connection.rollback();
    throw err;
  } finally {
    if (connection) connection.release();
  }
};
