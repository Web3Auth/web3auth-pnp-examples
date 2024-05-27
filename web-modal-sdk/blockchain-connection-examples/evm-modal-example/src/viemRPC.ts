import { createWalletClient, createPublicClient, custom, formatEther, parseEther, http, encodeFunctionData, parseAbiItem } from "viem";
import { mainnet, polygonMumbai, sepolia } from "viem/chains";
import { ENTRYPOINT_ADDRESS_V06, ENTRYPOINT_ADDRESS_V07, createSmartAccountClient, providerToSmartAccountSigner } from "permissionless";
import { signerToSimpleSmartAccount, signerToSafeSmartAccount } from "permissionless/accounts";
import type { EIP1193Provider } from "viem";
import { createPimlicoBundlerClient, createPimlicoPaymasterClient } from "permissionless/clients/pimlico";

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IProvider } from "@web3auth/base";

const erc20PaymasterAddress = "0x000000000041F3aFe8892B48D88b6862efe0ec8d";
const usdcAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
const apiKey = "bff8c9e7-b1ad-4489-ab73-a61e30343138";
const paymasterUrl = `https://api.pimlico.io/v2/${sepolia}/rpc?apikey=${apiKey}`;
const bundlerUrl = `https://api.pimlico.io/v2/${sepolia}/rpc?apikey=${apiKey}`;

export default class EthereumRpc {
  private provider: IProvider;
  private publicClient: any;
  private smartAccountSigner: any;
  private smartAccount: any;
  private paymasterClient: any;
  private bundlerClient: any;
  private smartAccountClient: any;
  // testing erc20 paymaster
  private sAccount: any;

  private contractABI = [
    {
      inputs: [],
      name: "retrieve",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "num",
          type: "uint256",
        },
      ],
      name: "store",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  constructor(provider: IProvider) {
    this.provider = provider;
  }

  getViewChain() {
    const chainId = this.provider.chainId;
    switch (chainId) {
      case "1":
        return mainnet;
      case "0x13881":
        return polygonMumbai;
      case "0xaa36a7":
        return sepolia;
      default:
        return mainnet;
    }
  }

  async initializeSmartAccount() {
    try {
      this.smartAccountSigner = await providerToSmartAccountSigner(this.provider as EIP1193Provider);

      this.publicClient = createPublicClient({
        transport: http("https://rpc.ankr.com/eth_sepolia"),
        chain: sepolia,
      });

      this.smartAccount = await signerToSimpleSmartAccount(this.publicClient, {
        signer: this.smartAccountSigner,
        factoryAddress: "0x9406Cc6185a346906296840746125a0E44976454",
        entryPoint: ENTRYPOINT_ADDRESS_V06, // "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", // Replace with actual entry point address
      });

      console.log("Smart account initialized:", this.smartAccount);

      this.paymasterClient = createPimlicoPaymasterClient({
        transport: http(paymasterUrl),
        entryPoint: ENTRYPOINT_ADDRESS_V07,
      });
      console.log("Paymaster client initialized:", this.paymasterClient);

      this.bundlerClient = createPimlicoBundlerClient({
        transport: http(bundlerUrl),
        entryPoint: ENTRYPOINT_ADDRESS_V07,
      });
      console.log("Bundler client initialized:", this.bundlerClient);

      this.smartAccountClient = createSmartAccountClient({
        account: this.smartAccount,
        entryPoint: ENTRYPOINT_ADDRESS_V07,
        chain: sepolia,
        bundlerTransport: http(bundlerUrl),
        middleware: {
          gasPrice: async () => {
            return (await this.bundlerClient.getUserOperationGasPrice()).fast;
          },
          sponsorUserOperation: this.bundlerClient.sponsorUserOperation,
        },
      });
      console.log("Smart account client initialized:", this.smartAccountClient);

      this.sAccount = await signerToSafeSmartAccount(this.publicClient, {
        signer: this.smartAccountSigner,
        entryPoint: ENTRYPOINT_ADDRESS_V07, // global entrypoint
        safeVersion: "1.4.1",
        setupTransactions: [
          {
            to: usdcAddress,
            value: 0n,
            data: encodeFunctionData({
              abi: [parseAbiItem("function approve(address spender, uint256 amount)")],
              args: [erc20PaymasterAddress, 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn],
            }),
          },
        ],
      });
      console.log("Safe smart account initialized:", this.sAccount);
      await this.getSmartAccountBalance();
    } catch (error) {
      console.error("Failed to initialize smart account:", error);
    }
  }

