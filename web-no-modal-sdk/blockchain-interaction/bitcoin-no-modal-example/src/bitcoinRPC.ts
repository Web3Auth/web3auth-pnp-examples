import ecc from "@bitcoinerlab/secp256k1";
import ECPairFactory from "ecpair";
import { Psbt, networks, payments, crypto, initEccLib } from "bitcoinjs-lib";
import axios from "axios";
import { IProvider } from "@web3auth/base";

// Initialize ECPair and ecc library
const ECPair = ECPairFactory(ecc);
initEccLib(ecc);

const network = networks.testnet;

// Function to get the private key from the provider
export const getBitcoinPrivateKey = async (provider: IProvider): Promise<string> => {
  if (!provider) throw new Error("Provider is required.");
  try {
    // Note: SFA uses "eth_private_key", NoModal might use a different method
    // or require configuration with a specific provider like BitcoinPrivateKeyProvider.
    // Assuming eth_private_key for now based on original code, may need adjustment.
    const privateKey = await provider.request({ method: "eth_private_key" });
    if (!privateKey) throw new Error("Could not get private key from provider.");
    return privateKey as string;
  } catch (error) {
    console.error("Error getting private key:", error);
    throw error;
  }
};

// Helper function to fetch UTXOs
const fetchUtxos = async (address: string) => {
  try {
    const response = await axios.get(`https://blockstream.info/testnet/api/address/${address}/utxo`);
    // Filter for confirmed UTXOs only
    return response.data.filter((utxo: { status: { confirmed: boolean } }) => utxo.status.confirmed);
  } catch (error) {
    console.error("Error fetching UTXOs:", error);
    return []; // Return empty array on error
  }
};

// Derives address and keys from private key
export const getBitcoinAddressAndKeys = (privateKey: string) => {
  if (!privateKey) throw new Error("Private key is required.");
  try {
    const keyPair = ECPair.fromPrivateKey(Buffer.from(privateKey, "hex"));
    const bufPubKey = keyPair.publicKey;
    const xOnlyPubKey = bufPubKey.subarray(1, 33);
    const tweakedChildNode = keyPair.tweak(crypto.taggedHash("TapTweak", xOnlyPubKey));
    const { address, output } = payments.p2tr({
      pubkey: Buffer.from(tweakedChildNode.publicKey.subarray(1, 33)),
      network,
    });
    if (!address || !output) throw new Error("Could not derive Taproot address or output.");
    return { address, output, tweakedChildNode, xOnlyPubKey };
  } catch (error) {
      console.error("Error deriving Bitcoin address and keys:", error);
      throw error;
  }
};

// Gets the balance for a given address
export const getBitcoinBalance = async (address: string): Promise<number> => {
  if (!address) throw new Error("Address is required.");
  try {
    const utxos = await fetchUtxos(address);
    const balance = utxos.reduce((acc: number, utxo: { value: number }) => acc + utxo.value, 0);
    console.log(`Balance for ${address}: `, balance);
    return balance;
  } catch (error) {
    console.error("Error fetching balance:", error);
    throw error; // Rethrow error after logging
  }
};


// Sends a transaction from the derived address
export const sendTaprootTransaction = async (privateKey: string, destinationAddress: string): Promise<string> => {
   if (!privateKey) throw new Error("Private key is required.");
   if (!destinationAddress) throw new Error("Destination address is required.");

   try {
    const { address, output, tweakedChildNode, xOnlyPubKey } = getBitcoinAddressAndKeys(privateKey);
    if (!address || !output || !tweakedChildNode || !xOnlyPubKey) {
        throw new Error("Could not get necessary keys/address from private key.");
    }

    const utxos = await fetchUtxos(address);
    console.log(`UTXOs for ${address}: `, utxos);
    if (utxos.length === 0) {
      throw new Error("No confirmed UTXOs found. Please fund the address first.");
    }

    // Simple UTXO selection: use the first one
    // TODO: Implement better UTXO selection for production (e.g., largest, coin selection algorithm)
    const utxo = utxos[0];
    const availableAmount = utxo.value;

    // Fetch dynamic fee rate (satoshis per byte)
    const feeResponse = await axios.get("https://blockstream.info/testnet/api/fee-estimates");
    // Use a reasonable fee rate (e.g., aiming for confirmation in ~6 blocks)
    const feeRate = feeResponse.data["6"] || 2; // Default to 2 sat/byte if estimate not available
    console.log(`Using fee rate: ${feeRate} sat/byte`);

    // Estimate transaction size (this is approximate)
    // P2TR input: ~57.5 vbytes
    // P2TR output: ~43 vbytes
    const estimatedTxSize = 57.5 + 43; // Single input, single output
    const estimatedFee = Math.ceil(estimatedTxSize * feeRate);
    console.log(`Estimated fee: ${estimatedFee} sats for size ${estimatedTxSize} vbytes`);

    if (availableAmount <= estimatedFee) {
      throw new Error(`Insufficient funds: Available ${availableAmount} sats, Estimated Fee ${estimatedFee} sats`);
    }

    const sendAmount = availableAmount - estimatedFee;
    console.log(`Sending amount: ${sendAmount} sats`);

    if (sendAmount <= 0) { // Dust check or just ensure positive amount
        throw new Error("Calculated send amount is zero or negative after fee deduction.")
    }

    const psbt = new Psbt({ network })
      .addInput({
        hash: utxo.txid,
        index: utxo.vout,
        witnessUtxo: { value: utxo.value, script: output },
        tapInternalKey: xOnlyPubKey,
      })
      .addOutput({ value: sendAmount, address: destinationAddress });

    // Sign the input
    psbt.signInput(0, tweakedChildNode);

    // Finalize the transaction
    psbt.finalizeAllInputs();

    // Extract the transaction hex
    const txHex = psbt.extractTransaction().toHex();
    console.log("Transaction Hex:", txHex);

    // Broadcast the transaction
    const broadcastResponse = await axios.post(`https://blockstream.info/testnet/api/tx`, txHex);
    console.log("Transaction broadcast successfully:", broadcastResponse.data);
    return broadcastResponse.data; // Return the transaction ID (txid)

  } catch (error) {
      console.error("Error sending Taproot transaction:", error);
      // If error is from Axios, it might have response data
      if (axios.isAxiosError(error) && error.response) {
          console.error("Broadcast error details:", error.response.data);
          throw new Error(`Broadcast failed: ${error.response.data}`);
      }
      throw error; // Rethrow other errors
  }
}; 