/* eslint-disable @typescript-eslint/no-explicit-any */
import { DirectSecp256k1Wallet, OfflineDirectSigner } from "@cosmjs/proto-signing";
import { SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import type { SafeEventEmitterProvider } from "@web3auth/base";

const rpc = "https://rpc.sentry-02.theta-testnet.polypore.xyz";
export default class CosmosRPC {
  private provider: SafeEventEmitterProvider;

  constructor(provider: SafeEventEmitterProvider) {
    this.provider = provider;
  }

  async getChainId(): Promise<string> {
    try {
      const client = await StargateClient.connect(rpc);

      // Get the connected Chain's ID
      const chainId = await client.getChainId();

      return chainId.toString();
    } catch (error) {
      return error as string;
    }
  }

  async getAccounts(): Promise<any> {
    try {
      const privateKey = Buffer.from(await this.getPrivateKey(), "hex");
      const walletPromise = await DirectSecp256k1Wallet.fromKey(privateKey, "cosmos");
      // const { address } = (await walletPromise.getAccounts())[0];
      // eslint-disable-next-line no-console
      console.log((await walletPromise.getAccounts())[0]);
      return (await walletPromise.getAccounts())[0].address;
    } catch (error) {
      return error;
    }
  }

  async getBalance(): Promise<any> {
    try {
      const client = await StargateClient.connect(rpc);

      const privateKey = Buffer.from(await this.getPrivateKey(), "hex");
      const walletPromise = await DirectSecp256k1Wallet.fromKey(privateKey, "cosmos");
      const { address } = (await walletPromise.getAccounts())[0];
      // Get user's balance in uAtom
      return await client.getAllBalances(address);
    } catch (error) {
      return error as string;
    }
  }

  async sendTransaction(): Promise<any> {
    try {
      await StargateClient.connect(rpc);
      const privateKey = Buffer.from(await this.getPrivateKey(), "hex");
      const walletPromise = await DirectSecp256k1Wallet.fromKey(privateKey, "cosmos");
      const fromAddress = (await walletPromise.getAccounts())[0].address;

      const destination = "cosmos15aptdqmm7ddgtcrjvc5hs988rlrkze40l4q0he";

      const getSignerFromKey = async (): Promise<OfflineDirectSigner> => {
        return DirectSecp256k1Wallet.fromKey(privateKey, "cosmos");
      };
      const signer: OfflineDirectSigner = await getSignerFromKey();

      const signingClient = await SigningStargateClient.connectWithSigner(rpc, signer);

      const result = await signingClient.sendTokens(fromAddress, destination, [{ denom: "uatom", amount: "250" }], {
        amount: [{ denom: "uatom", amount: "250" }],
        gas: "100000",
      });
      const { transactionHash } = result;
      const { height } = result;
      return { transactionHash, height };
    } catch (error) {
      return error as string;
    }
  }

  async getPrivateKey(): Promise<any> {
    try {
      return await this.provider.request({
        method: "private_key",
      });
    } catch (error) {
      return error as string;
    }
  }
}
