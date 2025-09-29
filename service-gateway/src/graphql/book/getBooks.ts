import database from "../../database/client.js";
import { ApiGraphQLError, ERROR_CODES, SellerToken } from "@lovelacers/common";
import { getBooksSchema } from "../../validators/getBooks.js";

export const getBooks = async (_: any, args: any, context: any) => {
  let connection = null;

  try {
    const validation = getBooksSchema.safeParse(args.getBooksInput);

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
    
    const { sellerData: SELLER } = context as { sellerData: SellerToken };

  
    if (cursor && reverseCursor) {
      throw new ApiGraphQLError(400, "Cannot use both cursor and reverseCursor", {
        code: ERROR_CODES.VALIDATION_ERROR,
      });
    }
  
    const pageSize = 16;
    const realLimit = pageSize + 1;
  
    const queryParams: any[] = [SELLER.id];
    
    let whereClause = "WHERE books.seller_id = ?";
    let orderClause = "ORDER BY books.created_at DESC, books.id DESC";
    let isReversing = false;
  
    if (cursor) {
      const [createdAt, id] = cursor.split("_");
      whereClause += " AND (books.created_at < ? OR (books.created_at = ? AND books.id < ?))";
      queryParams.push(createdAt, createdAt, id);
    }
  
    if (reverseCursor) {
      const [createdAt, id] = reverseCursor.split("_");
      whereClause += " AND (books.created_at > ? OR (books.created_at = ? AND books.id > ?))";
      queryParams.push(createdAt, createdAt, id);
      orderClause = "ORDER BY books.created_at ASC, books.id ASC";
      isReversing = true;
    }
  
    const query = `
    SELECT 
      books.*,
      products.name AS product_name,
      products.sku AS product_sku,
      products.thumbnail_url AS thumbnail_url
    FROM books
    JOIN products ON books.id = products.id
    ${whereClause}
    ${orderClause}
    LIMIT ?
  `;
  
    queryParams.push(realLimit);
    
    connection = await database.client.getConnection();
    const [result] = await connection.query(query, queryParams);

    const hasMore = result.length > pageSize;
    const books = hasMore ? result.slice(0, pageSize) : result;

    let nextCursor: string | null = null;

    if (hasMore) {
      const item = isReversing ? result[pageSize] : books[books.length - 1];
      nextCursor = `${item.created_at}_${item.id}`;
    }

    const finalBooks = isReversing ? books.reverse() : books;

    const [[{ total_count }]] = await connection.query(
      "SELECT COUNT(*) AS total_count FROM books WHERE seller_id = ?",
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
      books: finalBooks,
      nextCursor,
      hasPrevMore,
      hasNextMore,
      totalCount: total_count,
    };
  } catch (err) {
    throw err;
  } finally {
    if (connection) connection.release();
  }
};
