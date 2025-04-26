import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  Keypair,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { CustomChainConfig, IProvider } from "@web3auth/base";
import { SolanaWallet } from "@web3auth/solana-provider";
// import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";

export const getAccounts = async (provider: IProvider): Promise<string[]> => {
  try {
    const solanaWallet = new SolanaWallet(provider);
    const acc = await solanaWallet.requestAccounts();
    return acc;
  } catch (error) {
    console.error("Error getting accounts:", error);
    throw error;
  }
};

export const getBalance = async (provider: IProvider): Promise<string> => {
  try {
    const solanaWallet = new SolanaWallet(provider);
    const connectionConfig = await solanaWallet.request<string[], CustomChainConfig>({
      method: "solana_provider_config",
      params: [],
    });
    const conn = new Connection(connectionConfig.rpcTarget);

    const accounts = await solanaWallet.requestAccounts();
    if (accounts.length === 0) throw new Error("No accounts found");
    const balance = await conn.getBalance(new PublicKey(accounts[0]));
    return balance.toString();
  } catch (error) {
    console.error("Error getting balance:", error);
    throw error;
  }
};

export const signMessage = async (provider: IProvider): Promise<string> => {
  try {
    const solanaWallet = new SolanaWallet(provider);
    const msg = Buffer.from("Test Signing Message ", "utf8");
    const res = await solanaWallet.signMessage(msg);
    return Buffer.from(res).toString("hex");
  } catch (error) {
    console.error("Error signing message:", error);
    throw error;
  }
};

export const sendTransaction = async (provider: IProvider): Promise<string> => {
  try {
    const solanaWallet = new SolanaWallet(provider);
    const accounts = await solanaWallet.requestAccounts();
    if (accounts.length === 0) throw new Error("No accounts found");

    const connectionConfig = await solanaWallet.request<string[], CustomChainConfig>({
      method: "solana_provider_config",
      params: [],
    });
    const connection = new Connection(connectionConfig.rpcTarget);

    const block = await connection.getLatestBlockhash("finalized");

    const TransactionInstruction = SystemProgram.transfer({
      fromPubkey: new PublicKey(accounts[0]),
      toPubkey: new PublicKey(accounts[0]),
      lamports: 0.001 * LAMPORTS_PER_SOL,
    });

    const transaction = new Transaction({
      blockhash: block.blockhash,
      lastValidBlockHeight: block.lastValidBlockHeight,
      feePayer: new PublicKey(accounts[0]),
    }).add(TransactionInstruction);

    const { signature } = await solanaWallet.signAndSendTransaction(
      transaction
    );

    return signature;
  } catch (error) {
    console.error("Error sending transaction:", error);
    throw error;
  }
};

export const signTransaction = async (provider: IProvider): Promise<string> => {
  try {
    const solanaWallet = new SolanaWallet(provider);
    const connectionConfig = await solanaWallet.request<string[], CustomChainConfig>({
      method: "solana_provider_config",
      params: [],
    });
    const conn = new Connection(connectionConfig.rpcTarget);

    const pubKey = await solanaWallet.requestAccounts();
    if (pubKey.length === 0) throw new Error("No accounts found");
    const { blockhash } = await conn.getLatestBlockhash("finalized");
    const TransactionInstruction = SystemProgram.transfer({
      fromPubkey: new PublicKey(pubKey[0]),
      toPubkey: new PublicKey(pubKey[0]),
      lamports: 0.001 * LAMPORTS_PER_SOL,
    });
    const transaction = new Transaction({
      recentBlockhash: blockhash,
      feePayer: new PublicKey(pubKey[0]),
    }).add(TransactionInstruction);

    const signedTx = await solanaWallet.signTransaction(transaction);
    if (signedTx.signature) {
      return Buffer.from(signedTx.signature).toString('base64');
    }
    return "Signature not found";
  } catch (error) {
    console.error("Error signing transaction:", error);
    throw error;
  }
};

export const sendVersionTransaction = async (provider: IProvider): Promise<string> => {
  try {
    const solanaWallet = new SolanaWallet(provider);
    const connectionConfig = await solanaWallet.request<string[], CustomChainConfig>({ method: "solana_provider_config", params: [] });
    const conn = new Connection(connectionConfig.rpcTarget);

    const pubKey = await solanaWallet.requestAccounts();
    if (pubKey.length === 0) throw new Error("No accounts found");
    const { blockhash } = await conn.getLatestBlockhash("finalized");
    const TransactionInstruction = SystemProgram.transfer({
      fromPubkey: new PublicKey(pubKey[0]),
      toPubkey: new PublicKey(pubKey[0]),
      lamports: 0.001 * LAMPORTS_PER_SOL,
    });

    const transactionMessage = new TransactionMessage({
      recentBlockhash: blockhash,
      instructions: [TransactionInstruction],
      payerKey: new PublicKey(pubKey[0]),
    });
    const transaction = new VersionedTransaction(transactionMessage.compileToV0Message());
    const { signature } = await solanaWallet.signAndSendTransaction(transaction);
    return signature;
  } catch (error) {
    console.error("Error sending versioned transaction:", error);
    throw error;
  }
};

