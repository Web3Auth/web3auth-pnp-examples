// Solana
import { Keypair, Connection } from "@solana/web3.js";
import { IProvider, getED25519Key } from "@web3auth/modal";
import nacl from 'tweetnacl';
/**
 * Gets the Solana account address from a private key
 * @param ethProvider The Ethereum provider
 * @returns The Solana account address
 */
export async function getSolanaAccount(
  ethProvider: IProvider,
): Promise<string> {
  const ethPrivateKey = await ethProvider.request({
    method: "private_key",
  });
  
  const privateKey = getED25519Key(ethPrivateKey as string).sk.toString("hex");
  const secretKey = new Uint8Array(Buffer.from(privateKey, 'hex'));
  const keypair = Keypair.fromSecretKey(secretKey);
  return keypair.publicKey.toBase58();
}

/**
 * Gets the balance for a Solana account
 * @param ethProvider The Ethereum provider
 * @returns The account balance as a string
 */
export async function getSolanaBalance(
  ethProvider: IProvider,
): Promise<string> {
  const ethPrivateKey = await ethProvider.request({
    method: "private_key",
  });
  const privateKey = getED25519Key(ethPrivateKey as string).sk.toString("hex");
  const secretKey = new Uint8Array(Buffer.from(privateKey, 'hex'));
  const keypair = Keypair.fromSecretKey(secretKey);
  const connection = new Connection("https://api.devnet.solana.com");
  const balance = await connection.getBalance(keypair.publicKey);
  return balance.toString();
}

/**
 * Signs a message with a Solana account
 * @param ethProvider The Ethereum provider
 * @param message The message to sign
 * @returns The signature as a base58 string
 */
export async function signSolanaMessage(
  ethProvider: IProvider,
): Promise<string> {
  try {
    const ethPrivateKey = await ethProvider.request({
      method: "private_key",
    });
    const privateKey = getED25519Key(ethPrivateKey as string).sk.toString("hex");
    const secretKey = new Uint8Array(Buffer.from(privateKey, 'hex'));
    const keypair = Keypair.fromSecretKey(secretKey);
    
    // Convert message to Uint8Array
    const messageBytes = new TextEncoder().encode("Hello Solana");
    
    // Sign the message
    const signature = nacl.sign.detached(messageBytes, keypair.secretKey);
    
    return Buffer.from(signature).toString('base64');
  } catch (error) {
    console.error("Error signing Solana message:", error);
    throw error;
  }
}

/**
 * Sends a transaction on the Solana network
 * @param ethProvider The Ethereum provider
 * @returns The transaction signature
 */
export async function sendSolanaTransaction(
  ethProvider: IProvider,
): Promise<string> {
  try {
    const ethPrivateKey = await ethProvider.request({
      method: "private_key",
    });
    const privateKey = getED25519Key(ethPrivateKey as string).sk.toString("hex");
    const secretKey = new Uint8Array(Buffer.from(privateKey, 'hex'));
    const keypair = Keypair.fromSecretKey(secretKey);
    
    const connection = new Connection("https://api.devnet.solana.com");
    
    // Import required modules for transaction
    const { SystemProgram, Transaction, PublicKey, sendAndConfirmTransaction } = await import("@solana/web3.js");
    
    // Create a test recipient address (you can replace this with an actual recipient)
    const toAccount = new PublicKey("7C4jsPZpht1JHMWmwDF5ZEVfGSBViXCKbQEcm2GKHtKQ");
    
    // Create a transfer instruction
    const transferInstruction = SystemProgram.transfer({
      fromPubkey: keypair.publicKey,
      toPubkey: toAccount,
      lamports: 100000, // 0.0001 SOL
    });
    
    // Create a transaction and add the instruction
    const transaction = new Transaction().add(transferInstruction);
    
    // Set a recent blockhash
    transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
    transaction.feePayer = keypair.publicKey;
    
    // Sign and send the transaction
    const signature = await sendAndConfirmTransaction(connection, transaction, [keypair]);
    
    return signature;
  } catch (error) {
    console.error("Error sending Solana transaction:", error);
    throw error;
  }
}

