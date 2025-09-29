import { createEvent, getNotificationId } from "@lovelacers/common";
import { jobResponse } from "./index.js";
import { Connection } from "mysql2/promise.js";
import { UtxoData } from "../lib/index.js";
import { saveStatus } from "../lib/order.js";
import { updateOrder } from "../common/updateOrder.js";
import { redisState } from "../database/redis.js";

export async function collected(
  connection: Connection,
  timestamp: number,
  orderData: any,
  data: UtxoData
): Promise<jobResponse> {
  await connection.beginTransaction();
  
  const newStatus = "collected";

  if (!orderData.collected_notified) {
    const notifications = [
      {
        id: getNotificationId(),
        type: "order",
        title: "Funds collected 💵",
        owner: orderData.seller_id,
        data: JSON.stringify({
          id: orderData.id,
          seller_address: orderData.seller_address,
          seller_wallet: orderData.seller_wallet,
          country: orderData.country,
        }),
        message: `The funds have been collected. - Order N° ${orderData.id.slice(
          0,
          10
        )}...`,
        created_at: timestamp,
        updated_at: timestamp,
      },
    ];

    await createEvent(
      connection,
      timestamp,
      "service-gateway",
      "CreateNotifications",
      JSON.stringify(notifications),
      orderData.seller_id
    );

  }

  const updateContent = {
    status: newStatus,
    completed: true,
    contract_state: data.datum.state,
    collected_tx: data.txHash,
    collected_block: data.blockTime,
    collected_metadata: data.metadata,
    collected_notified: true,
    scanned_at: timestamp,
  };

  await updateOrder(
    connection,
    orderData.id,
    orderData.schema_v,
    updateContent
  );

  await saveStatus(redisState.client, orderData.id, newStatus);

  await connection.commit();

  return { id: orderData.id, finished: false };
}
