// Tezos
//@ts-ignore
import * as tezosCrypto from "@tezos-core-tools/crypto-utils";
import { hex2buf } from "@taquito/utils";
import { TezosToolkit } from "@taquito/taquito";

import IRPC from "./IRPC";

export default class TezosRPC implements IRPC{
    private provider: TezosToolkit;
    private privateKey: string;

    constructor(privateKey: string) {
      this.privateKey = privateKey;
      this.provider = new TezosToolkit("https://ghostnet.ecadinfra.com");
    }

    getChainId(): Promise<any> {
        throw new Error("Method not implemented.");
    }
    async getAccounts(): Promise<any> {
          const keyPairTezos = tezosCrypto.utils.seedToKeyPair(hex2buf(this.privateKey));
          const address = keyPairTezos?.pkh;
          return address;
    }

    async getBalance(): Promise<string> {
        const address = await this.getAccounts();
        
        const balanceMutez = await this.provider.tz.getBalance(address);
        const balance = balanceMutez.div(1000000).toFormat(2);
        return balance.toString();
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