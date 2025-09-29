import database from "../../database/client.js";
import {
  isProcessedEvent,
  consumeEvent,
  logger,
  insertProduct,
  insertBook,
  findBookBySeller
} from "@lovelacers/common";
import { redisBooksClient } from "./utils/redis.js";

export const CreateProduct = async (
  event: any,
  seq: number
): Promise<boolean> => {
  let response = null;

  let connection = null;

  try {
    connection = await database.client.getConnection();

    const processed = await isProcessedEvent(connection, event.id);

    if (processed) {
      logger.error({
        service: "service-gateway-consumer",
        event: "event.repeated",
        message: `event repeated`,
        eventId: event.id,
      });

      return Promise.resolve(true);
    }

    const parsedData = JSON.parse(event.data);

    await connection.beginTransaction();

    ///////////////////////////////////////////////////////

    const [insert1] = await insertProduct(connection, parsedData);

    if (insert1.affectedRows !== 1) {
      throw new Error("insertProductError");
    }
    const timestamp = Date.now();

    const newBook = {
      id: parsedData.id,
      seller_id: parsedData.seller_id,
      created_at: timestamp,
      updated_at: timestamp,
      schema_v: 0,
    };
    
    const [insert2] = await insertBook(connection, newBook);

    if (insert2.affectedRows !== 1) {
      throw new Error("insertBookError");
    }

    const findBook = await findBookBySeller(connection, parsedData.id, parsedData.seller_id);

    await redisBooksClient.client.set(findBook.id, JSON.stringify(findBook))

    await consumeEvent(connection, event, seq);

    ///////////////////////////////////////////////////////

    await connection.commit();

    logger.info({
      service: "service-gateway-consumer",
      event: "event.consumed",
      message: "event consumed",
      eventId: event.id,
    });

    response = Promise.resolve(true);
  } catch (error: any) {
    logger.error({
      service: "service-gateway-consumer",
      event: "event.error",
      message: `event error`,
      eventId: event.id,
      error,
    });

    if (connection) await connection.rollback();

    response = Promise.resolve(false);
  } finally {
    if (connection) connection.release();
  }

  return response;
};
