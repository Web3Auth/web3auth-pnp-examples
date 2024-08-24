import TronWeb from 'tronweb';
import type { IProvider } from "@web3auth/base";

export default class TronRpc {
  private tronWeb: TronWeb | null = null;
  private provider: IProvider;

  constructor(provider: IProvider) {
    this.provider = provider;
  }

  async init(): Promise<void> {
    try {
      const privateKey = await this.getPrivateKey();
      if (!privateKey) throw new Error("Private key is not available.");

      this.tronWeb = new TronWeb({
        fullHost: 'https://api.shasta.trongrid.io',
        privateKey,
      });
    } catch (error) {
      console.error("Error initializing TronWeb:", error);
    }
  }

  async getPrivateKey(): Promise<string | null> {
    try {
      const privateKey = await this.provider.request<string, string>({
        method: "eth_private_key",
      });

      if (!privateKey || typeof privateKey !== 'string') throw new Error("Invalid private key received.");

      return privateKey;
    } catch (error) {
      console.error("Failed to get private key:", error);
      return null;
    }
  }

  async getChainId(): Promise<string> {
    try {
      return this.provider.chainId;
    } catch (error) {
      console.error("Failed to get chain ID:", error);
      throw error;
    }
  }

  async getAccounts(): Promise<string[]> {
    this.ensureTronWebInitialized();
    const address = this.tronWeb!.defaultAddress.base58;
    return [address];
  }

  async getBalance(): Promise<string> {
    this.ensureTronWebInitialized();
    const address = this.tronWeb!.defaultAddress.base58;
    const balance = await this.tronWeb!.trx.getBalance(address);
    return this.tronWeb!.fromSun(balance); // Convert from SUN to TRX
  }

  async sendTransaction(): Promise<object> {
    try {
      if (!this.tronWeb) throw new Error("TronWeb not initialized");
  
      const fromAddress = this.tronWeb.defaultAddress.base58;
      const destination = "TKCq1vaJqpoXN5dhcPyWv8y7gug7XaNkEx";
      const amount = 1000000; // 1 TRX = 1,000,000 SUN
  
      const transaction = await this.tronWeb.transactionBuilder.sendTrx(destination, amount, fromAddress);
      const signedTransaction = await this.tronWeb.trx.sign(transaction);
      const receipt = await this.tronWeb.trx.sendRawTransaction(signedTransaction);
  
      const response = {
        from: fromAddress,
        to: destination,
        success: receipt.result,
        explorerLink: `https://shasta.tronscan.org/#/transaction/${receipt.txid}`,
      };
  
      return response;
    } catch (error) {
      console.error("Failed to send transaction:", error);
      throw error;
    }
  }
  
  async signMessage(): Promise<string> {
    this.ensureTronWebInitialized();
    const message = "YOUR_MESSAGE";
    const signedMessage = await this.tronWeb!.trx.sign(this.tronWeb!.toHex(message));
    return signedMessage;
  }

  private ensureTronWebInitialized(): void {
    if (!this.tronWeb) {
      throw new Error("TronWeb not initialized");
    }
  }
}
