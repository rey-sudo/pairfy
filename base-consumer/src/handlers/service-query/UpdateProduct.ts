import database from "../../database/client.js";
import {
  isProcessedEvent,
  consumeEvent,
  logger,
  updateProduct,
} from "@lovelacers/common";
import { updateProductIndex } from "./utils/weaviate.js";

export const UpdateProduct = async (
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

    const product = JSON.parse(event.data);

    console.log(product.name);

    await connection.beginTransaction();

    ///////////////////////////////////////////////////////

    const updated = await updateProduct(
      connection,
      product.id,
      product.schema_v - 1,
      product
    );

    if (updated.affectedRows !== 1) {
      throw new Error("UpdateProductError");
    }

    const updateIndex = await updateProductIndex(product);

    if(!updateIndex){
      throw new Error("UpdateProductIndexError");
    }

    await consumeEvent(connection, event, seq);

    ///////////////////////////////////////////////////////

    await connection.commit();

    logger.info({
      service: "service-query-consumer",
      event: "event.consumed",
      message: "event consumed",
      eventId: event.id,
    });

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
