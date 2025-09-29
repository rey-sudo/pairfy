import { createEvent, getNotificationId } from "@lovelacers/common";
import { UtxoData } from "../lib/index.js";
import { Connection } from "mysql2/promise";
import { updateOrder } from "../common/updateOrder.js";
import { redisState } from "../database/redis.js";
import { saveStatus } from "../lib/order.js";
import { jobResponse } from "./index.js";

export async function pending(
  connection: Connection,
  timestamp: number,
  orderData: any,
  data: UtxoData
): Promise<jobResponse> {
  await connection.beginTransaction();
  
  const newStatus = "pending";

  if (!orderData.pending_notified) {
    const notifications = [
      {
        id: getNotificationId(),
        type: "order",
        title: "Payment detected 💵",
        owner: orderData.buyer_pubkeyhash,
        data: JSON.stringify({
          id: orderData.id,
          buyer_address: orderData.buyer_address,
          buyer_wallet: orderData.buyer_wallet,
          country: orderData.country
        }),
        message: `The payment is being processed on the network. - Order N° ${orderData.id.slice(
          0,
          10
        )}...`,
        created_at: timestamp,
        updated_at: timestamp,
      },
      {
        id: getNotificationId(),
        type: "order",
        title: "New purchase 🎉",
        owner: orderData.seller_id,
        data: JSON.stringify({
          id: orderData.id,
          seller_address: orderData.seller_address,
          seller_wallet: orderData.seller_wallet,
          country: orderData.country,
        }),
        message: `Verify payment and accept the order. - Order N° ${orderData.id.slice(
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
    contract_address: data.utxo.address,
    contract_state: data.datum.state,
    pending_tx: data.txHash,
    pending_block: data.blockTime,
    pending_metadata: data.metadata,
    pending_notified: true,
    scanned_at: timestamp,
  };

  await updateOrder(
    connection,
    orderData.id,
    orderData.schema_v,
    updateContent
  );

  await saveStatus(redisState.client, orderData.id, newStatus)
  
  await connection.commit();

  return { id: orderData.id, finished: false };
}
