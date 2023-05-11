import { SafeEventEmitterProvider } from "@web3auth/base";
import { connect, KeyPair, keyStores, utils } from "near-api-js";

export default class NearRPC {
  private provider: SafeEventEmitterProvider;

  constructor(provider: SafeEventEmitterProvider) {
    this.provider = provider;
  }

  getNearKeyPair = async (): Promise<any> => {
    try {
      const privateKey = (await this.provider.request({
        method: "private_key", // private_key
      })) as string;
      const encodedPrivateKey = utils.serialize.base_encode(privateKey);
      console.log("encodedPrivateKey", encodedPrivateKey);
      const keyPair = KeyPair.fromString(encodedPrivateKey);
      // const keyPair = KeyPair.fromString("ed25519:43qKAz3LfCTWpTAZPgA1DGsuwbiAjyosXpDrw24efAGP8Q3TcrnoUzTQHNRF5EbNTR38GRVdsHai9sRnzVu755gU");
      // const keyPair = KeyPair.fromRandom("ed25519");
      return keyPair;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  getAccounts = async () => {
    try {
      const keyPair = await this.getNearKeyPair();
      const pk58 = keyPair?.getPublicKey().toString();
      const accountId = utils.serialize.base_decode(pk58.split(":")[1]).toString("hex");
      return {"Public Key": pk58, "Account ID": accountId};
    } catch (error) {
      console.error("Error", error);
    }
  };

  getBalance = async () => {
    try {
      const keyPair = await this.getNearKeyPair();
      const pk58 = keyPair?.getPublicKey().toString()
      const accountId = utils.serialize.base_decode(pk58.split(":")[1]).toString("hex");
      const myKeyStore = new keyStores.InMemoryKeyStore();
      await myKeyStore.setKey("testnet", accountId, keyPair);
      const connectionConfig = {
        networkId: "testnet",
        keyStore: myKeyStore,
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
      };
      const nearConnection = await connect(connectionConfig);
      
      const account = await nearConnection.account(accountId);
      const accountBalance = await account.getAccountBalance();
      return utils.format.formatNearAmount(accountBalance.available)+" Ⓝ";
    } catch (error) {
      return error;
    }
  };

  sendTransaction = async () => {
    try {
      const keyPair = await this.getNearKeyPair();
      const pk58 = keyPair?.getPublicKey().toString()
      const accountId = utils.serialize.base_decode(pk58.split(":")[1]).toString("hex");
      const receiver = "shahbaz17.testnet";
      const amount = "2";
      const myKeyStore = new keyStores.InMemoryKeyStore();
      await myKeyStore.setKey("testnet", accountId, keyPair);
      const connectionConfig = {
        networkId: "testnet",
        keyStore: myKeyStore,
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
      };
      const nearConnection = await connect(connectionConfig);
      const senderAccount = await nearConnection.account(accountId);
      const result = await senderAccount.sendMoney(receiver, utils.format.parseNearAmount(amount));
      return result;
    } catch (error) {
      return error;
    }
  };
}