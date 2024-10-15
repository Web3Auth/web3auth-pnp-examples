// Solana
import { SolanaPrivateKeyProvider, SolanaWallet } from "@web3auth/solana-provider";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

import IRPC from "./IRPC";
import { getED25519Key } from "@web3auth/auth-adapter";

export default class SolanaRPC implements IRPC {
  private provider: SolanaPrivateKeyProvider;
  private privateKey: string;

  constructor(privateKey: string) {
    this.provider = new SolanaPrivateKeyProvider({
      config: {
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.SOLANA,
          chainId: "0x3",
          rpcTarget: "https://api.devnet.solana.com",
          displayName: "Solana Mainnet",
          blockExplorerUrl: "https://explorer.solana.com/",
          ticker: "SOL",
          tickerName: "Solana",
          logo: "",
        },
      },
    });
    this.privateKey = privateKey;
  }

  getChainId(): Promise<any> {
    throw new Error("Method not implemented.");
  }

  async getAccounts(): Promise<any> {
    const ed25519key = getED25519Key(this.privateKey).sk.toString("hex");
    // Get user's Solana's public address
    await this.provider.setupProvider(ed25519key);
    const solanaWallet = new SolanaWallet(this.provider as SolanaPrivateKeyProvider);
    const solana_address = await solanaWallet.requestAccounts();
    return solana_address[0];
  }

  async getBalance(): Promise<string> {
    const address = await this.getAccounts();

    const connection = new Connection(this.provider.config.chainConfig.rpcTarget);

    // Fetch the balance for the specified public key
    const balance = await connection.getBalance(new PublicKey(address));

    return balance.toString();
  }

  sendTransaction(): Promise<any> {
    throw new Error("Method not implemented.");
  }
  signMessage(): Promise<any> {
    throw new Error("Method not implemented.");
  }
  getPrivateKey(): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
