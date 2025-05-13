import { IProvider } from "@web3auth/base";
import TronWeb from "tronweb";

const TRON_MAINNET_RPC = "https://api.trongrid.io";
const TRON_SHASTA_RPC = "https://api.shasta.trongrid.io";

// Use Shasta testnet for this example
const RPC_URL = TRON_SHASTA_RPC;

// Get private key from the provider
export async function getPrivateKey(provider: IProvider): Promise<string> {
  try {
    const privateKey = await provider.request({
      method: "private_key",
    });
    return privateKey as string;
  } catch (error) {
    console.error("Error getting private key:", error);
    throw error;
  }
}

// Get the Tron address from private key
export async function getTronAccount(provider: IProvider): Promise<string> {
  try {
    const privateKey = await getPrivateKey(provider);
    const tronWeb = new TronWeb({
      fullHost: RPC_URL,
      privateKey: privateKey,
    });
    
    const address = tronWeb.address.fromPrivateKey(privateKey);
    return address;
  } catch (error) {
    console.error("Error getting account:", error);
    throw error;
  }
}

// Get balance of the Tron account
export async function getTronBalance(provider: IProvider): Promise<string> {
  try {
    const privateKey = await getPrivateKey(provider);
    const tronWeb = new TronWeb({
      fullHost: RPC_URL,
      privateKey: privateKey,
    });
    
    const address = tronWeb.address.fromPrivateKey(privateKey);
    const balance = await tronWeb.trx.getBalance(address);
    
    // Convert sun to TRX (1 TRX = 1,000,000 sun)
    return tronWeb.fromSun(balance);
  } catch (error) {
    console.error("Error getting balance:", error);
    throw error;
  }
}

// Sign a message using the private key
export async function signMessage(provider: IProvider): Promise<string> {
  try {
    const privateKey = await getPrivateKey(provider);
    const tronWeb = new TronWeb({
      fullHost: RPC_URL,
      privateKey: privateKey,
    });
    
    const message = "Hello Web3Auth + TRON!";
    // Convert message to hex format as required by TronWeb
    const hexMessage = tronWeb.toHex(message);
    const signedMessage = await tronWeb.trx.sign(hexMessage);
    
    return signedMessage;
  } catch (error) {
    console.error("Error signing message:", error);
    throw error;
  }
}

// Send a transaction on the TRON network
export async function signAndSendTransaction(provider: IProvider): Promise<string> {
  try {
    const privateKey = await getPrivateKey(provider);
    const tronWeb = new TronWeb({
      fullHost: RPC_URL,
      privateKey: privateKey,
    });
    
    const address = tronWeb.address.fromPrivateKey(privateKey);
    
    // Create a simple TRX transfer transaction
    // This sends a tiny amount of TRX to your own address (useful for testing)
    const transaction = await tronWeb.transactionBuilder.sendTrx(
      address,  // To address (sending to ourselves)
      1000000,  // Amount in sun (1 TRX = 1,000,000 sun)
      address   // From address
    );
    
    // Sign the transaction
    const signedTransaction = await tronWeb.trx.sign(transaction, privateKey);
    
    // Broadcast the transaction
    const result = await tronWeb.trx.sendRawTransaction(signedTransaction);
    
    return JSON.stringify(result);
  } catch (error) {
    console.error("Error sending transaction:", error);
    throw error;
  }
}
