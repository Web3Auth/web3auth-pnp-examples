import { BigNumber, Polymesh } from "@polymeshassociation/polymesh-sdk";
import { LocalSigningManager } from "@polymeshassociation/local-signing-manager";
import type { IProvider } from "@web3auth/no-modal";

let api: Polymesh;

export const getPrivateKey = async (provider: IProvider): Promise<string | null> => {
  try {
    const privateKey = (await provider.request({ method: "private_key" })) as string;
    return privateKey ? "0x" + privateKey : null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const connectPolymesh = async (provider: IProvider) => {
  if (!api) {
    console.log("Connecting to polymesh...");
    const privateKey = (await getPrivateKey(provider)) as string;
    const localSigningManager = await LocalSigningManager.create({
      accounts: [{ seed: privateKey, derivationPath: "" }],
    });
    api = await Polymesh.connect({
      nodeUrl: "wss://testnet-rpc.polymesh.live",
      signingManager: localSigningManager,
    });
  }
};

export const getAccounts = async (provider: IProvider) => {
  try {
    if (!api) {
      await connectPolymesh(provider);
    }
    const key = api.accountManagement.getSigningAccount();
    if (key == null) throw new Error("No key found");
    const { address: ss58EncodedKey, key: rawPublicKey } = key;
    console.log(JSON.stringify({ ss58EncodedKey, rawPublicKey }));
    return { ss58EncodedKey, rawPublicKey };
  } catch (error) {
    console.error("Error", error);
  }
};

export const getIdentity = async (provider: IProvider) => {
  try {
    if (!api) {
      await connectPolymesh(provider);
    }
    const identity = await api.getSigningIdentity();
    console.log(`Signing Identity: ${identity?.did || "No identity found"}`);
    return identity?.did || "";
  } catch (error) {
    console.error("Error", error);
  }
};

export const getBalance = async (provider: IProvider) => {
  try {
    if (!api) {
      await connectPolymesh(provider);
    }
    const balance = await api.accountManagement.getAccountBalance();
    console.log(`Signing Key Balance: ${JSON.stringify(balance)}`);
    return balance;
  } catch (error) {
    return error;
  }
};

export const transferPolyx = async (provider: IProvider) => {
  try {
    if (!api) {
      await connectPolymesh(provider);
    }
    const amount = new BigNumber(1);
    const to = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";
    const from = (await getAccounts(provider))?.ss58EncodedKey;

    const transferTx = await api.network.transferPolyx({ amount, to });

    await transferTx.run();

    const { txHash, blockNumber, blockHash, status, error, txIndex } = transferTx;

    return {
      amount,
      from,
      to,
      transactionHash: txHash,
      blockNumber: blockNumber?.toString(),
      txIndex: txIndex?.toString(),
      blockHash,
      status,
      error,
    };
  } catch (error) {
    console.error(error);
    return `Error: ${(error as Error).message}`;
  }
};
