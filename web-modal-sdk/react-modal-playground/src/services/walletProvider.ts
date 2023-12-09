import { IProvider } from "@web3auth/base";

import evmProvider from "./evmProvider";

export interface IWalletProvider {
  getAddress: () => Promise<string>;
  getBalance: () => Promise<string>;
  getChainId: () => Promise<string>;
  getSignature: (message: string) => Promise<string>;
  sendTransaction: (amount: string, destination: string) => Promise<string>;
  getPrivateKey: () => Promise<string>;
  deployContract: (abi: any, bytecode: string, initValue: string) => Promise<void>;
  readContract: (contractAddress: string, contractABI: any) => Promise<string>;
  writeContract: (contractAddress: string, contractABI: any, updatedValue: string) => Promise<string>;
}

export const getWalletProvider = (provider: IProvider | null, uiConsole: any): IWalletProvider => {
  return evmProvider(provider, uiConsole);
};
