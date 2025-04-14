import { createPublicClient, createWalletClient, custom, formatEther, parseEther, PublicClient, WalletClient } from "viem";
import { sepolia } from "viem/chains";

import { web3auth } from "./web3auth"; // Adjust the import path as needed

let publicClient: PublicClient | null = null;
let walletClient: WalletClient | null = null;

export function initClients() {
  if (typeof window !== "undefined" && web3auth.provider) {
    publicClient = createPublicClient({
      chain: sepolia,
      transport: custom(web3auth.provider),
    });

    walletClient = createWalletClient({
      chain: sepolia,
      transport: custom(web3auth.provider),
    });
  }
}

export function getPublicClient() {
  if (typeof window !== "undefined" && !publicClient) {
    initClients();
  }
  return publicClient;
}

export function getWalletClient() {
  if (typeof window !== "undefined" && !walletClient) {
    initClients();
  }
  return walletClient;
}

export { formatEther, parseEther };
