import { SafeEventEmitterProvider } from "@web3auth/base";

import evmProvider from "./evmProvider";
import { TransactionReceipt } from "ethers";

export interface IWalletProvider {
  getAddress: () => Promise<string>;
  getBalance: () => Promise<string>;
  getSignature: (message: string) => Promise<string>;
  sendTransaction: (amount: string, destination: string) => Promise<TransactionReceipt | string>
  getPrivateKey: () => Promise<string>;
}

export const getWalletProvider = (provider: SafeEventEmitterProvider | null, uiConsole: any): IWalletProvider => {
  return evmProvider(provider, uiConsole);
};
