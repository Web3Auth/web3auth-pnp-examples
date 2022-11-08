import type { SafeEventEmitterProvider } from "@web3auth/base";
import { ethers } from "ethers";

import { ImmutableX, Config } from "@imtbl/core-sdk";
import { createStarkSigner } from "@imtbl/core-sdk";

export default class EthereumRpc {
  private provider: SafeEventEmitterProvider;

  constructor(provider: SafeEventEmitterProvider) {
    this.provider = provider;
  }

  config = Config.SANDBOX; // Or Config.PRODUCTION or Config.ROPSTEN
  client = new ImmutableX(this.config);

  async getChainId(): Promise<any> {
    try {
      const ethersProvider = new ethers.providers.Web3Provider(this.provider);
      // Get the connected Chain's ID
      const networkDetails = await ethersProvider.getNetwork();
      return networkDetails.chainId;
    } catch (error) {
      return error;
    }
  }

  async getAccounts(): Promise<any> {
    try {
      const ethersProvider = new ethers.providers.Web3Provider(this.provider);
      const ethSigner = ethersProvider.getSigner();

      // Get user's Ethereum public address
      const address = await ethSigner.getAddress();

      // Get user's Starkex public address

      const starkKey = await this.getPrivateKey();
      // const starkKey = await generateStarkPrivateKey();
      const starkSigner = createStarkSigner(starkKey);

      return {
        ethAddress: address,
        starkAddress: starkSigner.getAddress(),
      };
    } catch (error) {
      return error;
    }
  }

  async registerAccounts(): Promise<any> {
    try {
      const ethersProvider = new ethers.providers.Web3Provider(this.provider);
      const ethSigner = ethersProvider.getSigner();

      // Get user's Ethereum public address
      const address = await ethSigner.getAddress();

      // Get user's Starkex public address

      const starkKey = await this.getPrivateKey();
      const starkSigner = createStarkSigner(starkKey);

      console.log("eth address", address);
      console.log("starkAddress", starkSigner);

      const walletConnection = { ethSigner, starkSigner };
      const response = await this.client.registerOffchain(walletConnection);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getBalance(): Promise<string> {
    try {
      const ethersProvider = new ethers.providers.Web3Provider(this.provider);
      const signer = ethersProvider.getSigner();

      // Get user's Ethereum public address
      const address = await signer.getAddress();

      // Get user's balance in ether
      const balance = ethers.utils.formatEther(
        await ethersProvider.getBalance(address) // Balance is in wei
      );

      return balance;
    } catch (error) {
      return error as string;
    }
  }

  async sendTransaction(): Promise<any> {
    try {
      const ethersProvider = new ethers.providers.Web3Provider(this.provider);
      const ethSigner = ethersProvider.getSigner();

      const depositResponse = await this.client.deposit(ethSigner, {
        type: "ETH",
        amount: "1000000000000000", // Amount in wei
      });
      return depositResponse;
    } catch (error) {
      return error as string;
    }
  }

  async getPrivateKey(): Promise<any> {
    try {
      const privateKey = await this.provider.request({
        method: "eth_private_key",
      });

      return privateKey;
    } catch (error) {
      return error as string;
    }
  }
}
