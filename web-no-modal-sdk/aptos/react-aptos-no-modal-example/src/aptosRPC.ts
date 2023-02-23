import type { SafeEventEmitterProvider } from "@web3auth/base";
import { AptosAccount , FaucetClient, AptosClient } from "aptos";

export default class AptosRpc {
  private provider: SafeEventEmitterProvider;
  NODE_URL ="https://fullnode.devnet.aptoslabs.com";
  FAUCET_URL ="https://faucet.devnet.aptoslabs.com";
  aptosCoinStore = "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>";

  constructor(provider: SafeEventEmitterProvider) {
    this.provider = provider;
  }

  async getPrivateKey(): Promise<any> {
    try {
      const privateKey = await this.provider.request({
        method: "private_key",
      });

      return privateKey;
    } catch (error) {
      return error as string;
    }
  }

  async getAptosAccount(): Promise<any> {
    try {
      const privateKey = await this.getPrivateKey();
      // convert private key to uint8array
      const privateKeyUint8Array = new Uint8Array(
        privateKey.match(/.{1,2}/g)!.map((byte: any) => parseInt(byte, 16))
      );
      const aptosAccount = new AptosAccount(privateKeyUint8Array) ;
      return aptosAccount;
    } catch (error) {
      return error;
    }
  }

  async getAccounts(): Promise<any> {
    try {
      const aptosAccount = await this.getAptosAccount();
      const address = aptosAccount.address();
      return address;
    } catch (error) {
      return error;
    }
  }

  async getAirdrop(): Promise<any> {
    const address = await this.getAccounts();
    const faucetClient = new FaucetClient(this.NODE_URL, this.FAUCET_URL);
    const response = await faucetClient.fundAccount(address, 100_000_000);
    return response;
  }

  async getBalance(): Promise<any> {
    try {
      const aptosAccount = await this.getAptosAccount();
      const client = new AptosClient(this.NODE_URL);
      let resources = await client.getAccountResources(aptosAccount.address());
      let accountResource = resources.find((r) => r.type === this.aptosCoinStore);
      let balance = parseInt((accountResource?.data as any).coin.value);
      return balance;
    } catch (error) {
      return error as string;
    }
  }

  async sendTransaction(): Promise<any> {
    try {
      const aptosAccount = await this.getAptosAccount();
      const client = new AptosClient(this.NODE_URL);
      const payload = {
        type: "entry_function_payload",
        function: "0x1::coin::transfer",
        type_arguments: ["0x1::aptos_coin::AptosCoin"],
        arguments: [aptosAccount.address().hex(), 717], // sending funds to self
      };
      const txnRequest = await client.generateTransaction(aptosAccount.address(), payload);
      const signedTxn = await client.signTransaction(aptosAccount, txnRequest);
      console.log(signedTxn)
      const transactionRes = await client.submitTransaction(signedTxn);
      await client.waitForTransaction(transactionRes.hash);
      console.log(transactionRes.hash)
      return transactionRes.hash;
    } catch (error) {
      return error as string;
    }
  }

}