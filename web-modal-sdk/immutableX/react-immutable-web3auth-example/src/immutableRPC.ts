import { SafeEventEmitterProvider } from "@web3auth/base";
import { ImmutableXClient, Link } from "@imtbl/imx-sdk";

export default class AlgorandRPC {
  private provider: SafeEventEmitterProvider;

  linkAddress = "https://link.x.immutable.com";
  apiAddress = "https://api.x.immutable.com/v1";

  link = new Link(this.linkAddress);

  // Sandbox/Goerli Testnet
  //const linkAddress = 'https://link.sandbox.x.immutable.com';
  //const apiAddress = 'https://api.sandbox.x.immutable.com/v1';

  // Link SDK
  // IMX Client
  //   client = await ImmutableXClient.build({ publicApiUrl: this.apiAddress });

  constructor(provider: SafeEventEmitterProvider) {
    this.provider = provider;
  }

  getImmutablexKeyPair = async (): Promise<any> => {
    const { address, starkPublicKey } = await this.link.setup({});
    return { address, starkPublicKey };
  };
}
