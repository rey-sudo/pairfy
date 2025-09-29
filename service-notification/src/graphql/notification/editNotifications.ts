import { EditNotificationsSchema } from "../../validators/editNotifications.js";
import { ApiGraphQLError, ERROR_CODES } from "@lovelacers/common";
import { updateNotifications } from "../../utils/index.js";
import { database } from "../../database/client.js";

export const editNotifications = async (_: any, args: any, context: any) => {
  const { sellerData: SELLER, userData: USER } = context;

  let connection = null;

  try {
    const verifyParams = EditNotificationsSchema.safeParse(args.editNotificationsInput);

    if (!verifyParams.success) {
      throw new ApiGraphQLError(
        400,
        `Invalid params ${JSON.stringify(verifyParams.error.flatten())}`,
        { code: ERROR_CODES.VALIDATION_ERROR }
      );
    }

    const params = verifyParams.data;

    console.log(params);

    connection = await database.client.getConnection();

    /////////////////////////////////////////////////////////// START TRANSACTION

    await connection.beginTransaction();

    let owner = null;

    if (USER) {
      owner = USER.pubkeyhash;
    }

    if (SELLER) {
      owner = SELLER.id;
    }

    await updateNotifications(
      connection,
      params.ids,
      owner
    );

    await connection.commit();

    /////////////////////////////////////////////////////////// TRANSACTION END

    return { success: true, message: "OK" };
  } catch (err: any) {
    if (connection) await connection.rollback();

    throw err;
  } finally {
    if (connection) connection.release();
  }
};
