import type { SafeEventEmitterProvider } from "@web3auth/base";
import { TransactionReceipt, ethers } from "ethers";

import ABI from "../config/ABI.json";
import { IWalletProvider } from "./walletProvider";

const starkexProvider = (provider: SafeEventEmitterProvider | null, uiConsole: (...args: unknown[]) => void): IWalletProvider => {

  const getAddress = async (): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);

      const signer = await ethersProvider.getSigner();

      // Get user's Ethereum public address
      const address = signer.getAddress();
      return address;
    } catch (error) {
      uiConsole(error);
      return error;
    }
  };

  const getBalance = async (): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);

      const signer = await ethersProvider.getSigner();

      // Get user's Ethereum public address
      const address = signer.getAddress();

      // Get user's balance in ether
      const balance = ethers.formatEther(
        await ethersProvider.getBalance(address) // Balance is in wei
      );
      return balance;
    } catch (error) {
      uiConsole(error);
      return error;
    }
  };

  const getSignature = async (message: string): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);

      const signer = await ethersProvider.getSigner();

      // Sign the message
      const signedMessage = await signer.signMessage(message);

      return signedMessage;
    } catch (error) {
      uiConsole(error);
      return error;
    }
  };

  const sendTransaction = async (amount: string, destination: string): Promise<TransactionReceipt | string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);

      const signer = await ethersProvider.getSigner();

      // Convert 1 ether to wei
      const amountBigInt = ethers.parseEther(amount);

      // Submit transaction to the blockchain
      const tx = await signer.sendTransaction({
        to: destination,
        value: amountBigInt,
        maxPriorityFeePerGas: "5000000000", // Max priority fee per gas
        maxFeePerGas: "6000000000000", // Max fee per gas
      });

      // Wait for transaction to be mined
      const receipt = await tx.wait();

      return receipt;
    } catch (error) {
      return error as string;
    }
  }

  const getPrivateKey = async (): Promise<string> => {
    try {
      const privateKey = await provider.request({
        method: "eth_private_key",
      });

      return privateKey as string;
    } catch (error) {
      return error as string;
    }
  }

  const getChainDetails = async (): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);

      const networkDetails = await ethersProvider.getNetwork();

      return JSON.stringify(networkDetails.toJSON());
    } catch (error) {
      return error as string;
    }
  }

  return {
    getAddress,
    getBalance,
    getSignature,
    sendTransaction,
    getPrivateKey,
    getChainDetails,
  };
};

export default starkexProvider;
