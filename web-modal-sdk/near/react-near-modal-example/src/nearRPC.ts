import { SafeEventEmitterProvider } from "@web3auth/base";
import { connect, KeyPair, keyStores, utils } from "near-api-js";
import { parseSeedPhrase } from "near-seed-phrase"
import { ShareSerializationModule } from "@tkey/share-serialization";
export default class NearRPC {
  private provider: SafeEventEmitterProvider;

  constructor(provider: SafeEventEmitterProvider) {
    this.provider = provider;
  }

  privateKeyToMnemonic = (privateKey: string): string => {
    const mnemonic = ShareSerializationModule.serializeMnemonic(privateKey as any);
    console.log("mnemonic", mnemonic);
    return mnemonic;
  };

  createNamedAccount = async() => {
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

    const result = await account.functionCall({
      contractId: "testnet", // near contract to create a testnet AccountId, use "near" for mainnet
      methodName: "create_account",
      args: {
        "new_account_id": "web3auth-test.testnet", /// Change the name since this is already taken, use "<name>.near" for mainnet
        "new_public_key": pk58,
      },
      gas: "300000000000000" as any, //setting gas allowance for running contract
      attachedDeposit: "1829999999999999999990" as any,
    });
    return result;
  }

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
      const result = await senderAccount.sendMoney(receiver, utils.format.parseNearAmount(amount) as any);
      return result;
    } catch (error) {
      return error;
    }
  };
}