import IRPC from "./IRPC";

// Polkadot
import { Keyring, ApiPromise, WsProvider } from "@polkadot/api";
import { cryptoWaitReady } from "@polkadot/util-crypto";

export default class PolkadotRPC implements IRPC{
    private provider: WsProvider;
    private privateKey: string;

    constructor(privateKey: string) {
      this.provider = new WsProvider('wss://rpc.polkadot.io'); // Kusama	wss://kusama-rpc.polkadot.io
      this.privateKey = privateKey;
    }

    getChainId(): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async getAccounts(): Promise<any> {
        await cryptoWaitReady();

        const keyring = new Keyring({ ss58Format: 42, type: "sr25519" });
    
        const keyPair = keyring.addFromUri("0x" + this.privateKey);
        const address = keyPair.address;
        return address;
    }

    async getBalance(): Promise<string> {
        const address = await this.getAccounts();
        
        // Create the API and wait until ready
        const api = await ApiPromise.create({ provider:this.provider });
        
        const { data: { free }, nonce } = await api.query.system.account(address) as any; 
    
        return free.toString();
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