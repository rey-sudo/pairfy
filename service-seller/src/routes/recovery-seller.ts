import database from "../database/index.js";
import { Request, Response } from "express";
import {
  ApiError,
  ERROR_CODES,
  createEvent,
  createToken,
  findSellerByEmail,
} from "@lovelacers/common";
import { recoverySellerSchema } from "../validators/recovery-seller.js";

export const recoverySellerMiddlewares: any = [];

export const recoverySellerHandler = async (req: Request, res: Response) => {
  let connection = null;

  try {
    const timestamp = Date.now();

    const validateParams = recoverySellerSchema.safeParse(req.body);

    if (!validateParams.success) {
      throw new ApiError(
        401,
        `Invalid credentials ${JSON.stringify(validateParams.error.flatten())}`,
        { code: ERROR_CODES.INVALID_CREDENTIALS }
      );
    }

    const params = validateParams.data;

    connection = await database.client.getConnection();

    await connection.beginTransaction();

    //////////////////////////////////////////////////////////////////////////////////////////

    const findSeller = await findSellerByEmail(connection, params.email);

    if (!findSeller) {
      throw new ApiError(404, "The email address not found.", {
        code: ERROR_CODES.NOT_FOUND,
      });
    }

    if (findSeller.verified !== 1) {
      throw new ApiError(403, "Email not verified", {
        code: ERROR_CODES.UNVERIFIED_EMAIL,
      });
    }

    const tokenData = {
      source: "service-seller",
      role: "SELLER",
      email: findSeller.email,
      username: findSeller.username,
    };

    const emailToken = createToken(
      tokenData,
      process.env.AGENT_JWT_KEY as string,
      "1h",
      "service-seller",
      ["recovery"]
    );

    const emailData = {
      type: "recovery:seller",
      username: findSeller.username,
      email: findSeller.email,
      token: emailToken,
    };

    await createEvent(
      connection,
      timestamp,
      "service-seller",
      "CreateEmail",
      JSON.stringify(emailData),
      findSeller.id
    );

    await connection.commit();

    //////////////////////////////////////////////////////////////////////////////////////////

    res.status(200).send({
      success: true,
      message: 'Please check your email in the "all" or "spam" folder.',
    });
  } catch (err) {
    if (connection) await connection.rollback();

    throw err;
  } finally {
    if (connection) connection.release();
  }
};
