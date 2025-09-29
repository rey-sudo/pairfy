import Cardano from "@emurgo/cardano-serialization-lib-nodejs";
import database from "../database/index.js";
import { Request, Response } from "express";
import {
  UserToken,
  createToken,
  ApiError,
  ERROR_CODES,
  getUserNickname,
  isValidSignatureCIP30,
  generateRSA,
  encryptAESGCM,
  hashPassword,
  comparePassword,
} from "@lovelacers/common";
import { getPubKeyHash } from "../utils/crypto.js";
import { loginUserSchema } from "../validators/login-user.js";
import { findUserById } from "../common/findUserById.js";
import { updateUser } from "../common/updateUser.js";
import { insertUser } from "../common/insertUser.js";

export const loginUserMiddlewares: any = [];

export const loginUserHandler = async (req: Request, res: Response) => {
  let connection = null;

  try {
    const timestamp = Date.now();

    const verifyParams = loginUserSchema.safeParse(req.body);

    if (!verifyParams.success) {
      throw new ApiError(
        400,
        `Invalid Params ${JSON.stringify(verifyParams.error.flatten())}`,
        {
          code: ERROR_CODES.VALIDATION_ERROR,
        }
      );
    }

    const params = verifyParams.data;

    console.log(params);

    const hexAddress = Cardano.Address.from_hex(params.address);

    const address32: string = hexAddress.to_bech32();

    const message = "PLEASE SIGN TO AUTHENTICATE YOUR PUBLIC SIGNATURE";

    const pubKeyHash = getPubKeyHash(hexAddress);

    const username = getUserNickname();

    const verifySignature = isValidSignatureCIP30(
      params.signature.signature,
      params.signature.key,
      message,
      address32
    );

    if (!verifySignature) {
      throw new ApiError(401, "Signature error", {
        code: ERROR_CODES.INVALID_SIGNATURE,
      });
    }

    ///////////////////////////////////////////////////////////////// START TRANSACTION

    connection = await database.client.getConnection();

    await connection.beginTransaction();

    const USER = await findUserById(connection, pubKeyHash);

    if (!USER) {
      const password = await hashPassword(params.password);

      const RSAkeys = await generateRSA();
      
      const encriptedPrivateKey = await encryptAESGCM(
        RSAkeys.privateKeyB64,
        params.password
      );

      const createContent = {
        id: pubKeyHash,
        pubkeyhash: pubKeyHash,
        username,
        address: address32,
        country: params.country,
        terms_accepted: params.terms_accepted,
        password_hash: password,
        public_ip: req.publicAddress,
        wallet_name: params.wallet_name,
        rsa_version: 0,
        rsa_public_key: RSAkeys.publicKeyB64,
        rsa_private_key: [encriptedPrivateKey],
        created_at: timestamp,
        updated_at: timestamp,
        schema_v: 0,
      };

      const insertResult = await insertUser(connection, createContent);

      if (insertResult?.affectedRows !== 1) {
        throw new ApiError(500, "Internal error insert", {
          code: ERROR_CODES.INTERNAL_ERROR,
        });
      }
    } else {

      const passwordsMatch = await comparePassword(
        USER.password_hash,
        params.password
      );
  
      if (!passwordsMatch) {
        throw new ApiError(401, "Invalid Credentials", {
          code: ERROR_CODES.INVALID_CREDENTIALS,
        });
      }
  
      const updateContent = {
        address: address32,
        public_ip: req.publicAddress,
        wallet_name: params.wallet_name,
        updated_at: timestamp,
        schema_v: USER.schema_v + 1,
      };

      const updateResult = await updateUser(
        connection,
        USER.id,
        USER.schema_v,
        updateContent
      );

      if (updateResult?.affectedRows !== 1) {
        throw new ApiError(500, "Internal error update", {
          code: ERROR_CODES.INTERNAL_ERROR,
        });
      }

    }

    /////////////////////////////////////////////////////////////////// END TRANSACTION

    const findUser = await findUserById(connection, pubKeyHash);

    if (!findUser) {
      throw new ApiError(500, "Internal signature verification", {
        code: ERROR_CODES.INTERNAL_ERROR,
      });
    }

    const tokenData: UserToken = {
      id: findUser.id,
      role: "USER",
      pubkeyhash: findUser.pubkeyhash,
      address: findUser.address,
      wallet_name: findUser.wallet_name,
      country: findUser.country,
      username: findUser.username,
      rsa_version: findUser.rsa_version,
      rsa_public_key: findUser.rsa_public_key
    };

    const token = createToken(
      tokenData,
      process.env.AGENT_JWT_KEY as string,
      process.env.TOKEN_EXPIRATION as string,
      "service-user",
      ["internal"]
    );

    req.session = {
      jwt: token,
    };

    await connection.commit();

    res.status(200).send({ success: true, data: tokenData });
  } catch (err: any) {
    if (connection) await connection.rollback();

    throw err;
  } finally {
    if (connection) connection.release();
  }
};
