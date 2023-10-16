import type { IProvider } from "@web3auth/base";
import Web3 from "web3";

export default class EthereumRpc {
  private provider: IProvider;

  constructor(provider: IProvider) {
    this.provider = provider;
  }

  async getChainId(): Promise<string> {
    try {
      const web3 = new Web3(this.provider as any);

      // Get the connected Chain's ID
      const chainId = await web3.eth.getChainId();

      return chainId.toString();
    } catch (error) {
      return error as string;
    }
  }

  async getAccounts(): Promise<any> {
    try {
      const web3 = new Web3(this.provider as any);

      // Get user's Ethereum public address
      const address = await web3.eth.getAccounts();

      return address;
    } catch (error) {
      return error;
    }
  }

  async getBalance(): Promise<string> {
    try {
      const web3 = new Web3(this.provider as any);

      // Get user's Ethereum public address
      const address = (await web3.eth.getAccounts())[0];

      // Get user's balance in ether
      const balance = web3.utils.fromWei(
        await web3.eth.getBalance(address), // Balance is in wei
        "ether"
      );

      return balance;
    } catch (error) {
      return error as string;
    }
  }

  async sendTransaction(): Promise<any> {
    try {
      const web3 = new Web3(this.provider as any);

      // Get user's Ethereum public address
      const fromAddress = (await web3.eth.getAccounts())[0];

      const destination = "0x4041FF26b6713FCd5659471521BA2e514E23750d";

      // Convert amount to wei
      const amount = web3.utils.toWei("0.04", "ether");

      // Submit transaction to the blockchain and wait for it to be mined
      const receipt = await web3.eth.sendTransaction({
        from: fromAddress,
        to: destination,
        gasLimit: "21000",
        maxFeePerGas: "300",
        maxPriorityFeePerGas: "10",
        value: amount,
      });
      console.log(receipt);

      return receipt.transactionHash;
    } catch (error) {
      return error as string;
    }
  }

  async signMessage() {
    try {
      const web3 = new Web3(this.provider as any);

      // Get user's Ethereum public address
      const fromAddress = (await web3.eth.getAccounts())[0];

      const originalMessage = "YOUR_MESSAGE";

      // Sign the message
      const signedMessage = await web3.eth.personal.sign(
        originalMessage,
        fromAddress,
        "test password!" // configure your own password here.
      );

      return signedMessage;
    } catch (error) {
      return error as string;
    }
  }

  async readFromContract() {
    try {
      const web3 = new Web3(this.provider as any);

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
      const contract = new web3.eth.Contract(JSON.parse(JSON.stringify(contractABI)), contractAddress);

      // Read message from smart contract
      const message = await contract.methods.message().call();
      return message;
    } catch (error) {
      return error as string;
    }
  }

  async writeToContract() {
    try {
      const web3 = new Web3(this.provider as any);

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
      const contract = new web3.eth.Contract(JSON.parse(JSON.stringify(contractABI)), contractAddress);

      // Write message to smart contract
      // @ts-ignore
      const receipt = await contract.methods.update("W3A").send({
        from: (await web3.eth.getAccounts())[0],
        maxFeePerGas: "300",
        maxPriorityFeePerGas: "10",
      });
      console.log(receipt);

      return receipt.transactionHash;
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
