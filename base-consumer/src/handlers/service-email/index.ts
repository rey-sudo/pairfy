import  database  from "../../database/client.js";
import { sendEmail } from "./sendEmail.js";
import { isProcessedEvent, consumeEvent, logger } from '@lovelacers/common'

const CreateEmail = async (event: any, seq: number): Promise<boolean> => {
  let response = null;

  let connection = null;

  try {
    connection = await database.client.getConnection();

    const isProcessed = await isProcessedEvent(connection, event.id);

    if (isProcessed) {
      return Promise.resolve(true);
    }

    const dataParsed = JSON.parse(event.data);

    await connection.beginTransaction();

    ///////////////////////////////////////////////////////

    await sendEmail(dataParsed.type, dataParsed.email, dataParsed);

    console.log("EMAIL_SEND");

    ///////////////////////////////////////////////////////

    await consumeEvent(connection, event, seq);

    await connection.commit();

    response = Promise.resolve(true);
  } catch (err: any) {
    logger.error(err);

    if (connection) await connection.rollback();

    response = Promise.resolve(false);
  } finally {
    if (connection) connection.release();
  }

  return response;
};

const handlers: any = {
  CreateEmail,
};

export const processEvent = (message: any) => {
  const messageDecoded = new TextDecoder().decode(message.data);

  const event = JSON.parse(messageDecoded);

  console.log(message.seq, event.id, event.type);

  return handlers[event.type](event, message.seq);
};
