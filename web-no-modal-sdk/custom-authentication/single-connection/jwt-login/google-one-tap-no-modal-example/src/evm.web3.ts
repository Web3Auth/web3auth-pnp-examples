import type {IProvider} from '@web3auth/base'
import Web3 from 'web3'

export default class EthereumRpc {
  private provider: IProvider

  constructor(provider: IProvider) {
    this.provider = provider
  }
  async getAccounts(): Promise<string[]> {
    try {
      const web3 = new Web3(this.provider as IProvider)
      const accounts = await web3.eth.getAccounts()
      return accounts
    } catch (error: unknown) {
      return error as string[]
    }
  }

  async getBalance(): Promise<string> {
    try {
      const web3 = new Web3(this.provider as IProvider)
      const accounts = await web3.eth.getAccounts()
      const balance = await web3.eth.getBalance(accounts[0])
      return balance.toString();
    } catch (error) {
      return error as string
    }
  }

  async signMessage(): Promise<string | undefined> {
    try {
      const web3 = new Web3(this.provider as IProvider)
      const fromAddress = (await web3.eth.getAccounts())[0];
      const message =
        '0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad';
        
      // Sign the message
      const signedMessage = await web3.eth.personal.sign(
        message,
        fromAddress,
        "test password!" // configure your own password here.
      );

      return signedMessage;
    } catch (error) {
      return error as string
    }
  }

  async signAndSendTransaction(): Promise<string> {
    try {
      const web3 = new Web3(this.provider as IProvider)
      const amount = web3.utils.toWei("0.001", "ether"); // Convert 1 ether to wei
      // Get user's Ethereum public address
      const fromAddress = (await web3.eth.getAccounts())[0];

      let transaction = {
        from: fromAddress,
        to: fromAddress,
        data: "0x",
        value: amount,
      }
      
      // calculate gas transaction before sending
      transaction = { ...transaction, gas: await web3.eth.estimateGas(transaction)} as any;

      // Submit transaction to the blockchain and wait for it to be mined
      const txRes = await web3.eth.sendTransaction(transaction);

      return txRes.transactionHash.toString();
    } catch (error) {
      return error as string
    }
  }
}
