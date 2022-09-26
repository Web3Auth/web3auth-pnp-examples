import { SafeEventEmitterProvider } from "@web3auth/base";
import { connect, KeyPair, keyStores } from "near-api-js";
import { base_encode } from "near-api-js/lib/utils/serialize";
import {
  parseNearAmount,
  formatNearAmount,
} from "near-api-js/lib/utils/format";

export default class NearRPC {
  private provider: SafeEventEmitterProvider;

  constructor(provider: SafeEventEmitterProvider) {
    this.provider = provider;
  }

  getNearKeyPair = async (): Promise<any> => {
    try {
      const privateKey = (await this.provider.request({
        method: "private_key",
      })) as string;
      const keyPair = KeyPair.fromString(base_encode(privateKey));
      return keyPair;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  getAccounts = async () => {
    try {
      const keyPair = await this.getNearKeyPair();
      return keyPair?.getPublicKey().toString().split(":")[1];
    } catch (error) {
      console.error("Error", error);
    }
  };

  getBalance = async () => {
    try {
      const myKeyStore = new keyStores.InMemoryKeyStore();
      const keyPair = await this.getNearKeyPair();
      await myKeyStore.setKey("testnet", "example-account.testnet", keyPair);
      // connections can be made to any network
      // refer https://docs.near.org/tools/near-api-js/quick-reference#connect

      const connectionConfig = {
        networkId: "testnet",
        keyStore: myKeyStore, // first create a key store
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
      };
      const nearConnection = await connect(connectionConfig);
      const account = await nearConnection.account("example-account.testnet");
      const accountBalance = await account.getAccountBalance();
      return accountBalance;
    } catch (error) {
      return error;
    }
  };

  sendTransaction = async () => {
    try {
      const sender = "sender.testnet";
      const receiver = "receiver.testnet";
      const amount = BigInt(1000000000000000000000000);

      const myKeyStore = new keyStores.InMemoryKeyStore();
      const keyPair = await this.getNearKeyPair();
      await myKeyStore.setKey("testnet", "example-account.testnet", keyPair);
      // connections can be made to any network
      // refer https://docs.near.org/tools/near-api-js/quick-reference#connect

      const connectionConfig = {
        networkId: "testnet",
        keyStore: myKeyStore, // first create a key store
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
      };
      const nearConnection = await connect(connectionConfig);
      const senderAccount = await nearConnection.account(sender);
      //   const result = await senderAccount.sendMoney(receiver, amount);
      // error
      return "result";
    } catch (error) {
      return error;
    }
  };
}
