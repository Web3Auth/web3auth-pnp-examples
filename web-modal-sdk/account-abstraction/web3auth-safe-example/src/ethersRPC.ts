// import type { SafeEventEmitterProvider } from "@web3auth/base";
import { ethers } from "ethers";

export default class EthereumRpc {
  private provider: any;

  constructor(provider: any) {
    this.provider = provider;
  }

  async getChainId(): Promise<any> {
    try {
      const ethersProvider = new ethers.BrowserProvider(this.provider);
      // Get the connected Chain's ID
      const networkDetails = await ethersProvider.getNetwork();
      return networkDetails.chainId;
    } catch (error) {
      return error;
    }
  }

  async getAccounts(): Promise<any> {
    try {
      const ethersProvider = new ethers.BrowserProvider(this.provider);
      const signer = await ethersProvider.getSigner();

      // Get user's Ethereum public address
      const address = await signer.getAddress();

      return address;
    } catch (error) {
      return error;
    }
  }

  async getBalance(): Promise<string> {
    try {
      const ethersProvider = new ethers.BrowserProvider(this.provider);
      const signer = await ethersProvider.getSigner();

      // Get user's Ethereum public address
      const address = await signer.getAddress();

      // Get user's balance in ether
      const balance = ethers.formatEther(
        await ethersProvider.getBalance(address) // Balance is in wei
      );

      return balance;
    } catch (error) {
      return error as string;
    }
  }

  async sendTransaction(): Promise<any> {
    try {
      const ethersProvider = new ethers.BrowserProvider(this.provider);
      const signer = await ethersProvider.getSigner();

      const destination = "0x40e1c367Eca34250cAF1bc8330E9EddfD403fC56";

      // Convert 1 ether to wei
      const amount = ethers.parseEther("0.001");

      // Submit transaction to the blockchain
      const tx = await signer.sendTransaction({
        to: destination,
        value: amount,
        maxPriorityFeePerGas: "5000000000", // Max priority fee per gas
        maxFeePerGas: "6000000000000", // Max fee per gas
      });

      // Wait for transaction to be mined
      const receipt = await tx.wait();

      return receipt;
    } catch (error) {
      return error as string;
    }
  }

  async signMessage() {
    try {
      const ethersProvider = new ethers.BrowserProvider(this.provider);
      const signer = await ethersProvider.getSigner();

      const originalMessage = "YOUR_MESSAGE";

      // Sign the message
      const signedMessage = await signer.signMessage(originalMessage);

      return signedMessage;
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
