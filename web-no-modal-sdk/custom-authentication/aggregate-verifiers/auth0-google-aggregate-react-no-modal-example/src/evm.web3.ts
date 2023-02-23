import type { SafeEventEmitterProvider } from "@web3auth/base";
import Web3 from "web3";

export default class EthereumRpc {
  private provider: SafeEventEmitterProvider;

  constructor(provider: SafeEventEmitterProvider) {
    this.provider = provider;
  }
  async getAccounts(): Promise<string[]> {
    try {
      const web3 = new Web3(this.provider as any);
      const accounts = await web3.eth.getAccounts();
      return accounts;
    } catch (error: unknown) {
      return error as string[];
    }
  }

  async getBalance(): Promise<string> {
    try {
      const web3 = new Web3(this.provider as any);
      const accounts = await web3.eth.getAccounts();
      const balance = web3.utils.fromWei(
        await web3.eth.getBalance(accounts[0]) // Balance is in wei
      );
      return balance;
    } catch (error) {
      return error as string;
    }
  }

  async signMessage(): Promise<string | undefined> {
    try {
      const web3 = new Web3(this.provider as any);
      const fromAddress = (await web3.eth.getAccounts())[0];

      const originalMessage = [
        {
          type: "string",
          name: "fullName",
          value: "Satoshi Nakamoto",
        },
        {
          type: "uint32",
          name: "userId",
          value: "1212",
        },
      ];
      const params = [originalMessage, fromAddress];
      const method = "eth_signTypedData";

      const signedMessage = await (web3.currentProvider as any)?.sendAsync({
        id: 1,
        method,
        params,
        fromAddress,
      });
      return signedMessage;
    } catch (error) {
      return error as string;
    }
  }

  async sendTransaction(): Promise<string> {
    try {
      const web3 = new Web3(this.provider as any);
      const fromAddress = (await web3.eth.getAccounts())[0];

      const destination = "0x809D4310d578649D8539e718030EE11e603Ee8f3";
      const amount = web3.utils.toWei("0.05"); // Convert 1 ether to wei

      // Submit transaction to the blockchain and wait for it to be mined
      const receipt = await web3.eth.sendTransaction({
        from: fromAddress,
        to: destination,
        value: amount,
        maxPriorityFeePerGas: "5000000000", // Max priority fee per gas
        maxFeePerGas: "6000000000000", // Max fee per gas
      });
      return receipt.toString();
    } catch (error) {
      return error as string;
    }
  }

  getPrivateKey = async (): Promise<string> => {
    const privateKey = await this.provider.request({
      method: "eth_private_key",
    });

    return privateKey as string;
  };
}
