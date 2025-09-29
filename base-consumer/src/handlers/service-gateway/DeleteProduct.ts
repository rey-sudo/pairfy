import database from "../../database/client.js";
import {
  isProcessedEvent,
  consumeEvent,
  logger,
  deleteProductById,
  deleteBookById
} from "@lovelacers/common";
import { redisBooksClient } from "./utils/redis.js";

export const DeleteProduct = async (
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

    const dataParsed = JSON.parse(event.data);

    await connection.beginTransaction();

    ///////////////////////////////////////////////////////
    
    const delete1 = await deleteProductById(
      connection,
      dataParsed.id,
      dataParsed.schema_v
    );

    if (delete1.affectedRows !== 1) {
      throw new Error("deleteProductError");
    }

    const delete2 = await deleteBookById(
      connection,
      dataParsed.id
    );

    if (delete2.affectedRows !== 1) {
      throw new Error("deleteBookError");
    }

    await redisBooksClient.client.del(dataParsed.id)

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
