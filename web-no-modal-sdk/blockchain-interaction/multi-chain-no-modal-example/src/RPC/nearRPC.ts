import { getED25519Key } from "@web3auth/auth-adapter";
import { SafeEventEmitterProvider } from "@web3auth/base";
import { connect, KeyPair, keyStores, utils } from "near-api-js";
export default class NearRPC {
  private provider: SafeEventEmitterProvider;

  constructor(provider: SafeEventEmitterProvider) {
    this.provider = provider;
  }

  createNamedAccount = async () => {
    const keyPair = await this.getNearKeyPair();
    const pk58 = keyPair?.getPublicKey().data || [];
    const accountId = Buffer.from(pk58 || []).toString("hex");
    const myKeyStore = new keyStores.InMemoryKeyStore();
    await myKeyStore.setKey("testnet", accountId, keyPair!);
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
        new_account_id: "web3auth-test.testnet", /// Change the name since this is already taken, use "<name>.near" for mainnet
        new_public_key: pk58,
      },
      gas: "300000000000000" as any, //setting gas allowance for running contract
      attachedDeposit: "1829999999999999999990" as any,
    });
    return result;
  };

  getNearKeyPair = async () => {
    try {
      const privateKey = (await this.provider.request({
        method: "private_key", // private_key
      })) as string;

      const privateKeyEd25519 = getED25519Key(privateKey).sk.toString("hex");

      const privateKeyEd25519Buffer = Buffer.from(privateKeyEd25519, "hex");
      const bs58encode = utils.serialize.base_encode(privateKeyEd25519Buffer as any);
      const keyPair = KeyPair.fromString(`ed25519:${bs58encode}`);
      return keyPair;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  getAccounts = async () => {
    try {
      const keyPair = await this.getNearKeyPair();
      const pk58 = keyPair?.getPublicKey().data || [];
      const accountId = Buffer.from(pk58 || []).toString("hex");
      return { "Public Key": pk58, "Account ID": accountId };
    } catch (error) {
      console.error("Error", error);
    }
  };

  getBalance = async () => {
    try {
      const keyPair = await this.getNearKeyPair();
      const pk58 = keyPair?.getPublicKey().data || [];
      const accountId = Buffer.from(pk58 || []).toString("hex");
      const myKeyStore = new keyStores.InMemoryKeyStore();
      await myKeyStore.setKey("testnet", accountId, keyPair!);
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
      return utils.format.formatNearAmount(accountBalance.available) + " Ⓝ";
    } catch (error) {
      return error;
    }
  };

  sendTransaction = async () => {
    try {
      const keyPair = await this.getNearKeyPair();
      const pk58 = keyPair?.getPublicKey().data || [];
      const accountId = Buffer.from(pk58 || []).toString("hex");
      const receiver = "shahbaz17.testnet";
      const amount = "2";
      const myKeyStore = new keyStores.InMemoryKeyStore();
      await myKeyStore.setKey("testnet", accountId, keyPair!);
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
