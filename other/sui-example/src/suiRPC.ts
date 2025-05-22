import type { IProvider } from "@web3auth/modal";
import { CoinBalance, getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { MIST_PER_SUI } from '@mysten/sui.js/utils';
import { TransactionBlock } from '@mysten/sui.js/transactions';

const rpcUrl = getFullnodeUrl('devnet');
const suiClient = new SuiClient({ url: rpcUrl });

export async function getChainId(provider: IProvider): Promise<string> {
    try {
        // Get the connected Chain's ID
        const chainId = await suiClient.getChainIdentifier();
        return chainId.toString();
    } catch (error) {
        return error as string;
    }
}

export async function getAccounts(provider: IProvider): Promise<any> {
    try {
        const keypair = await getKeyPair(provider);
        return keypair.toSuiAddress();
    } catch (error) {
        return error;
    }
}

export async function getBalance(provider: IProvider): Promise<any> {
    try {
        const keypair = await getKeyPair(provider);
        const suiBalance = await suiClient.getBalance({
            owner: keypair.toSuiAddress()
        });
        return balance(suiBalance);
    } catch (error) {
        return error as string;
    }
}

// Convert MIST to Sui
function balance(balance: CoinBalance): number {
    return Number.parseInt(balance.totalBalance) / Number(MIST_PER_SUI);
}

export async function sendTransaction(provider: IProvider): Promise<any> {
    try {
        const keyPair = await getKeyPair(provider);
        const tx = new TransactionBlock();
        
        // Convert value to be transferred to smallest value.
        const [coin] = tx.splitCoins(tx.gas, [tx.pure(0.2 * Number(MIST_PER_SUI))]);
        tx.transferObjects([coin], tx.pure("0x7d42ef777fa6e46a7b19d54dc9353c898e7f1c65a3abab8b73f92fe5efe6d96d"));
        const result = await suiClient.signAndExecuteTransactionBlock({ signer: keyPair, transactionBlock: tx });
        return result.digest;
    } catch (error) {
        return error as string;
    }
}

async function getKeyPair(provider: IProvider): Promise<Ed25519Keypair> {
    try {
        const privateKey = await getPrivateKey(provider);
        // Convert private key to Uint8Array
        const privateKeyUint8Array = new Uint8Array(
            privateKey.match(/.{1,2}/g)!.map((byte: any) => parseInt(byte, 16))
        );

        return Ed25519Keypair.fromSecretKey(privateKeyUint8Array);
    } catch (error) {
        throw error;
    }
}

export async function getPrivateKey(provider: IProvider): Promise<any> {
    try {
        return await provider.request({
            method: "private_key",
        });
    } catch (error) {
        return error as string;
    }
}