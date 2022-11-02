// @ts-ignore
import starkwareCrypto from "@starkware-industries/starkware-crypto-utils";
import type { SafeEventEmitterProvider } from "@web3auth/base";
// @ts-ignore
import { ec as elliptic } from "elliptic";
import { DeployContractResponse, defaultProvider } from "starknet";

// @ts-ignore
import CompiledAccountContractAbi from "./ArgentAccount.json";

export default class StarkNetRpc {
  private provider: SafeEventEmitterProvider;

  constructor(provider: SafeEventEmitterProvider) {
    this.provider = provider;
  }

  getStarkAccount = async (): Promise<any> => {
    try {
      const privateKey = await this.provider.request({ method: "private_key" });
      const keyPair = starkwareCrypto.ec.keyFromPrivate(privateKey, "hex");
      const account = starkwareCrypto.ec.keyFromPublic(
        keyPair.getPublic(true, "hex"),
        "hex"
      );
      return account;
    } catch (error) {
      return error;
    }
  };

  getStarkKey = async (): Promise<string | undefined> => {
    try {
      const account = await this.getStarkAccount();
      const publicKeyX = account.pub.getX().toString("hex");
      return publicKeyX;
    } catch (error) {
      return error as string;
    }
  };

  deployAccount = async (): Promise<
    DeployContractResponse | string | undefined
  > => {
    try {
      const account = await this.getStarkAccount();
      if (account) {
        const contract = JSON.parse(JSON.stringify(CompiledAccountContractAbi));
        const response = await defaultProvider.deployContract({
          contract,
        });
        return response;
      }
    } catch (error) {
      return error as string;
    }
    return undefined;
  };
}
