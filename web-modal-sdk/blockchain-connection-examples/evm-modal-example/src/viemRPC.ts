import { createWalletClient, createPublicClient, custom, formatEther, parseEther, http, parseAbiItem } from "viem";
import { mainnet, polygonMumbai, sepolia } from "viem/chains";
import { ENTRYPOINT_ADDRESS_V07, createSmartAccountClient, providerToSmartAccountSigner } from "permissionless";
import { signerToSafeSmartAccount } from "permissionless/accounts";
import { createPimlicoBundlerClient, createPimlicoPaymasterClient } from "permissionless/clients/pimlico";
import type { EIP1193Provider } from "viem";
import type { IProvider } from "@web3auth/base";

// const ERC20_PAYMASTER_ADDRESS = "0x000000000041F3aFe8892B48D88b6862efe0ec8d";
// const SPONSORSHIP_POLICY_ID = "sp_square_the_stranger";
const USDC_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
const API_KEY = "bff8c9e7-b1ad-4489-ab73-a61e30343138";
const PAYMASTER_URL = `https://api.pimlico.io/v2/sepolia/rpc?apikey=${API_KEY}`;
const BUNDLER_URL = `https://api.pimlico.io/v2/sepolia/rpc?apikey=${API_KEY}`;

export default class EthereumRpc {
  private provider: IProvider;

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

  async sendSmartAccountTransaction() {
    const publicClient = createPublicClient({
      transport: http("https://rpc.ankr.com/eth_sepolia"),
      chain: sepolia,
    });
    const smartAccountSigner = await providerToSmartAccountSigner(this.provider as EIP1193Provider);
    const smartAccount = await signerToSafeSmartAccount(publicClient, {
      signer: smartAccountSigner,
      entryPoint: ENTRYPOINT_ADDRESS_V07,
      safeVersion: "1.4.1",
    });
    const paymasterClient = createPimlicoPaymasterClient({
      transport: http(PAYMASTER_URL),
      entryPoint: ENTRYPOINT_ADDRESS_V07,
    });

    const bundlerClient = createPimlicoBundlerClient({
      transport: http(BUNDLER_URL),
      entryPoint: ENTRYPOINT_ADDRESS_V07,
    });

    const smartAccountClient = createSmartAccountClient({
      account: smartAccount,
      entryPoint: ENTRYPOINT_ADDRESS_V07,
      chain: sepolia,
      bundlerTransport: http(BUNDLER_URL),
      middleware: {
        gasPrice: async () => {
          return (await bundlerClient.getUserOperationGasPrice()).fast;
        },
        sponsorUserOperation: paymasterClient.sponsorUserOperation,
      },
    });

    if (!smartAccountClient) {
      throw new Error("Smart account client not initialized");
    }
    const txHash = await smartAccountClient.sendTransaction({
      to: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
      value: 0n,
      data: "0x1234",
    });

    console.log(`User operation included: https://sepolia.etherscan.io/tx/${txHash}`);
    return `User operation included: https://sepolia.etherscan.io/tx/${txHash}`;
  }

  async getSmartAccountAddress() {
    const publicClient = createPublicClient({
      transport: http("https://rpc.ankr.com/eth_sepolia"),
      chain: sepolia,
    });
    const smartAccountSigner = await providerToSmartAccountSigner(this.provider as EIP1193Provider);
    const smartAccount = await signerToSafeSmartAccount(publicClient, {
      signer: smartAccountSigner,
      entryPoint: ENTRYPOINT_ADDRESS_V07,
      safeVersion: "1.4.1",
    });
    return smartAccount.address;
  }

  async getSmartAccountBalance() {
    const publicClient = createPublicClient({
      transport: http("https://rpc.ankr.com/eth_sepolia"),
      chain: sepolia,
    });
    const smartAccountSigner = await providerToSmartAccountSigner(this.provider as EIP1193Provider);
    const smartAccount = await signerToSafeSmartAccount(publicClient, {
      signer: smartAccountSigner,
      entryPoint: ENTRYPOINT_ADDRESS_V07,
      safeVersion: "1.4.1",
    });

    const senderUsdcBalance = await publicClient.readContract({
      abi: [parseAbiItem("function balanceOf(address account) returns (uint256)")],
      address: USDC_ADDRESS,
      functionName: "balanceOf",
      args: [smartAccount.address],
    });

    if (senderUsdcBalance < 1_000_000n) {
      throw new Error(
        `Insufficient USDC balance for counterfactual wallet address ${smartAccount.address}: ${
          Number(senderUsdcBalance) / 1000000
        } USDC, required at least 1 USDC. Load up balance at https://faucet.circle.com/`
      );
    }

    console.log(`Smart account USDC balance: ${Number(senderUsdcBalance) / 1000000} USDC`);

    const balance = await publicClient.getBalance({ address: smartAccount.address as any });
    const ethBalance = formatEther(balance);
    return `Smart account USDC balance: ${Number(senderUsdcBalance) / 1000000} USDC and ETH balance: ${ethBalance}`;
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

  private toObject(data: any): any {
    return JSON.parse(JSON.stringify(data, (key, value) => (typeof value === "bigint" ? value.toString() : value)));
  }
}
