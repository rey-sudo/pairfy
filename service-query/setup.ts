import mysql from "mysql2/promise";
import weaviate from "weaviate-ts-client";
import { loadSql } from "@lovelacers/common";

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

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${DATABASE_NAME}\`;`
    );
    await connection.query(`USE \`${DATABASE_NAME}\`;`);
    console.log(`✅ Database '${DATABASE_NAME}' verified and selected.`);

    const sqlFiles: string[] = [
      "events.sql",
      "products.sql",
      "processed.sql",
      "media.sql",
    ];

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

(async () => {
  const HOST = process.env.WEAVIATE_HOST || "localhost:8080";
  console.log("Weaviate Host:", HOST);

  const client = weaviate.client({
    scheme: "http",
    host: HOST,
  });

  const className = "ProductV1";

  const desiredProperties = [
    {
      name: "id_",
      dataType: ["text"],
      indexFilterable: true
    },
    {
      name: "group_id",
      dataType: ["text"],
      indexFilterable: true
    },
    {
      name: "status",
      dataType: ["text"],
      indexFilterable: true,
    },
    { name: "moderated", dataType: ["boolean"], indexFilterable: true },
    {
      name: "seller_id",
      dataType: ["text"],
      indexFilterable: true,
    },
    {
      name: "thumbnail_url",
      dataType: ["text"]
    },
    {
      name: "name",
      dataType: ["text"],
      indexFilterable: true,
      indexSearchable: true,
      tokenization: "word",
    },
    { name: "price", dataType: ["int"], indexFilterable: true },
    {
      name: "sku",
      dataType: ["text"],
      indexFilterable: true
    },
    {
      name: "model",
      dataType: ["text"],
      indexFilterable: true,
      indexSearchable: true,
      tokenization: "word",
    },
    {
      name: "brand",
      dataType: ["text"],
      indexFilterable: true,
      indexSearchable: true,
      tokenization: "word",
    },
    {
      name: "description",
      dataType: ["text"],
      indexFilterable: false,
      indexSearchable: false,
    },
    {
      name: "category",
      dataType: ["text"],
      indexFilterable: true,
      indexSearchable: true,
      tokenization: "word",
    },
    {
      name: "bullet_list",
      dataType: ["text[]"],
      indexFilterable: false,
      indexSearchable: true,
    },
    {
      name: "color",
      dataType: ["text"],
      indexFilterable: true,
      indexSearchable: true,
      tokenization: "word",
    },
    {
      name: "condition_",
      dataType: ["text"],
      indexFilterable: true,
      indexSearchable: true,
      tokenization: "word",
    },
    {
      name: "country",
      dataType: ["text"],
      indexFilterable: true,
      indexSearchable: true,
      tokenization: "word",
    },
    {
      name: "origin",
      dataType: ["text"],
      indexFilterable: true,
      indexSearchable: true,
      tokenization: "word",
    },
    {
      name: "city",
      dataType: ["text"],
      indexFilterable: true,
      indexSearchable: true,
      tokenization: "word",
    },
    {
      name: "postal",
      dataType: ["text"],
      indexFilterable: true,
      indexSearchable: true,
      tokenization: "word",
    },
    { name: "discount", dataType: ["boolean"], indexFilterable: true },
    { name: "discount_value", dataType: ["int"], indexFilterable: true },
    { name: "discount_percent", dataType: ["int"], indexFilterable: true },
    { name: "created_at", dataType: ["number"], indexFilterable: true },
    { name: "updated_at", dataType: ["number"], indexFilterable: true },
    { name: "schema_v", dataType: ["int"], indexFilterable: true },

    ////NEW PROPERTIES

    { name: "available", dataType: ["int"], indexFilterable: true },
    { name: "rating", dataType: ["int"], indexFilterable: true },
    { name: "rating_value", dataType: ["int"], indexFilterable: true },
    { name: "sold", dataType: ["int"], indexFilterable: true }
  ];

  try {
    const schema = await client.schema.getter().do();
    const existingClass = schema.classes?.find((c) => c.class === className);

    if (!existingClass) {
      await client.schema
        .classCreator()
        .withClass({
          class: className,
          description: "ProductV1 catalog entry",
          vectorizer: "none",
          properties: desiredProperties,
        })
        .do();

      console.log(`✅ Class '${className}' created.`);

    } else {
      const existingPropertyNames = new Set(
        (existingClass.properties ?? []).map((p) => p.name)
      );
      const newProperties = desiredProperties.filter(
        (p: any) => !existingPropertyNames.has(p.name)
      );

      if (newProperties.length > 0) {
        for (const property of newProperties) {
          await client.schema
            .propertyCreator()
            .withClassName(className)
            .withProperty(property as any)
            .do();

          console.log(`✅ Weaviate: Added ${property?.name} property`);
        }
      }
    }
  } catch (error) {
    console.error("❌ WeaviateError", error.message);
    throw error;
  }
})();
