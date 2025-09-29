import database from "../database/index.js";
import {
  verifyToken,
  findSellerByEmail,
  ApiError,
  ERROR_CODES,
  updateSeller,
  createEvent,
  findSellerById,
} from "@lovelacers/common";
import { Request, Response } from "express";
import {
  tokenTypeValidator,
  tokenValidator,
} from "../validators/verify-seller.js";

export const verifySellerMiddlewares: any = [];

export const verifySellerHandler = async (req: Request, res: Response) => {
  let connection = null;

  try {
    const timestamp = Date.now();

    const isValidToken = tokenValidator.safeParse(req.body);

    if (!isValidToken.success) {
      throw new ApiError(401, "Invalid Token", {
        code: ERROR_CODES.INVALID_CREDENTIALS,
      });
    }

    const parsedToken = verifyToken(
      isValidToken.data.token,
      process.env.AGENT_JWT_KEY as string
    );

    if (!parsedToken) {
      throw new ApiError(401, "Invalid Token", {
        code: ERROR_CODES.INVALID_CREDENTIALS,
      });
    }

    const isValidTokenContent = tokenTypeValidator.safeParse(parsedToken);

    if (!isValidTokenContent.success) {
      throw new ApiError(401, "Invalid Token", {
        code: ERROR_CODES.INVALID_CREDENTIALS,
      });
    }

    connection = await database.client.getConnection();

    ///////////////////////////////////////////////////////////////////////////////////

    await connection.beginTransaction();

    const SELLER = await findSellerByEmail(connection, parsedToken.email);

    console.log(SELLER);

    if (SELLER.verified === 1) {
      throw new ApiError(400, "Email is already verified", {
        code: ERROR_CODES.EMAIL_ALREADY_VERIFIED,
      });
    }

    const updateResult = await updateSeller(
      connection,
      SELLER.id,
      SELLER.schema_v,
      {
        verified: true,
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

    ///////////////////////////////////////////////////////////////////////////////////

    res.status(200).send({
      success: true,
      message: "The email has been successfully verified !",
    });
  } catch (err: any) {
    if (connection) await connection.rollback();
    throw err;
  } finally {
    if (connection) connection.release();
  }
};
