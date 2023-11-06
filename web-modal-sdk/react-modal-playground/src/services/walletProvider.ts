import { SafeEventEmitterProvider } from "@web3auth/base";
import { TransactionReceipt } from "ethers";

import evmProvider from "./evmProvider";

export interface IWalletProvider {
  getAddress: () => Promise<string>;
  getBalance: () => Promise<string>;
  getSignature: (message: string) => Promise<string>;
  sendTransaction: (amount: string, destination: string) => Promise<TransactionReceipt | string>;
  getPrivateKey: () => Promise<string>;
  getChainDetails: () => Promise<string>;
  deployContract: (abi: any, bytecode: string) => Promise<void>;
  readContract: () => Promise<any>;
  writeContract: () => Promise<any>;
}

export const getWalletProvider = (provider: SafeEventEmitterProvider | null, uiConsole: any): IWalletProvider => {
  return evmProvider(provider, uiConsole);
};
