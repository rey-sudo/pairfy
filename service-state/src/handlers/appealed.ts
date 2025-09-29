import { createEvent, getNotificationId } from "@lovelacers/common";
import { jobResponse } from "./index.js";
import { Connection } from "mysql2/promise.js";
import { UtxoData } from "../lib/index.js";
import { saveStatus } from "../lib/order.js";
import { redisState } from "../database/redis.js";
import { updateOrder } from "../common/updateOrder.js";

export async function appealed(
  connection: Connection,
  timestamp: number,
  orderData: any,
  data: UtxoData
): Promise<jobResponse> {
  await connection.beginTransaction();
  
  const newStatus = "appealed";

  if (!orderData.appealed_notified) {
    const notifications = [
      {
        id: getNotificationId(),
        type: "order",
        title: "Order appealed 📄⚖️",
        owner: orderData.buyer_pubkeyhash,
        data: JSON.stringify({
          id: orderData.id,
          buyer_address: orderData.buyer_address,
          buyer_wallet: orderData.buyer_wallet,
          country: orderData.country,
        }),
        message: `The order has been appealed. - Order N° ${orderData.id.slice(
          0,
          10
        )}...`,
        created_at: timestamp,
        updated_at: timestamp,
      },
      {
        id: getNotificationId(),
        type: "order",
        title: "Order appealed 📄⚖️",
        owner: orderData.seller_id,
        data: JSON.stringify({
          id: orderData.id,
          seller_address: orderData.seller_address,
          seller_wallet: orderData.seller_wallet,
          country: orderData.country,
        }),
        message: `The order has been appealed. - Order N° ${orderData.id.slice(
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
      orderData.buyer_pubkeyhash
    );
    
  }

  const updateContent = {
    status: newStatus,
    contract_state: data.datum.state,
    appealed_tx: data.txHash,
    appealed_block: data.blockTime,
    appealed_metadata: data.metadata,
    appealed_notified: true,
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
