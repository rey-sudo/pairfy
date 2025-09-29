import database from "../../database/client.js";
import { consumeEvent, isProcessedEvent, logger } from "@lovelacers/common";

export const CreateNotifications = async (
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
        service: "service-notification-consumer",
        event: "event.repeated",
        message: `event repeated`,
        eventId: event.id,
      });

      return Promise.resolve(true);
    }

    const parsedData = JSON.parse(event.data);

    //////////////////////////////////////////////////////// START TRANSACTION

    await connection.beginTransaction();

    for (const i of parsedData) {
      const columns = Object.keys(i);

      const values = Object.values(i);

      const schemeData = `
          INSERT INTO notifications (${columns.join(", ")})
          VALUES (${columns.map(() => "?").join(", ")})
        `;

      await connection.execute(schemeData, values);
    }

    await consumeEvent(connection, event, seq);

    await connection.commit();

    //////////////////////////////////////////////////////// TRANSACTION END

    logger.info({
        service: "service-notification-consumer",
        event: "event.consumed",
        message: "event consumed",
        eventId: event.id,
      });

    response = Promise.resolve(true);
  } catch (err: any) {
    logger.error({
        service: "service-notification-consumer",
        event: "event.error",
        message: `event error`,
        eventId: event.id,
        err,
      });

    if (connection) await connection.rollback();

    response = Promise.resolve(false);
  } finally {
    if (connection) connection.release();
  }

  return response;
};
