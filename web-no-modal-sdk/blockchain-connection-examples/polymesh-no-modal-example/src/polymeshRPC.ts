import { BigNumber, Polymesh } from "@polymeshassociation/polymesh-sdk";
import { LocalSigningManager } from "@polymeshassociation/local-signing-manager";
import { IProvider } from "@web3auth/base";

let api: Polymesh;

export default class polymeshRpc {
  private provider: IProvider;

  constructor(provider: IProvider) {
    this.provider = provider;
  }

  getPolymeshPrivateKey = async (): Promise<string | null> => {
    try {
      const privateKey = (await this.provider.request({ method: "private_key" })) as string;
      return privateKey ? "0x" + privateKey : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  connectPolymesh = async () => {
    if (!api) {
      console.log("Connecting to polymesh...");
      const privateKey = (await this.getPolymeshPrivateKey()) as string;
      const localSigningManager = await LocalSigningManager.create({
        accounts: [{ seed: privateKey, derivationPath: "" }],
      });
      api = await Polymesh.connect({
        nodeUrl: "wss://testnet-rpc.polymesh.live",
        signingManager: localSigningManager,
      });
    }
  };

  getKey = async () => {
    try {
      if (!api) {
        await this.connectPolymesh();
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

  getIdentity = async () => {
    try {
      if (!api) {
        await this.connectPolymesh();
      }
      const identity = await api.getSigningIdentity();
      console.log(`Signing Identity: ${identity?.did || "No identity found"}`);
      return identity?.did || "";
    } catch (error) {
      console.error("Error", error);
    }
  };

  getBalance = async () => {
    try {
      if (!api) {
        await this.connectPolymesh();
      }
      const balance = await api.accountManagement.getAccountBalance();
      console.log(`Signing Key Balance: ${JSON.stringify(balance)}`);
      return balance;
    } catch (error) {
      return error;
    }
  };

  transferPolyx = async () => {
    try {
      if (!api) {
        await this.connectPolymesh();
      }
      const amount = new BigNumber(1);
      const to = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";
      const from = (await this.getKey())?.ss58EncodedKey;

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
}