  async getSmartAccountBalance() {
    const senderUsdcBalance = await this.publicClient.readContract({
      abi: [parseAbiItem("function balanceOf(address account) returns (uint256)")],
      address: usdcAddress,
      functionName: "balanceOf",
      args: [this.sAccount.address],
    });

    if (senderUsdcBalance < 1_000_000n) {
      throw new Error(
        `insufficient USDC balance for counterfactual wallet address ${this.sAccount.address}: ${
          Number(senderUsdcBalance) / 1000000
        } USDC, required at least 1 USDC. Load up balance at https://faucet.circle.com/`
      );
    }

    console.log(`Smart account USDC balance: ${Number(senderUsdcBalance) / 1000000} USDC`);
    return Number(senderUsdcBalance) / 1000000;
  }

  async getChainId(): Promise<string | Error> {
    try {
      const walletClient = createWalletClient({
        transport: custom(this.provider),
      });
      const chainId = await walletClient.getChainId();
      return chainId.toString();
    } catch (error) {
      return error as Error;
    }
  }

  async getAddresses(): Promise<string[] | Error> {
    try {
      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider),
      });
      return await walletClient.getAddresses();
    } catch (error) {
      return error as Error;
    }
  }

  async getAccounts(): Promise<string[] | Error> {
    return await this.getAddresses();
  }

  async getPrivateKey(): Promise<string | Error> {
    try {
      const privateKey = await this.provider.request({
        method: "eth_private_key",
      });
      return privateKey as string;
    } catch (error) {
      return error as Error;
    }
  }

  async getBalance(): Promise<string | Error> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider),
      });
      const address = await this.getAccounts();
      if (Array.isArray(address)) {
        const balance = await publicClient.getBalance({ address: address[0] as any });
        return formatEther(balance);
      } else {
        return "Unable to retrieve address";
      }
    } catch (error) {
      return error as Error;
    }
  }

  async sendTransaction(): Promise<any | Error> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider),
      });
      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider),
      });

      const destination = "0x40e1c367Eca34250cAF1bc8330E9EddfD403fC56";
      const amount = parseEther("0.0001");
      const address = await this.getAccounts();

      if (Array.isArray(address)) {
        const hash = await walletClient.sendTransaction({
          account: address[0] as any,
          to: destination,
          value: amount,
        });
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        return this.toObject(receipt);
      } else {
        return "Unable to retrieve address";
      }
    } catch (error) {
      return error as Error;
    }
  }

  async signMessage(): Promise<string | Error> {
    try {
      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider),
      });

      const address = await this.getAccounts();
      if (Array.isArray(address)) {
        const originalMessage = "YOUR_MESSAGE";
        const hash = await walletClient.signMessage({
          account: address[0] as any,
          message: originalMessage,
        });
        return hash.toString();
      } else {
        return "Unable to retrieve address";
      }
    } catch (error) {
      return error as Error;
    }
  }

  async readContract(): Promise<any | Error> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider),
      });

      const number = await publicClient.readContract({
        address: "0x9554a5CC8F600F265A89511e5802945f2e8A5F5D",
        abi: this.contractABI,
        functionName: "retrieve",
      });

      return this.toObject(number);
    } catch (error) {
      return error as Error;
    }
  }

  async writeContract(): Promise<any | Error> {
    try {
      const publicClient = createPublicClient({
        chain: this.getViewChain(),
        transport: custom(this.provider),
      });

      const walletClient = createWalletClient({
        chain: this.getViewChain(),
        transport: custom(this.provider),
      });

      const address = await this.getAccounts();
      if (Array.isArray(address)) {
        const randomNumber = Math.floor(Math.random() * 9000) + 1000;
        const hash = await walletClient.writeContract({
          account: address[0] as any,
          address: "0x9554a5CC8F600F265A89511e5802945f2e8A5F5D",
          abi: this.contractABI,
          functionName: "store",
          args: [randomNumber],
        });
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        return this.toObject(receipt);
      } else {
        return "Unable to retrieve address";
      }
    } catch (error) {
      return error as Error;
    }
  }

  toObject(data: any): any {
    return JSON.parse(JSON.stringify(data, (key, value) => (typeof value === "bigint" ? value.toString() : value)));
  }
}
