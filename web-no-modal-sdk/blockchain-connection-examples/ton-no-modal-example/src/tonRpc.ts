import type { IProvider } from "@web3auth/base";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import TonWeb from "tonweb";

import { fetchLocalConfig } from "@toruslabs/fnd-base";
import { Torus, type TorusPublicKey } from "@toruslabs/torus.js";

const rpc = await getHttpEndpoint({
  network: "testnet",
  protocol: "json-rpc",
});

export default class TonRPC {
  private provider: IProvider;
  private tonweb: TonWeb;

  constructor(provider: IProvider) {
    this.provider = provider;
    this.tonweb = new TonWeb(new TonWeb.HttpProvider(rpc));
  }

  async getAccounts(): Promise<string> {
    try {
      const privateKey = await this.getPrivateKey();
      const keyPair = this.getKeyPairFromPrivateKey("cfe3a737880b01da41765e90466400512564bf3e12648e8e715ae54b53b1e11b");
      const WalletClass = this.tonweb.wallet.all["v3R2"];
      const wallet = new WalletClass(this.tonweb.provider, {
        publicKey: keyPair.publicKey,
      });
      const address = await wallet.getAddress();

      return address.toString(true, true, false, true);
    } catch (error) {
      console.error("Error getting accounts:", error);
      return "";
    }
  }

  async getPreGenAccounts(): Promise<string> {
    try {
      const { torusNodeEndpoints, torusNodePub, torusIndexes } = fetchLocalConfig("sapphire_mainnet", "ed25519");
      console.log("from torusNodeEndpoints", { torusNodeEndpoints, torusNodePub, torusIndexes });
      const torus = new Torus({
        enableOneKey: true, // Enable OneKey mode
        network: "sapphire_mainnet", // Specify the web3auth network
        clientId: "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ", // Provide your clientId
        keyType: "ed25519",
      });
      const torusPublicKey = await torus.getPublicAddress(torusNodeEndpoints, torusNodePub, {
        verifier: "w3a-google-demo", // Verifier name
        verifierId: "shahbazalam17feb@gmail.com", // VerifierId associated with the user
      });

      console.log("Torus Public Key:", torusPublicKey);

      const xBytes = new Uint8Array(Buffer.from("2cfc2713bd866494690b50d0cb1500878903130a0a1a31fae1ffa5f8cd436407", "hex"));
      const yBytes = new Uint8Array(Buffer.from("775cc21e123af488ad2c1fd70b22f9427a0596691c991186d42e69fa08ee5cbe", "hex"));

      const publicKey = new Uint8Array(xBytes.length + yBytes.length);
      publicKey.set(xBytes, 0);
      publicKey.set(yBytes, xBytes.length);
      const WalletClass = this.tonweb.wallet.all["v3R2"];
      const wallet = new WalletClass(this.tonweb.provider, {
        publicKey,
      });
      const address = await wallet.getAddress();

      return address.toString(true, true, false, true);
    } catch (error) {
      console.error("Error getting accounts:", error);
      return "";
    }
  }

  getChainId(): string {
    return "testnet";
  }

  async getBalance(): Promise<string> {
    try {
      const address = await this.getAccounts();
      const balance = await this.tonweb.getBalance(address);
      return TonWeb.utils.fromNano(balance);
    } catch (error) {
      console.error("Error getting balance:", error);
      return "0";
    }
  }

  async sendTransaction(): Promise<any> {
    try {
      const privateKey = await this.getPrivateKey();
      const keyPair = this.getKeyPairFromPrivateKey(privateKey);

      const WalletClass = this.tonweb.wallet.all["v3R2"];
      const wallet = new WalletClass(this.tonweb.provider, { publicKey: keyPair.publicKey });

      const address = await wallet.getAddress();
      console.log("Wallet address:", address.toString(true, true, false, true));

      const balance = await this.tonweb.getBalance(address);
      console.log("Wallet balance:", TonWeb.utils.fromNano(balance.toString()));

      let seqno = (await wallet.methods.seqno().call()) ?? 0;
      console.log("Using seqno:", seqno);

      const transfer = wallet.methods.transfer({
        secretKey: keyPair.secretKey,
        toAddress: "0QCeWpE40bPUiuj-8ZfZd2VzMOxCMUuQFa_VKmdD8ssy5ukA",
        amount: TonWeb.utils.toNano("0.004"),
        seqno: seqno,
        payload: "Hello, TON!",
        sendMode: 3,
      });

      console.log("Sending transaction...");
      const result = await transfer.send();

      console.log(result);
      // Return the full result for display in uiConsole
      return result;
    } catch (error) {
      console.error("Error sending transaction:", error);
      return { error: error instanceof Error ? error.message : String(error) };
    }
  }

  async signMessage(message: string): Promise<string> {
    try {
      const privateKey = await this.getPrivateKey();
      const keyPair = this.getKeyPairFromPrivateKey(privateKey);

      const messageBytes = new TextEncoder().encode(message);

      const signature = TonWeb.utils.nacl.sign.detached(messageBytes, keyPair.secretKey);

      return Buffer.from(signature).toString("hex");
    } catch (error) {
      console.error("Error signing message:", error);
      throw error;
    }
  }

  public getKeyPairFromPrivateKey(privateKey: string): { publicKey: Uint8Array; secretKey: Uint8Array } {
    // Convert the hex string to a Uint8Array
    const privateKeyBytes = new Uint8Array(privateKey.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));

    // Ensure the private key is 32 bytes (256 bits)
    if (privateKeyBytes.length !== 32) {
      // If it's shorter, pad it. If it's longer, truncate it.
      const adjustedPrivateKey = new Uint8Array(32);
      adjustedPrivateKey.set(privateKeyBytes.slice(0, 32));
      return TonWeb.utils.nacl.sign.keyPair.fromSeed(adjustedPrivateKey);
    }

    // If it's already 32 bytes, use it directly
    return TonWeb.utils.nacl.sign.keyPair.fromSeed(privateKeyBytes);
  }

  async getPrivateKey(): Promise<string> {
    try {
      return await this.provider.request({
        method: "private_key",
      });
    } catch (error) {
      console.error("Error getting private key:", error);
      throw error;
    }
  }
}
