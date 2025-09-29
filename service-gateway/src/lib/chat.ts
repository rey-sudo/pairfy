import { getMessageId } from "@lovelacers/common";

export async function createChat(redisClient: any, chatKey: string, senderId: string, initialMessage: string) {
  const entry = {
    id: getMessageId(),
    sender: senderId,
    role: "USER",
    message: initialMessage,
    seen: false,
    created_at: Date.now()
  };

  await redisClient.lPush(chatKey, JSON.stringify(entry));
}
