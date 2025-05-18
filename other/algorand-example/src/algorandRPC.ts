import { IProvider } from "@web3auth/modal";
import algosdk from "algosdk";

// Helper function to create Algorand client
export const makeClient = async (): Promise<algosdk.Algodv2> => {
  const algodToken = {
    "x-api-key": "yay5jiXMXr88Bi8nsG1Af9E1X3JfwGOC2F7222r3", // Replace with your PureStake API key or use environment variable
  };
  const algodServer = "https://testnet-algorand.api.purestake.io/ps2";
  const algodPort = "";
  let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
  return algodClient;
};

// Function to get Algorand key pair from provider
export const getAlgorandKeyPair = async (
  provider: IProvider
): Promise<algosdk.Account> => {
  const privateKey = (await provider.request({
    method: "private_key",
  })) as string;
  // Convert hex private key to Uint8Array
  const privateKeyUint8 = Uint8Array.from(Buffer.from(privateKey, "hex"));
  const passphrase = algosdk.secretKeyToMnemonic(privateKeyUint8);
  const keyPair = algosdk.mnemonicToSecretKey(passphrase);
  return keyPair;
};

// Function to get account address
export const getAccounts = async (provider: IProvider): Promise<string> => {
  const keyPair = await getAlgorandKeyPair(provider);
  return keyPair.addr;
};

// Function to get account balance
export const getBalance = async (provider: IProvider): Promise<number> => {
  const keyPair = await getAlgorandKeyPair(provider);
  const client = await makeClient();
  const balance = await client.accountInformation(keyPair.addr).do();
  return balance.amount;
};

// Function to sign a message
export const signMessage = async (provider: IProvider): Promise<string> => {
  const keyPair = await getAlgorandKeyPair(provider);
  const client = await makeClient();
  const params = await client.getTransactionParams().do();
  const enc = new TextEncoder();
  const message = enc.encode("Web3Auth says hello!");
  const txn = algosdk.makePaymentTxnWithSuggestedParams(
    keyPair.addr,
    keyPair.addr,
    0,
    undefined,
    message,
    params
  );
  let signedTxn = algosdk.signTransaction(txn, keyPair.sk);
  let txId = signedTxn.txID;
  return txId;
};

// Function to sign and send a transaction
export const signAndSendTransaction = async (
  provider: IProvider
): Promise<string | undefined> => {
  try {
    const keyPair = await getAlgorandKeyPair(provider);
    const client = await makeClient();
    const params = await client.getTransactionParams().do();
    const enc = new TextEncoder();
    const message = enc.encode("Web3Auth says hello!");

    // You need to have some funds in your account to send a transaction
    // You can get some testnet funds here: https://bank.testnet.algorand.network/

    const txn = algosdk.makePaymentTxnWithSuggestedParams(
      keyPair.addr, // sender
      keyPair.addr, // receiver
      1000, // amount
      undefined,
      message,
      params
    );
    let signedTxn = algosdk.signTransaction(txn, keyPair.sk);

    const txHash = await client.sendRawTransaction(signedTxn.blob).do();

    return txHash.txId;
  } catch (error) {
    console.error("Error signing and sending transaction:", error);
    return undefined; // Return undefined or throw error as preferred
  }
};
