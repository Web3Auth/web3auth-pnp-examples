import { createWalletClient, createPublicClient, custom, formatEther, parseEther, http, encodeFunctionData, parseAbiItem } from "viem";
import { mainnet, polygonMumbai, sepolia } from "viem/chains";
import { ENTRYPOINT_ADDRESS_V07, createSmartAccountClient, providerToSmartAccountSigner } from "permissionless";
import { signerToSafeSmartAccount } from "permissionless/accounts";
import { createPimlicoBundlerClient, createPimlicoPaymasterClient } from "permissionless/clients/pimlico";
import type { EIP1193Provider } from "viem";
import type { IProvider } from "@web3auth/base";

const ERC20_PAYMASTER_ADDRESS = "0x000000000041F3aFe8892B48D88b6862efe0ec8d";
const USDC_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
const API_KEY = "bff8c9e7-b1ad-4489-ab73-a61e30343138";
const PAYMASTER_URL = `https://api.pimlico.io/v2/${sepolia}/rpc?apikey=${API_KEY}`;
const BUNDLER_URL = `https://api.pimlico.io/v2/${sepolia}/rpc?apikey=${API_KEY}`;

const CONTRACT_ABI = [
  {
    inputs: [],
    name: "retrieve",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "num", type: "uint256" }],
    name: "store",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export default class EthereumRpc {
  private provider: IProvider;
  private publicClient: any;
  private smartAccountSigner: any;
  private smartAccount: any;
  private paymasterClient: any;
  private bundlerClient: any;
  private smartAccountClient: any;

  constructor(provider: IProvider) {
    this.provider = provider;
  }

  private getViewChain() {
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

      this.paymasterClient = createPimlicoPaymasterClient({
        transport: http(PAYMASTER_URL),
        entryPoint: ENTRYPOINT_ADDRESS_V07,
      });
      console.log("Paymaster client initialized:", this.paymasterClient);

      this.bundlerClient = createPimlicoBundlerClient({
        transport: http(BUNDLER_URL),
        entryPoint: ENTRYPOINT_ADDRESS_V07,
      });
      console.log("Bundler client initialized:", this.bundlerClient);

      this.smartAccount = await signerToSafeSmartAccount(this.publicClient, {
        signer: this.smartAccountSigner,
        entryPoint: ENTRYPOINT_ADDRESS_V07,
        safeVersion: "1.4.1",
        setupTransactions: [
          {
            to: USDC_ADDRESS,
            value: 0n,
            data: encodeFunctionData({
              abi: [parseAbiItem("function approve(address spender, uint256 amount)")],
              args: [ERC20_PAYMASTER_ADDRESS, 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn],
            }),
          },
        ],
      });
      console.log("Safe smart account initialized:", this.smartAccount);

      this.smartAccountClient = createSmartAccountClient({
        account: this.smartAccount,
        entryPoint: ENTRYPOINT_ADDRESS_V07,
        chain: sepolia,
        bundlerTransport: http(BUNDLER_URL),
        middleware: {
          gasPrice: async () => (await this.bundlerClient.getUserOperationGasPrice()).fast,
          sponsorUserOperation: async (args) => {
            const gasEstimates = await this.bundlerClient.estimateUserOperationGas({
              userOperation: {
                ...args.userOperation,
                paymaster: ERC20_PAYMASTER_ADDRESS,
              },
            });

            return {
              ...gasEstimates,
              paymaster: ERC20_PAYMASTER_ADDRESS,
            };
          },
        },
      });
      console.log("Smart account client initialized:", this.smartAccountClient);

      await this.getSmartAccountBalance();
      await this.sendSmartAccountTransaction();
    } catch (error) {
      console.error("Failed to initialize smart account:", error);
    }
  }

  async getSmartAccountBalance() {
    try {
      const senderUsdcBalance = await this.publicClient.readContract({
        abi: [parseAbiItem("function balanceOf(address account) returns (uint256)")],
        address: USDC_ADDRESS,
        functionName: "balanceOf",
        args: [this.smartAccount.address],
      });

      if (senderUsdcBalance < 1_000_000n) {
        throw new Error(
          `Insufficient USDC balance for counterfactual wallet address ${this.smartAccount.address}: ${
            Number(senderUsdcBalance) / 1000000
          } USDC, required at least 1 USDC. Load up balance at https://faucet.circle.com/`
        );
      }

      console.log(`Smart account USDC balance: ${Number(senderUsdcBalance) / 1000000} USDC`);
      return Number(senderUsdcBalance) / 1000000;
    } catch (error) {
      console.error("Failed to get smart account balance:", error);
      throw error;
    }
  }

  async sendSmartAccountTransaction() {
    try {
      const destination = "0xeaA8Af602b2eDE45922818AE5f9f7FdE50cFa1A8";
      const amount = 0n;
      const hash = await this.smartAccountClient.sendTransaction({
        to: destination,
        value: amount,
      });
      console.log("Smart account transaction hash:", hash);
      return hash;
    } catch (error) {
      console.error("Failed to send smart account transaction:", error);
      throw error;
    }
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
    return this.getAddresses();
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
      const addresses = await this.getAccounts();
      if (Array.isArray(addresses)) {
        const balance = await publicClient.getBalance({ address: addresses[0] as any });
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
      const addresses = await this.getAccounts();

      if (Array.isArray(addresses)) {
        const hash = await walletClient.sendTransaction({
          account: addresses[0] as any,
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

      const addresses = await this.getAccounts();
      if (Array.isArray(addresses)) {
        const originalMessage = "YOUR_MESSAGE";
        const hash = await walletClient.signMessage({
          account: addresses[0] as any,
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

      const result = await publicClient.readContract({
        address: "0x9554a5CC8F600F265A89511e5802945f2e8A5F5D",
        abi: CONTRACT_ABI,
        functionName: "retrieve",
      });

      return this.toObject(result);
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

      const addresses = await this.getAccounts();
      if (Array.isArray(addresses)) {
        const randomNumber = Math.floor(Math.random() * 9000) + 1000;
        const hash = await walletClient.writeContract({
          account: addresses[0] as any,
          address: "0x9554a5CC8F600F265A89511e5802945f2e8A5F5D",
          abi: CONTRACT_ABI,
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

  private toObject(data: any): any {
    return JSON.parse(JSON.stringify(data, (key, value) => (typeof value === "bigint" ? value.toString() : value)));
  }
}
