
import { isProcessedEvent, consumeEvent, logger } from "@lovelacers/common";
import { processFile } from "./utils/media.js";
import database from "../../database/client.js";

export const CreateFile = async (event: any, seq: number): Promise<boolean> => {
  let response = null;

  let connection = null;

  try {
    connection = await database.client.getConnection();

    const processed = await isProcessedEvent(connection, event.id);

    if (processed) {
      logger.error({
        timestamp: new Date().toISOString(),
        service: "service-processor-consumer",
        event: "event.repeated",
        message: `event repeated`,
        eventId: event.id,
      });

      return Promise.resolve(true);
    }

    const dataParsed = JSON.parse(event.data);

    await connection.beginTransaction();

    ///////////////////////////////////////////////////////

    const processedFile = await processFile(dataParsed);

    if (!processedFile) {
      throw new Error("processFileError");
    }

    ///////////////////////////////////////////////////////

    await consumeEvent(connection, event, seq);

    await connection.commit();

    logger.info({
      service: "service-processor-consumer",
      event: "event.consumed",
      message: "event consumed",
      eventId: event.id,
    });

    response = Promise.resolve(true);
  } catch (error: any) {
    logger.error({
      service: "service-processor-consumer",
      event: "event.error",
      message: `event error`,
      eventId: event.id,
      error: error.message,
      stack: error.stack,
    });

    if (connection) await connection.rollback();

    response = Promise.resolve(false);
  } finally {
    if (connection) connection.release();
  }

  return response;
};
