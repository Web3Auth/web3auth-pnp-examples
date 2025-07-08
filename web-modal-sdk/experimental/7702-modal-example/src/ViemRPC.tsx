import {
  createWalletClient,
  createPublicClient,
  custom,
  formatEther,
  http,
  parseSignature,
  Hex,
  parseEther,
  serializeTransaction,
  encodeFunctionData,
  keccak256,
  TransactionSerializable,
} from "viem";
import type { IProvider } from "@web3auth/base";
import { odysseyTestnet } from "viem/chains";
import { hashAuthorization, prepareAuthorization, SignAuthorizationReturnType, verifyAuthorization } from "viem/experimental";

const chain = odysseyTestnet;
// Batch Delegation Contract Address on Odyssey Testnet
const contractAddress = "0x654F42b74885EE6803F403f077bc0409f1066c58";

// Batch Delegation Contract ABI
const abi = [
  {
    type: "function",
    name: "execute",
    inputs: [
      {
        name: "calls",
        type: "tuple[]",
        components: [
          {
            name: "data",
            type: "bytes",
          },
          {
            name: "to",
            type: "address",
          },
          {
            name: "value",
            type: "uint256",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
] as const;

const getAccounts = async (provider: IProvider): Promise<any> => {
  try {
    const walletClient = createWalletClient({
      chain: chain,
      transport: custom(provider),
    });

    const addresses = await walletClient.getAddresses();

    return addresses;
  } catch (error) {
    return error;
  }
};

const getBalance = async (provider: IProvider): Promise<string> => {
  try {
    const publicClient = createPublicClient({
      chain: chain,
      transport: custom(provider),
    });

    const addresses = await getAccounts(provider);

    const balance = await publicClient.getBalance({ address: addresses[0] });
    return formatEther(balance);
  } catch (error) {
    return error as string;
  }
};

const signAuthorization = async (provider: IProvider): Promise<any> => {
  try {
    const publicClient = createPublicClient({
      chain: chain,
      transport: http(),
    });

    const addresses = await getAccounts(provider);

    const authorization = await prepareAuthorization(publicClient, {
      account: addresses[0],
      contractAddress,
    });

    const authorizationHash = hashAuthorization(authorization);

    const signature: Hex = (await provider.request({
      method: "eth_sign",
      params: [addresses[0], authorizationHash],
    })) as Hex;

    const parsedSignature = parseSignature(signature);

    const signedAuthorization: SignAuthorizationReturnType = {
      ...authorization,
      r: parsedSignature.r,
      s: parsedSignature.s,
      yParity: parsedSignature.yParity,
    };

    const verified = await verifyAuthorization({
      authorization: signedAuthorization,
      address: addresses[0],
      signature: signature,
    });

    console.log(verified);

    return {
      signature,
      verified,
    };
  } catch (error) {
    return error;
  }
};

const submitAuthorization = async (provider: IProvider): Promise<any> => {
  try {
    const publicClient = createPublicClient({
      chain: chain,
      transport: http(),
    });

    const addresses = await getAccounts(provider);

    const authorization = await prepareAuthorization(publicClient, {
      account: addresses[0],
      contractAddress,
    });

    const authorizationHash = hashAuthorization(authorization);

    const signature: Hex = (await provider.request({
      method: "eth_sign",
      params: [addresses[0], authorizationHash],
    })) as Hex;

    const parsedSignature = parseSignature(signature);
    console.log(parsedSignature);

    const signedAuthorization: SignAuthorizationReturnType = {
      ...authorization,
      r: parsedSignature.r,
      s: parsedSignature.s,
      yParity: parsedSignature.yParity,
    };

    const estimateFeesPerGas = await publicClient.estimateFeesPerGas();
    const nonce = await publicClient.getTransactionCount({ address: addresses[0] });

    const transactionSerializable: TransactionSerializable = {
      authorizationList: [signedAuthorization],
      chainId: chain.id,
      nonce: nonce,
      to: "0xd2135CfB216b74109775236E36d4b433F1DF507B",
      data: "0x",
      value: parseEther("0.0000001"),
      gas: 100000n,
      maxFeePerGas: estimateFeesPerGas.maxFeePerGas,
      maxPriorityFeePerGas: estimateFeesPerGas.maxPriorityFeePerGas,
    };

    const transactionSignature: Hex = (await provider.request({
      method: "eth_sign",
      params: [addresses[0], keccak256(serializeTransaction(transactionSerializable))],
    })) as Hex;

    const processedSignature = parseSignature(transactionSignature);

    const signedSerializedTransaction = serializeTransaction(transactionSerializable, processedSignature);

    const hash = await publicClient.sendRawTransaction({
      serializedTransaction: signedSerializedTransaction,
    });

    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
    });

    return {
      hash,
      blockNumber: receipt.blockNumber.toString(),
      status: receipt.status,
    };
  } catch (error) {
    return error;
  }
};

const batchTransaction = async (provider: IProvider): Promise<any> => {
  try {
    const publicClient = createPublicClient({
      chain: chain,
      transport: http(),
    });

    const addresses = await getAccounts(provider);

    const encodedFunctionCall = encodeFunctionData({
      abi,
      functionName: "execute",
      args: [
        [
          {
            data: "0x",
            to: "0xcb98643b8786950F0461f3B0edf99D88F274574D",
            value: parseEther("0.0000001"),
          },
          {
            data: "0x",
            to: "0xd2135CfB216b74109775236E36d4b433F1DF507B",
            value: parseEther("0.0000001"),
          },
        ],
      ],
    });

    const estimateFeesPerGas = await publicClient.estimateFeesPerGas();
    const nonce = await publicClient.getTransactionCount({ address: addresses[0] });

    const transactionSerializable: TransactionSerializable = {
      chainId: chain.id,
      nonce: nonce,
      to: addresses[0],
      data: encodedFunctionCall,
      gas: 100000n,
      maxFeePerGas: estimateFeesPerGas.maxFeePerGas,
      maxPriorityFeePerGas: estimateFeesPerGas.maxPriorityFeePerGas,
    };

    const transactionSignature: Hex = (await provider.request({
      method: "eth_sign",
      params: [addresses[0], keccak256(serializeTransaction(transactionSerializable))],
    })) as Hex;

    console.log(transactionSignature);

    const processedSignature = parseSignature(transactionSignature);

    const signedSerializedTransaction = serializeTransaction(transactionSerializable, processedSignature);

    const hash = await publicClient.sendRawTransaction({
      serializedTransaction: signedSerializedTransaction,
    });

    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
    });

    return {
      hash,
      blockNumber: receipt.blockNumber.toString(),
      status: receipt.status,
    };
  } catch (error) {
    return error;
  }
};

export default { getAccounts, getBalance, signAuthorization, batchTransaction, submitAuthorization };
