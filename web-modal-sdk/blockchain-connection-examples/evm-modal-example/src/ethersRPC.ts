/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IProvider } from "@web3auth/base";
import { ethers } from "ethers";

export default class EthereumRpc {
  private provider: IProvider;

  constructor(provider: IProvider) {
    this.provider = provider;
  }

  async getChainId(): Promise<any> {
    try {
      // For ethers v5
      // const ethersProvider = new ethers.providers.Web3Provider(this.provider);
      const ethersProvider = new ethers.BrowserProvider(this.provider);
      // Get the connected Chain's ID
      const networkDetails = await ethersProvider.getNetwork();
      return networkDetails.chainId.toString();
    } catch (error) {
      return error;
    }
  }

  async getAccounts(): Promise<any> {
    try {
      // For ethers v5
      // const ethersProvider = new ethers.providers.Web3Provider(this.provider);
      const ethersProvider = new ethers.BrowserProvider(this.provider);

      // For ethers v5
      // const signer = ethersProvider.getSigner();
      const signer = await ethersProvider.getSigner();

      // Get user's Ethereum public address
      const address = signer.getAddress();

      return await address;
    } catch (error) {
      return error;
    }
  }

  async getBalance(): Promise<string> {
    try {
      // For ethers v5
      // const ethersProvider = new ethers.providers.Web3Provider(this.provider);
      const ethersProvider = new ethers.BrowserProvider(this.provider);

      // For ethers v5
      // const signer = ethersProvider.getSigner();
      const signer = await ethersProvider.getSigner();

      // Get user's Ethereum public address
      const address = signer.getAddress();

      // Get user's balance in ether
      // For ethers v5
      // const balance = ethers.utils.formatEther(
      // await ethersProvider.getBalance(address) // Balance is in wei
      // );
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
      // For ethers v5
      // const ethersProvider = new ethers.providers.Web3Provider(this.provider);
      const ethersProvider = new ethers.BrowserProvider(this.provider);

      // For ethers v5
      // const signer = ethersProvider.getSigner();
      const signer = await ethersProvider.getSigner();

      const destination = "0x40e1c367Eca34250cAF1bc8330E9EddfD403fC56";

      // Convert 1 ether to wei
      // For ethers v5
      // const amount = ethers.utils.parseEther("0.001");
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
      // For ethers v5
      // const ethersProvider = new ethers.providers.Web3Provider(this.provider);
      const ethersProvider = new ethers.BrowserProvider(this.provider);

      // For ethers v5
      // const signer = ethersProvider.getSigner();
      const signer = await ethersProvider.getSigner();
      const originalMessage = "YOUR_MESSAGE";

      // Sign the message
      const signedMessage = await signer.signMessage(originalMessage);

      return signedMessage;
    } catch (error) {
      return error as string;
    }
  }

  async readContract() {
    try {
      const ethersProvider = new ethers.BrowserProvider(this.provider);

      const signer = await ethersProvider.getSigner();

      const contractABI = [
        { inputs: [{ internalType: "string", name: "initMessage", type: "string" }], stateMutability: "nonpayable", type: "constructor" },
        { inputs: [], name: "message", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" },
        {
          inputs: [{ internalType: "string", name: "newMessage", type: "string" }],
          name: "update",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ];
      const contractAddress = "0x04cA407965D60C2B39d892a1DFB1d1d9C30d0334";
      const contract = new ethers.Contract(contractAddress, JSON.parse(JSON.stringify(contractABI)), signer);

      // Read message from smart contract
      const message = await contract.message();
      return message;
    } catch (error) {
      return error as string;
    }
  }

  async writeContract() {
    try {
      const ethersProvider = new ethers.BrowserProvider(this.provider);

      const signer = await ethersProvider.getSigner();

      const contractABI = [
        { inputs: [{ internalType: "string", name: "initMessage", type: "string" }], stateMutability: "nonpayable", type: "constructor" },
        { inputs: [], name: "message", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" },
        {
          inputs: [{ internalType: "string", name: "newMessage", type: "string" }],
          name: "update",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ];
      const contractAddress = "0x04cA407965D60C2B39d892a1DFB1d1d9C30d0334";
      const contract = new ethers.Contract(contractAddress, JSON.parse(JSON.stringify(contractABI)), signer);
      // Generate random number between 1000 and 9000
      const number = Math.floor(Math.random() * 9000) + 1000;
      // Send transaction to smart contract to update message
      const tx = await contract.update(`Web3Auth is awesome ${number} times!`);
      // Wait for transaction to finish
      const receipt = await tx.wait();
      return receipt;
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
