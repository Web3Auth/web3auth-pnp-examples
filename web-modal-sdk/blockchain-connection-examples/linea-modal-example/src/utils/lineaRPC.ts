/* eslint-disable no-console */
import axios from "axios";

const LINEA_RPC_URL = import.meta.env.VITE_LINEA_RPC_URL;

export const sendBundle = async (signedTransactions: any) => {
  try {
    const currentBlockResponse = await axios.post(LINEA_RPC_URL, {
      jsonrpc: "2.0",
      method: "eth_blockNumber",
      params: [],
      id: 1,
    });

    const currentBlock = parseInt(currentBlockResponse.data.result, 16);
    const targetBlock = `0x${(currentBlock + 10).toString(16)}`;

    console.log("Actual block:", currentBlock);
    console.log("Target block:", targetBlock);
    console.log("Transactions to send:", signedTransactions);

    const bundleParams = {
      txs: signedTransactions.transactions,
      blockNumber: targetBlock,
    };

    const response = await axios.post(LINEA_RPC_URL, {
      jsonrpc: "2.0",
      method: "eth_sendBundle",
      params: [bundleParams],
      id: 1,
    });

    return response.data;
  } catch (error) {
    console.error("Error when sending bundle:", error);
    throw error;
  }
};
