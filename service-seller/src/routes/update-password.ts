import database from "../database/index.js";
import { Request, Response } from "express";
import {
  ApiError,
  ERROR_CODES,
  findSellerByEmail,
  updateSeller,
  verifyToken,
  hashPassword,
  createEvent,
  findSellerById,
  encryptAESGCM,
  generateRSA
} from "@lovelacers/common";
import {
  verifyParams,
  verifyTokenType,
} from "../validators/update-password.js";

export const updatePasswordMiddlewares: any = [];

export const updatePasswordHandler = async (req: Request, res: Response) => {
  let connection = null;

  try {
    const timestamp = Date.now();

    const validateParams = verifyParams.safeParse(req.body);

    if (!validateParams.success) {
      throw new ApiError(400, "Validation error", {
        code: ERROR_CODES.VALIDATION_ERROR,
      });
    }

    const parsedToken = verifyToken(
      validateParams.data.token,
      process.env.AGENT_JWT_KEY as string
    );

    if (!parsedToken) {
      throw new ApiError(401, "Invalid token", {
        code: ERROR_CODES.INVALID_TOKEN,
      });
    }

    const tokenContent = verifyTokenType.safeParse(parsedToken);

    if (!tokenContent.success) {
      throw new ApiError(401, "Invalid Token", {
        code: ERROR_CODES.INVALID_CREDENTIALS,
      });
    }

    /////////////////////////////////////////////////////////////////

    const params = validateParams.data;

    connection = await database.client.getConnection();

    const SELLER = await findSellerByEmail(connection, tokenContent.data.email);

    if (!SELLER) {
      throw new ApiError(404, "Seller not found", {
        code: ERROR_CODES.NOT_FOUND,
      });
    }

    if (SELLER.verified !== 1) {
      throw new ApiError(403, "Email not verified", {
        code: ERROR_CODES.UNVERIFIED_EMAIL,
      });
    }

    ///////////////////////////////////////////////////////////////// START TRANSACTION

    await connection.beginTransaction();

    const password = await hashPassword(params.password);

    const RSAkeys = await generateRSA();

    const encriptedPrivateKey = await encryptAESGCM(
      RSAkeys.privateKeyB64,
      params.password
    );

    const updateResult = await updateSeller(
      connection,
      SELLER.id,
      SELLER.schema_v,
      {
        password_hash: password,
        rsa_version: SELLER.rsa_version + 1,
        rsa_public_key: RSAkeys.publicKeyB64,
        rsa_private_key: [...SELLER.rsa_private_key, encriptedPrivateKey],
        schema_v: SELLER.schema_v + 1,
      }
    );

    if (updateResult.affectedRows !== 1) {
      throw new ApiError(409, "Update failed: version mismatch or not found", {
        code: ERROR_CODES.UPDATE_CONFLICT,
      });
    }

    const findSeller = await findSellerById(connection, SELLER.id);

    await createEvent(
      connection,
      timestamp,
      "service-seller",
      "UpdateSeller",
      JSON.stringify(findSeller),
      SELLER.id
    );

    await connection.commit();

    ///////////////////////////////////////////////////////////////// END TRANSACTION

    res.status(200).send({
      success: true,
      message: "The password has been updated successfully. Redirecting to the login page...",
    });
  } catch (err: any) {
    if (connection) await connection.rollback();
    throw err;
  } finally {
    if (connection) connection.release();
  }
};
