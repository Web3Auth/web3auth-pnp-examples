import { SafeEventEmitterProvider } from "@web3auth/base";
import algosdk from "algosdk";

export default class AlgorandRPC {
  private provider: SafeEventEmitterProvider;

  constructor(provider: SafeEventEmitterProvider) {
    this.provider = provider;
  }

  getAlgorandKeyPair = async (): Promise<any> => {
    const privateKey = (await this.provider.request({
      method: "private_key",
    })) as string;
    var passphrase = algosdk.secretKeyToMnemonic(
      Buffer.from(privateKey, "hex")
    );
    var account = algosdk.mnemonicToSecretKey(passphrase);
    return account;
  };

  getAccounts = async (): Promise<any> => {
    const account = await this.getAlgorandKeyPair();
    return account.addr;
  };

  getBalance = async (): Promise<any> => {
    const account = await this.getAlgorandKeyPair();
    const client = await this.makeClient();
    const balance = await client.accountInformation(account.addr).do();
    return balance.amount;
  };

  makeClient = async (): Promise<any> => {
    const algodToken = {
      "x-api-key": "yay5jiXMXr88Bi8nsG1Af9E1X3JfwGOC2F7222r3",
    };
    const algodServer = "https://testnet-algorand.api.purestake.io/ps2";
    const algodPort = "";
    let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
    const client = algodClient;
    return client;
  };

  signMessage = async (): Promise<any> => {
    const account = await this.getAlgorandKeyPair();
    const client = await this.makeClient();
    const params = await client.getTransactionParams().do();
    const enc = new TextEncoder();
    const message = enc.encode("Web3Auth says hello!");
    const txn = algosdk.makePaymentTxnWithSuggestedParams(
      account.addr,
      account.addr,
      0,
      undefined,
      message,
      params
    );
    let signedTxn = algosdk.signTransaction(txn, account.sk);
    let txId = signedTxn.txID;
    return txId;
  };

  signAndSendTransaction = async (): Promise<any> => {
    const account = await this.getAlgorandKeyPair();
    const client = await this.makeClient();
    const params = await client.getTransactionParams().do();
    const enc = new TextEncoder();
    const message = enc.encode("Web3Auth says hello!");

    // You need to have some funds in your account to send a transaction
    // You can get some testnet funds here: https://bank.testnet.algorand.network/

    const txn = algosdk.makePaymentTxnWithSuggestedParams(
      account.addr, // sender
      account.addr, // receiver
      1000,
      undefined,
      message,
      params
    );
    let signedTxn = algosdk.signTransaction(txn, account.sk);

    const txHash = await client.sendRawTransaction(signedTxn.blob).do();

    return txHash.txId;
  };
}
