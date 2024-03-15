import type { IProvider } from "@web3auth/base";
import { CoinBalance, getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { MIST_PER_SUI } from '@mysten/sui.js/utils';
import { TransactionBlock } from '@mysten/sui.js/transactions';

export default class SuiRPC {
    private provider: IProvider;
    rpcUrl = getFullnodeUrl('devnet');
    suiClient = new SuiClient({ url: this.rpcUrl });

    constructor(provider: IProvider) {
        this.provider = provider;
    }

    async getChainId(): Promise<string> {
        try {
            // Get the connected Chain's ID
            const chainId = await this.suiClient.getChainIdentifier();
            return chainId.toString();
        } catch (error) {
            return error as string;
        }
    }

    async getAccounts(): Promise<any> {
        try {
            const keypair = await this.getKeyPair();
            return keypair.toSuiAddress();
        } catch (error) {
            return error;
        }
    }

    async getBalance(): Promise<any> {
        try {
            const keypair = await this.getKeyPair();
            const suiBalance = await this.suiClient.getBalance({
                owner: keypair.toSuiAddress()
            });
            return this.balance(suiBalance);
        } catch (error) {
            return error as string;
        }
    }

    // Convert MIST to Sui
    private balance = (balance: CoinBalance) => {
        return Number.parseInt(balance.totalBalance) / Number(MIST_PER_SUI);
    }

    async sendTransaction(): Promise<any> {
        try {
            const keyPair = await this.getKeyPair();
            const tx = new TransactionBlock();
            
            // Convert value to be transferred to smallest value.
            const [coin] = tx.splitCoins(tx.gas, [tx.pure(0.2 * Number(MIST_PER_SUI))]);
            tx.transferObjects([coin], tx.pure("0x7d42ef777fa6e46a7b19d54dc9353c898e7f1c65a3abab8b73f92fe5efe6d96d"));
            const result = await this.suiClient.signAndExecuteTransactionBlock({ signer: keyPair, transactionBlock: tx });
            return result.digest;
        } catch (error) {
            return error as string;
        }
    }

    private async getKeyPair(): Promise<Ed25519Keypair> {
        try {
            const privateKey = await this.getPrivateKey();
            // Convert private key to Uint8Array
            const privateKeyUint8Array = new Uint8Array(
                privateKey.match(/.{1,2}/g)!.map((byte: any) => parseInt(byte, 16))
            );

            return Ed25519Keypair.fromSecretKey(privateKeyUint8Array);
        } catch (error) {
            throw error;
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