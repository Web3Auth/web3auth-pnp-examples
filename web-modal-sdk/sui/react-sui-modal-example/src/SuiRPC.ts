import type { SafeEventEmitterProvider } from "@web3auth/base";
import {
  TransactionBlock,
  JsonRpcProvider,
  testnetConnection,
  RawSigner,
  Ed25519Keypair
} from '@mysten/sui.js';

export default class SuiRpc {
  private provider: SafeEventEmitterProvider;
  NODE_URL ="https://fullnode.testnet.sui.io:443";
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

  async getKeyPair(): Promise<any> {
    try {
      const privateKey = await this.getPrivateKey();
      // convert private key to uint8array
      const privateKeyUint8Array = new Uint8Array(
        privateKey.match(/.{1,2}/g)!.map((byte: any) => parseInt(byte, 16))
      );
      
      const keyPair = Ed25519Keypair.fromSecretKey(privateKeyUint8Array);
      return keyPair;
    } catch (error) {
      return error;
    }
  }

  async getAddress(): Promise<any> {
    try {
      const keyPair = await this.getKeyPair();
      const address = keyPair.getPublicKey().toSuiAddress();
      return address;
    } catch (error) {
      return error;
    }
  }



  async getAirdrop(): Promise<any> {
    const address = await this.getAddress();
    const provider = new JsonRpcProvider(testnetConnection);
    const response = await provider.requestSuiFromFaucet(address);
    return response;
  }

  async getBalance(): Promise<any> {
    try {
      const address = await this.getAddress();
      const client = new JsonRpcProvider(testnetConnection);
      let resources = await client.getBalance({
        owner: address, 
        coinType: '0x2::sui::SUI'
      });
      return parseInt(resources.totalBalance) / 1_000_000_000;
    } catch (error) {
      return error as string;
    }
  }

  async sendTransaction(): Promise<any> {
    try {
      const address = await this.getAddress();
      const keyPair = await this.getKeyPair();
      const tx = new TransactionBlock();
      const provider = new JsonRpcProvider(testnetConnection);
      const signer = new RawSigner(keyPair, provider);

      const [coin] = tx.splitCoins(tx.gas, [tx.pure(1000)]);
      tx.transferObjects([coin], tx.pure(address));
      const result = await signer.signAndExecuteTransactionBlock({
        transactionBlock: tx,
      });
      console.log({ result });
      return result.digest;
    } catch (error) {
      return error as string;
    }
  }

}