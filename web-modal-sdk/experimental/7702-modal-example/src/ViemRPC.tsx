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
  TransactionSerializable,
  keccak256,
  SerializeTransactionFn,
  toHex,
} from "viem";
import type { IProvider } from "@web3auth/base";
import { odysseyTestnet } from "viem/chains";
import { eip7702Actions, hashAuthorization, recoverAuthorizationAddress, SignAuthorizationReturnType, verifyAuthorization } from "viem/experimental";

const chain = odysseyTestnet;
// Batch Delegation Contract Address on Odyssey Testnet
const contractAddress = "0xC8527016Bd79e7AF8402B5EbCA93beF31FcBd90A";

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

    const nonce = await publicClient.getTransactionCount({
      address: addresses[0],
    });

    const authorizationHash = hashAuthorization({
      contractAddress,
      chainId: chain.id,
      nonce,
    });

    const signature: Hex = (await provider.request({
      method: "eth_sign",
      params: [addresses[0], authorizationHash],
    })) as Hex;

    const parsedSignature = parseSignature(signature);

    const signedAuthorization: SignAuthorizationReturnType = {
      contractAddress,
      chainId: chain.id,
      nonce,
      r: parsedSignature.r,
      s: parsedSignature.s,
      v: parsedSignature.v!,
    };

    const verified = await verifyAuthorization({
      authorization: signedAuthorization,
      address: addresses[0],
      signature: signature,
    });

    console.log(verified);

    return signature;
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

    const nonce = await publicClient.getTransactionCount({
      address: addresses[0],
    });

    const authorizationHash = hashAuthorization({
      contractAddress,
      chainId: chain.id,
      nonce: nonce + 1,
    });

    const signature: Hex = (await provider.request({
      method: "eth_sign",
      params: [addresses[0], authorizationHash],
    })) as Hex;

    const parsedSignature = parseSignature(signature);
    console.log(parsedSignature);

    const signedAuthorization: SignAuthorizationReturnType = {
      contractAddress,
      chainId: chain.id,
      nonce: nonce + 1,
      r: parsedSignature.r,
      s: parsedSignature.s,
      // v: parsedSignature.v,
      yParity: parsedSignature.yParity,
    };

    const encodedFunctionCall = encodeFunctionData({
      abi,
      functionName: "execute",
      args: [
        [
          {
            data: "0x",
            to: "0xcb98643b8786950F0461f3B0edf99D88F274574D",
            value: parseEther("0.001"),
          },
          {
            data: "0x",
            to: "0xd2135CfB216b74109775236E36d4b433F1DF507B",
            value: parseEther("0.002"),
          },
        ],
      ],
    });

    // const estimatedGas = await publicClient.estimateGas({
    //   to: to,
    // const estimatedGas = await publicClient.estimateGas({
    //   to: to,
    //   data: encodedFunctionCall,
    // });

    const estimateFeesPerGas = await publicClient.estimateFeesPerGas();

    const transactionSerializable = {
      authorizationList: [signedAuthorization],
      chainId: chain.id,
      nonce: nonce,
      to: addresses[0],
      data: encodedFunctionCall,
      gas: 1000000n,
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

    console.log(signedSerializedTransaction);

    const hash = await publicClient.sendRawTransaction({
      serializedTransaction: signedSerializedTransaction,
    });

    console.log(hash);

    return hash;
  } catch (error) {
    return error;
  }
};

export default { getAccounts, getBalance, signAuthorization, batchTransaction };
