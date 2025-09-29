import mysql from "mysql2/promise";
import { logger } from "@lovelacers/common";
import { Connection } from "mysql2/promise";

export const catchError = (error: any) => {
  logger.error(`[EXIT]:${error}`);

  return process.exit(1);
};

export async function findNotifications(
  connection: Connection,
  owner: string,
  seen: boolean = false,
  limit = 50
) {
  const query = `
    SELECT *
    FROM notifications
    WHERE owner = ? AND seen = ?
    ORDER BY created_at DESC
    LIMIT ?
  `;

  const [result] = await connection.query(query, [owner, seen, limit]);

  return result || [];
}

export async function updateNotifications(
  connection: Connection,
  ids: string[],
  owner: string
) {
  if (!ids.length) return;

  const placeholders = ids.map(() => "?").join(", ");
  
  const query = `
    UPDATE notifications
    SET seen = ?
    WHERE id IN (${placeholders}) AND owner = ?
  `;

  const values = [true, ...ids, owner];

  const [result] = await connection.execute<mysql.ResultSetHeader>(query, values);

  return result;
}