export const signVersionedTransaction = async (provider: IProvider): Promise<VersionedTransaction> => {
  try {
    const solanaWallet = new SolanaWallet(provider);
    const connectionConfig = await solanaWallet.request<string[], CustomChainConfig>({ method: "solana_provider_config", params: [] });
    const conn = new Connection(connectionConfig.rpcTarget);

    const pubKey = await solanaWallet.requestAccounts();
    if (pubKey.length === 0) throw new Error("No accounts found");
    const { blockhash } = await conn.getLatestBlockhash("finalized");
    const TransactionInstruction = SystemProgram.transfer({
      fromPubkey: new PublicKey(pubKey[0]),
      toPubkey: new PublicKey(pubKey[0]),
      lamports: 0.001 * LAMPORTS_PER_SOL,
    });

    const transactionMessage = new TransactionMessage({
      recentBlockhash: blockhash,
      instructions: [TransactionInstruction],
      payerKey: new PublicKey(pubKey[0]),
    });
    const transaction = new VersionedTransaction(transactionMessage.compileToV0Message());

    const signedTx = await solanaWallet.signTransaction<VersionedTransaction>(transaction);
    return signedTx;
  } catch (error) {
    console.error("Error signing versioned transaction:", error);
    throw error;
  }
};

export const signAllTransaction = async (provider: IProvider): Promise<Transaction[]> => {
  try {
    const solanaWallet = new SolanaWallet(provider);
    const connectionConfig = await solanaWallet.request<string[], CustomChainConfig>({ method: "solana_provider_config", params: [] });
    const conn = new Connection(connectionConfig.rpcTarget);

    const pubKey = await solanaWallet.requestAccounts();
    if (pubKey.length === 0) throw new Error("No accounts found");
    const { blockhash } = await conn.getLatestBlockhash("finalized");

    const instructions = [
      SystemProgram.transfer({
        fromPubkey: new PublicKey(pubKey[0]),
        toPubkey: new PublicKey(pubKey[0]),
        lamports: 0.001 * LAMPORTS_PER_SOL,
      }),
      SystemProgram.transfer({
        fromPubkey: new PublicKey(pubKey[0]),
        toPubkey: new PublicKey(pubKey[0]),
        lamports: 0.002 * LAMPORTS_PER_SOL,
      }),
    ];

    const transactions = instructions.map(instruction =>
      new Transaction({ recentBlockhash: blockhash, feePayer: new PublicKey(pubKey[0]) }).add(instruction)
    );

    const signedTxs = await solanaWallet.signAllTransactions(transactions);
    return signedTxs;
  } catch (error) {
    console.error("Error signing all transactions:", error);
    throw error;
  }
};

export const signAllVersionedTransaction = async (provider: IProvider): Promise<VersionedTransaction[]> => {
  try {
    const solanaWallet = new SolanaWallet(provider);
    const connectionConfig = await solanaWallet.request<string[], CustomChainConfig>({ method: "solana_provider_config", params: [] });
    const conn = new Connection(connectionConfig.rpcTarget);

    const pubKey = await solanaWallet.requestAccounts();
    if (pubKey.length === 0) throw new Error("No accounts found");
    const { blockhash } = await conn.getLatestBlockhash("finalized");

    const instructions = [
      SystemProgram.transfer({
        fromPubkey: new PublicKey(pubKey[0]),
        toPubkey: new PublicKey(pubKey[0]),
        lamports: 0.001 * LAMPORTS_PER_SOL,
      }),
      SystemProgram.transfer({
        fromPubkey: new PublicKey(pubKey[0]),
        toPubkey: new PublicKey(pubKey[0]),
        lamports: 0.002 * LAMPORTS_PER_SOL,
      }),
    ];

    const transactions = instructions.map(instruction => {
      const message = new TransactionMessage({
        recentBlockhash: blockhash,
        payerKey: new PublicKey(pubKey[0]),
        instructions: [instruction]
      });
      return new VersionedTransaction(message.compileToV0Message());
    });

    const signedTxs = await solanaWallet.signAllTransactions(transactions);
    console.log(signedTxs);
    return signedTxs;
  } catch (error) {
    console.error("Error signing all versioned transactions:", error);
    throw error;
  }
};

export const getPrivateKey = async (provider: IProvider): Promise<string> => {
  try {
    const privateKey = await provider.request({
      method: "solana_private_key",
    });

    return privateKey as string;
  } catch (error) {
    console.error("Error getting private key:", error);
    return "Error: Private key export might not be supported by this provider.";
  }
};
