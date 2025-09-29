import database from "../../database/client.js";
import {
  isProcessedEvent,
  consumeEvent,
  logger,
  insertProduct,
} from "@lovelacers/common";
import { createProductIndex } from "./utils/weaviate.js";

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
        service: "service-query-consumer",
        event: "event.repeated",
        message: `event repeated`,
        eventId: event.id,
      });

      return Promise.resolve(true);
    }

    const dataParsed = JSON.parse(event.data);

    await connection.beginTransaction();

    ///////////////////////////////////////////////////////

    const [productCreated] = await insertProduct(connection, dataParsed);

    if (productCreated.affectedRows !== 1) {
      throw new Error("CreateProductError");
    }

    const createIndex = await createProductIndex(dataParsed);

    if(!createIndex){
      throw new Error("CreateProductIndexError");
    }

    await consumeEvent(connection, event, seq);

    ///////////////////////////////////////////////////////

    await connection.commit();

    logger.info({
      service: "service-query-consumer",
      event: "event.consumed",
      message: 'event consumed',
      eventId: event.id
    })

    response = Promise.resolve(true);
  } catch (error: any) {
    logger.error({
      service: "service-query-consumer",
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
