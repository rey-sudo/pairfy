import mysql from 'mysql2/promise';
import { loadSql } from '@lovelacers/common';

const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
} = process.env;

if (!DATABASE_HOST || !DATABASE_USER || !DATABASE_PASSWORD || !DATABASE_NAME) {
  console.error("❌ Missing one or more required environment variables.");
  process.exit(1);
}

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: DATABASE_HOST,
      port: DATABASE_PORT ? parseInt(DATABASE_PORT, 10) : 3306,
      user: DATABASE_USER,
      password: DATABASE_PASSWORD,
      multipleStatements: true,
    });

    console.log("✅ Connected to MySQL server");

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DATABASE_NAME}\`;`);
    await connection.query(`USE \`${DATABASE_NAME}\`;`);
    console.log(`✅ Database '${DATABASE_NAME}' verified and selected.`);

    const sqlFiles: string[] = ['users.sql'];

    for (const file of sqlFiles) {
      console.log(`📄 Executing ${file}...`);
      const sql: string = loadSql(file);
      await connection.query(sql);
      console.log(`✅ ${file} executed successfully.`);
    }

    await connection.end();
    console.log("🚪 Connection closed.");

  } catch (err) {
    const error = err as Error;
    console.error("❌ Error during setup:", error.message);
    process.exit(1);
  }
})();
