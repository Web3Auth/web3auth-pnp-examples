/* eslint-disable no-console */
import type { IProvider } from "@web3auth/base";
import { createPublicClient, createWalletClient, custom, formatEther, parseEther } from "viem";
import { lineaSepolia, mainnet, polygonAmoy, sepolia } from "viem/chains";

import { sendBundle } from "./lineaRPC";

const getViewChain = (provider: IProvider) => {
  switch (provider.chainId) {
    case "1":
      return mainnet;
    case "0x13882":
      return polygonAmoy;
    case "0xaa36a7":
      return sepolia;
    case "0xe705":
      return lineaSepolia;
    default:
      return mainnet;
  }
};

const getChainId = async (provider: IProvider): Promise<any> => {
  try {
    const walletClient = createWalletClient({
      transport: custom(provider),
    });

    const address = await walletClient.getAddresses();
    console.log(address);

    const chainId = await walletClient.getChainId();
    return chainId.toString();
  } catch (error) {
    return error;
  }
};
const getAccounts = async (provider: IProvider): Promise<any> => {
  try {
    const walletClient = createWalletClient({
      chain: getViewChain(provider),
      transport: custom(provider),
    });

    const address = await walletClient.getAddresses();

    return address;
  } catch (error) {
    return error;
  }
};

const getBalance = async (provider: IProvider): Promise<string> => {
  try {
    const publicClient = createPublicClient({
      chain: getViewChain(provider),
      transport: custom(provider),
    });

    const walletClient = createWalletClient({
      chain: getViewChain(provider),
      transport: custom(provider),
    });

    const address = await walletClient.getAddresses();

    const balance = await publicClient.getBalance({ address: address[0] });
    console.log(balance);
    return formatEther(balance);
  } catch (error) {
    return error as string;
  }
};

const sendTransaction = async (provider: IProvider): Promise<any> => {
  try {
    const publicClient = createPublicClient({
      chain: getViewChain(provider),
      transport: custom(provider),
    });

    const walletClient = createWalletClient({
      chain: getViewChain(provider),
      transport: custom(provider),
    });

    // data for the transaction
    const destination = "0x40e1c367Eca34250cAF1bc8330E9EddfD403fC56";
    const amount = parseEther("0.0001");
    const address = await walletClient.getAddresses();

    // Submit transaction to the blockchain
    const hash = await walletClient.sendTransaction({
      account: address[0],
      to: destination,
      value: amount,
    });
    console.log(hash);
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    return JSON.stringify(
      receipt,
      (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
    );
  } catch (error) {
    return error;
  }
};

const signMessage = async (provider: IProvider): Promise<any> => {
  try {
    const walletClient = createWalletClient({
      chain: getViewChain(provider),
      transport: custom(provider),
    });

    // data for signing
    const address = await walletClient.getAddresses();
    const originalMessage = "YOUR_MESSAGE";

    // Sign the message
    const hash = await walletClient.signMessage({
      account: address[0],
      message: originalMessage,
    });

    console.log(hash);

    return hash.toString();
  } catch (error) {
    return error;
  }
};

const sendBundleTransaction = async (provider: IProvider): Promise<any> => {
  try {
    const walletClient = createWalletClient({
      chain: getViewChain(provider),
      transport: custom(provider),
    });

    const address = await walletClient.getAddresses();

    // Prepare transaction
    const requestTx1 = await walletClient.prepareTransactionRequest({
      account: address[0],
      to: address[0],
      value: parseEther("0.0001"),
    });

    // Sign transaction
    const signatureTx1 = await walletClient.signTransaction(requestTx1 as any);
    console.log("signatureTx1", signatureTx1);

    // Send transaction
    const requestTx2 = await walletClient.prepareTransactionRequest({
      account: address[0],
      to: address[0],
      value: parseEther("0.0004"),
    });

    // Sign transaction
    const signatureTx2 = await walletClient.signTransaction(requestTx2 as any);
    console.log("signatureTx2", signatureTx2);

    // Send bundle
    const response = await sendBundle({ transactions: [signatureTx1, signatureTx2] });
    console.log("response", response);
    return response;
  } catch (error) {
    return error;
  }
};
export default { getChainId, getAccounts, getBalance, sendTransaction, signMessage, sendBundleTransaction };
