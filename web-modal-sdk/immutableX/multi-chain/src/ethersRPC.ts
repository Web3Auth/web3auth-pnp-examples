import type { SafeEventEmitterProvider } from "@web3auth/base";
import { ethers } from "ethers";
//@ts-ignore
import starkwareCrypto from "@starkware-industries/starkware-crypto-utils";

import { ImmutableX, Config } from "@imtbl/core-sdk";
import { generateStarkPrivateKey, createStarkSigner } from "@imtbl/core-sdk";

export default class EthereumRpc {
  private provider: SafeEventEmitterProvider;

  constructor(provider: SafeEventEmitterProvider) {
    this.provider = provider;
  }

  config = Config.SANDBOX; // Or Config.PRODUCTION or Config.ROPSTEN
  client = new ImmutableX(this.config);

  async getChainId(): Promise<any> {
    try {
      const ethersProvider = new ethers.providers.Web3Provider(this.provider);
      // Get the connected Chain's ID
      const networkDetails = await ethersProvider.getNetwork();
      return networkDetails.chainId;
    } catch (error) {
      return error;
    }
  }

  async getAccounts(): Promise<any> {
    try {
      const ethersProvider = new ethers.providers.Web3Provider(this.provider);
      const ethSigner = ethersProvider.getSigner();

      // Get user's Ethereum public address
      const address = await ethSigner.getAddress();

      // Get user's Starkex public address

      // const starkKey = await this.getPrivateKey();
      const starkKey = await generateStarkPrivateKey();
      const starkSigner = createStarkSigner(starkKey);

      // console.log("eth address", address);
      // console.log("starkAddress", starkSigner);

      const walletConnection = { ethSigner, starkSigner };
      console.log("walletConnection", walletConnection);
      const response = await this.client.registerOffchain(walletConnection);
      console.log("response", response);
      return response;
    } catch (error) {
      return error;
    }
  }

  getStarkExAddress = async () => {
    const privateKey = await this.getPrivateKey();
    const keyPairStarkEx = starkwareCrypto.ec.keyFromPrivate(privateKey, "hex");
    const starkex_account = starkwareCrypto.ec.keyFromPublic(
      keyPairStarkEx.getPublic(true, "hex"),
      "hex"
    );
    return starkex_account;
    const address = starkex_account.pub.getX().toString("hex");
    return address;
  };

  async getBalance(): Promise<string> {
    try {
      const ethersProvider = new ethers.providers.Web3Provider(this.provider);
      const signer = ethersProvider.getSigner();

      // Get user's Ethereum public address
      const address = await signer.getAddress();

      // Get user's balance in ether
      const balance = ethers.utils.formatEther(
        await ethersProvider.getBalance(address) // Balance is in wei
      );

      return balance;
    } catch (error) {
      return error as string;
    }
  }

  async sendTransaction(): Promise<any> {
    try {
      const ethersProvider = new ethers.providers.Web3Provider(this.provider);
      const signer = ethersProvider.getSigner();

      const destination = "0x40e1c367Eca34250cAF1bc8330E9EddfD403fC56";

      // Convert 1 ether to wei
      const amount = ethers.utils.parseEther("0.001");

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
      const ethersProvider = new ethers.providers.Web3Provider(this.provider);
      const signer = ethersProvider.getSigner();

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
