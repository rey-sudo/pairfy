import { defineStore } from "pinia";
import { Buffer } from "buffer";

export const useWalletStore = defineStore("wallet", () => {
  const connected = ref(false);
  const walletApi = ref<any>(null);
  const walletName = ref<string | null>(null);

  const getMessage = () => {
    const message = "PLEASE SIGN TO AUTHENTICATE YOUR PUBLIC SIGNATURE"; //env variable

    return Buffer.from(message, "utf8").toString("hex");
  };

  const getAddress = async () => {
    if (!walletApi.value) {
      return;
    }

    const addresses = await walletApi.value.getUsedAddresses();

    return addresses?.[0] || null;
  };

  const signMessage = async () => {
    if (!walletApi.value) {
      return;
    }

    const address = await getAddress();

    const signature = await walletApi.value.signData(address, getMessage());

    return [signature, address];
  };

  const connect = async (name: string) => {
    if (!import.meta.client) return;

    if (!name) return;

    try {
      console.log("WALLET", name)
      
      walletApi.value = await window.cardano[name]?.enable();

      const networkId = await walletApi.value?.getNetworkId(); // 0 = testnet, 1 = mainnet

      const cardanoNetwork = useRuntimeConfig().public.cardanoNetwork;

      const networkNumber = cardanoNetwork === "mainnet" ? 1 : 0;

      if (networkId !== networkNumber) {
        throw new Error(
          `⚠️ Wallet connection: Please switch your wallet to ${cardanoNetwork}.`
        );
      }

      walletName.value = name;
      connected.value = true;
    } catch (err) {
      console.error("Error creating wallet instance", err);
      throw err;
    }
  };

  const sign = async () => {
    try {
      if (!walletApi.value) {
        return;
      }

      return await signMessage();
    } catch (err: any) {
      throw err;
    }
  };

  const disconnect = () => {
    connected.value = false;
    walletApi.value = null;
    walletName.value = null;
  };

  const balanceTx = async (unbalancedTx: string, metadata = null) => {
    if (!import.meta.client) return;

    if (!walletApi.value) {
      throw new Error("There is no walletApi instance.");
    }

    const { $CSL } = useNuxtApp();

    const CardanoWasm: any = $CSL;

    const oldTx = CardanoWasm.Transaction.from_hex(unbalancedTx);

    console.log(
      "-----------------------------------------------------------------------------"
    );

    console.log("OLD BODY", oldTx.to_json());

    //////////////////////////////////////////////////////////////////////////   METADATA

    let theBody = null;
    let theAuxData = null;

    if (metadata) {
      const generalMetadata =
        oldTx.auxiliary_data()?.metadata() ??
        CardanoWasm.GeneralTransactionMetadata.new();

      generalMetadata.insert(
        CardanoWasm.BigNum.from_str("674"),
        CardanoWasm.encode_json_str_to_metadatum(
          JSON.stringify({ msg: metadata }),
          0
        )
      );

      theAuxData = CardanoWasm.AuxiliaryData.new();
      theAuxData.set_metadata(generalMetadata);
      const metadataHash = CardanoWasm.hash_auxiliary_data(theAuxData);

      theBody = CardanoWasm.TransactionBody.from_bytes(oldTx.body().to_bytes());
      theBody.set_auxiliary_data_hash(metadataHash);
    } else {
      theBody = oldTx.body();
      theAuxData = oldTx.auxiliary_data();
    }

    //////////////////////////////////////////////////////////////////////////

    const template = CardanoWasm.Transaction.new(
      theBody,
      oldTx.witness_set(),
      theAuxData
    );

    ////////////////////////////////////////////////////////////////////////// SIGNATURE

    let txVkeyWitnesses = await walletApi.value.signTx(
      Buffer.from(template.to_bytes()).toString("hex"),
      true
    );

    txVkeyWitnesses = CardanoWasm.TransactionWitnessSet.from_bytes(
      Buffer.from(txVkeyWitnesses, "hex")
    );

    const newTransactionWitnessSet = template.witness_set();
    newTransactionWitnessSet.set_vkeys(txVkeyWitnesses.vkeys());

    /////////////////////////////////////////////////////

    const newTx = CardanoWasm.Transaction.new(
      template.body(),
      newTransactionWitnessSet,
      template.auxiliary_data()
    );

    console.log(
      "/////////////////////////////////////////////////////////////////////////////////////////"
    );

    console.log("NEWBODY", newTx.to_json());

    return walletApi.value.submitTx(
      Buffer.from(newTx.to_bytes()).toString("hex")
    );
  };

  return {
    connected,
    walletApi,
    walletName,
    connect,
    sign,
    disconnect,
    balanceTx,
  };
});
