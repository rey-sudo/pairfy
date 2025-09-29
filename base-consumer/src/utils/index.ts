import {
  AckPolicy,
  DeliverPolicy,
  JetStreamManager,
  ReplayPolicy,
} from "@nats-io/jetstream";
import { logger } from "@lovelacers/common";

export const catchError = async (error?: any) => {
  logger.error(`EXIT=>${error}`);

  process.exit(0);
};

export async function disableConnections(database: any, natsClient: any) {
  database.client.pool.config.connectionLimit = 0;

  try {
    await natsClient.drain();
    await natsClient.close();
    await database.client.end();
  } catch (err) {
    console.log(err);
  }

  setTimeout(() => {
    process.exit(1);
  }, 30_000);
}

export function checkHandlerVariables() {
  const handlerVars = Object.keys(process.env).filter((key) =>
    key.startsWith("HANDLER_")
  );

  if (handlerVars.length === 0) {
    logger.info("[WARNING]: No HANDLER_ environment variables found");
  }

  return handlerVars;
}

export async function createConsumer(
  jetStreamManager: JetStreamManager,
  stream: string,
  durableName: string,
  deliverGroup: string,
  filterSubjects: string[]
): Promise<void> {
  try {
    await jetStreamManager.consumers.info(stream, durableName);

    console.log(
      `ℹ️ Consumer "${durableName}" already exists on stream: "${stream}"`
    );

    await jetStreamManager.consumers.update(stream, durableName, {
      filter_subjects: filterSubjects.filter((item: string) => item.startsWith(stream)),
    });

    console.log(`ℹ️ Consumer "${durableName}" : "${stream}" updated`);
  } catch (error: any) {
    if (error.message.includes("consumer not found")) {
      console.log(
        `✅ Creating consumer "${durableName}" on stream: "${stream}"`
      );
      await jetStreamManager.consumers.add(stream, {
        durable_name: durableName,
        deliver_group: deliverGroup,
        ack_policy: AckPolicy.Explicit,
        deliver_policy: DeliverPolicy.All,
        replay_policy: ReplayPolicy.Instant,
        max_deliver: -1,
        filter_subjects: filterSubjects.filter((item: string) => item.startsWith(stream)),
      });
    } else {
      throw error;
    }
  }
}
