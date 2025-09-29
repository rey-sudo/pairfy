import {
  DatumType,
  MetadataList,
  MetadataListSchema,
  StateMachineDatum,
  Transaction,
  TransactionSchema,
} from "./types.js";
import { blockFrostAPI } from "../api/index.js";
import { Data, fromText, Kupmios, Lucid, Network, UTxO } from "@lucid-evolution/lucid";
import { logger } from "@lovelacers/common";

const provider = new Kupmios(
  process.env.KUPO_KEY as string,
  process.env.OGMIOS_KEY as string
);

let NETWORK: Network = "Preprod";

if (process.env.NETWORK_ENV === "Mainnet") {
  NETWORK = "Mainnet";
}

const lucid = await Lucid(provider, NETWORK);

////////////////////////////////////////////////////////////////////////////////////////////

async function getTxInfo(txHash: string): Promise<Transaction> {
  const response = await blockFrostAPI.get(`/txs/${txHash}`);

  if (response.status !== 200) {
    throw Error("getTxInfo network error");
  }

  const valid = TransactionSchema.safeParse(response.data);

  if (!valid.success) {
    throw Error("getTxInfo invalid params");
  }

  const scheme: Transaction = valid.data;

  return scheme;
}

async function getTxMetadata(txHash: string): Promise<MetadataList> {
  const response = await blockFrostAPI.get(`/txs/${txHash}/metadata`);

  if (response.status !== 200) {
    throw Error("getTxMetadata network error");
  }

  const valid = MetadataListSchema.safeParse(response.data);

  if (!valid.success) {
    throw Error("getTxMetadata invalid params");
  }

  const scheme: MetadataList = valid.data;

  return scheme;
}

export type UtxoResponseFailed = {
  success: boolean;
  failed: boolean;
};

export type UtxoData = {
  utxo: UTxO;
  txInfo: Transaction;
  txMetadata: MetadataList;
  blockTime: number;
  datum: DatumType;
  metadata: string;
  txHash: string;
};

export type UtxoResponse = UtxoResponseFailed & UtxoData;

async function getUtxo(
  threadtoken: string
): Promise<UtxoResponse | UtxoResponseFailed> {
  try {
    const assetUnit = threadtoken + fromText("threadtoken");

    const getUtxo = await lucid.utxoByUnit(assetUnit);

    if (!getUtxo) {
      return {
        success: false,
        failed: false,
      };
    }

    const txInfo = await getTxInfo(getUtxo.txHash);

    const txMetadata = await getTxMetadata(getUtxo.txHash);

    const response = {
      success: true,
      failed: false,
      utxo: getUtxo,
      txInfo,
      txMetadata,
      blockTime: txInfo.block_time,
      datum: Data.from(getUtxo.datum!, StateMachineDatum),
      metadata: JSON.stringify(txMetadata),
      txHash: getUtxo.txHash + "#" + getUtxo.outputIndex,
    };

    return response;
  } catch (err: any) {
    logger.error({
      service: "service-state",
      event: "blockchain.error",
      message: "getUtxo error",
      error: err,
    });

    const response = {
      success: false,
      failed: true,
    };

    return response;
  }
}

export { StateMachineDatum, lucid, getUtxo };
