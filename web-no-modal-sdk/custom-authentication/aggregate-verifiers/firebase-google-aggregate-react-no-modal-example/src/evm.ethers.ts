import type { IProvider } from "@web3auth/base";
import { ethers } from "ethers";

export default class EthereumRpc {
  private provider: IProvider;

  constructor(provider: IProvider) {
    this.provider = provider;
  }

  async getAccounts(): Promise<string> {
    try {
      // For ethers v5
      // const provider = new ethers.providers.Web3Provider(this.provider as any);
      const provider = new ethers.BrowserProvider(this.provider as any);
      // For ethers v5
      // const signer = provider.getSigner();
      const signer = await provider.getSigner();
      const address = signer.getAddress();
      return address;
    } catch (error: unknown) {
      return error as string;
    }
  }

  async getBalance(): Promise<string> {
    try {
      // For ethers v5
      // const provider = new ethers.providers.Web3Provider(this.provider as any);
      const provider = new ethers.BrowserProvider(this.provider as any);
      // For ethers v5
      // const signer = provider.getSigner();
      const signer = await provider.getSigner();
      const address = signer.getAddress();

      // Get user's balance in ether
      // For ethers v5
      // const balance = ethers.utils.formatEther(
      // await provider.getBalance(address) // Balance is in wei
      // );
      const balance = ethers.formatEther(
        await provider.getBalance(address) // Balance is in wei
      );
      return balance;
    } catch (error) {
      return error as string;
    }
  }

  async signMessage(): Promise<string> {
    try {
      // For ethers v5
      // const provider = new ethers.providers.Web3Provider(this.provider as any);
      const provider = new ethers.BrowserProvider(this.provider as any);
      // For ethers v5
      // const signer = provider.getSigner();
      const signer = await provider.getSigner();

      const originalMessage = "YOUR_MESSAGE";

      const signedMessage = await signer.signMessage(originalMessage);
      return signedMessage;
    } catch (error) {
      return error as string;
    }
  }

  async signAndSendTransaction(): Promise<any> {
    try {
      // For ethers v5
      // const provider = new ethers.providers.Web3Provider(this.provider as any);
      const provider = new ethers.BrowserProvider(this.provider as any);
      // For ethers v5
      // const signer = provider.getSigner();
      const signer = await provider.getSigner();
      const address = signer.getAddress();

      // Convert 1 ether to wei
      // For ethers v5
      // const amount = ethers.utils.parseEther("0.0001");
      const amount = ethers.parseEther("0.0001");

      const tx = await signer.sendTransaction({
        to: address,
        value: amount,
      });
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      return error as undefined;
    }
  }
}
