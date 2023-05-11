import { SafeEventEmitterProvider } from "@web3auth/base";
import { connect, KeyPair, keyStores, utils } from "near-api-js";
import * as bip39 from "bip39";
import * as crypto from "crypto-js";
import { parseSeedPhrase } from "near-seed-phrase"

export default class NearRPC {
  private provider: SafeEventEmitterProvider;

  constructor(provider: SafeEventEmitterProvider) {
    this.provider = provider;
  }

  privateKeyToMnemonic = (privateKey: string): string => {
    const privateKeyBuffer = crypto.enc.Hex.parse(privateKey);
    const hash = crypto.SHA256(privateKeyBuffer);
    const entropy = hash.words.slice(0, 4).toString();
    const mnemonic = bip39.entropyToMnemonic(entropy);
    return mnemonic;
  };

  getNearKeyPair = async (): Promise<any> => {
    try {
      const privateKey = (await this.provider.request({
        method: "private_key", // private_key
      })) as string;
      const mnemonic = this.privateKeyToMnemonic(privateKey);
      const parsedKey = parseSeedPhrase(mnemonic);
      const PRIVATE_KEY = parsedKey.secretKey;
      const keyPair = KeyPair.fromString(PRIVATE_KEY);
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