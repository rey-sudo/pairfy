import { ApiGraphQLError, ERROR_CODES, getMessageId } from "@lovelacers/common";
import { createMessageSchema } from "../../validators/createMessage.js";

export const createMessage = async (_: any, args: any, context: any) => {
  try {
    const { userData: USER, sellerData: SELLER } = context;

    const validateParams = createMessageSchema.safeParse(
      args.createMessageInput
    );

    if (!validateParams.success) {
      throw new ApiGraphQLError(
        400,
        `Invalid params ${JSON.stringify(validateParams.error.flatten())}`,
        { code: ERROR_CODES.VALIDATION_ERROR }
      );
    }

    const params = validateParams.data;

    const chatKey = `chat:${params.session}`;

    const channelKey = `channel:${params.session}`;

    let scheme = {
      id: getMessageId(),
      sender: "",
      role: "",
      message: params.content,
      seen: false,
      created_at: Date.now(),
    };

    if (USER) {
      scheme.sender = USER.pubkeyhash;
      scheme.role = "USER";
    }

    if (SELLER) {
      scheme.sender = SELLER.id;
      scheme.role = "SELLER";
    }

    await context.redisClient.lPush(chatKey, JSON.stringify(scheme));

    await context.pubSub.publish(channelKey, { message: scheme });

    console.log(scheme);

    return {
      success: true,
      message: "OK",
    };
  } catch (err: any) {
    throw err;
  }
};
