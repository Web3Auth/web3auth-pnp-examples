// StarkEx and StarkNet
//@ts-ignore
import { ec } from "@starkware-industries/starkware-crypto-utils";

import IRPC from "./IRPC";

export default class StartkNetRPC implements IRPC{
    private privateKey: string;

    constructor(privateKey: string) {
      this.privateKey = privateKey;
    }

    getChainId(): Promise<any> {
        throw new Error("Method not implemented.");
    }
    async getAccounts(): Promise<any> {
          const keyPairStarkNet = ec.keyFromPrivate(this.privateKey, "hex");
          const starknet_account = ec.keyFromPublic(keyPairStarkNet.getPublic(true, "hex"), "hex");
          const address = "0x" + starknet_account.pub.getX().toString("hex");
          return address;
    }

    getBalance(): Promise<string> {
        throw new Error("Method not implemented.");
    }
    
    sendTransaction(): Promise<any> {
        throw new Error("Method not implemented.");
    }
    signMessage(): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getPrivateKey(): Promise<any> {
        throw new Error("Method not implemented.");
    }

}