import type {SafeEventEmitterProvider} from "@web3auth/base";
import {Ed25519Keypair, Ed25519PublicKey, JsonRpcProvider, Network, RawSigner} from '@mysten/sui.js';
import {getED25519Key} from "@toruslabs/openlogin-ed25519";

export default class SuiRPC {
    private provider: SafeEventEmitterProvider;

    constructor(provider: SafeEventEmitterProvider) {
        this.provider = provider;
    }

    async getPrivateKey(): Promise<any> {
        try {
            const privateKey = await this.provider.request({
                method: "private_key",
            });
            // @ts-ignore
            const ed25519key = getED25519Key(privateKey).sk;
            return ed25519key;
        } catch (error) {
            return error as string;
        }
    }

    async getSUIProvider(): Promise<any> {
        try {
            const suiProvider = new JsonRpcProvider(Network.DEVNET);
            return suiProvider;
        } catch (error) {
            return error as string;
        }
    }

    async getSuiAccount(): Promise<any> {
        try {
            const privateKey = await this.getPrivateKey();
            const suiKeyPair = Ed25519Keypair.fromSecretKey(privateKey);
            const suiPublickKey = new Ed25519PublicKey(suiKeyPair.getPublicKey().toString())
            return `0x${suiPublickKey.toSuiAddress()}`;
        } catch (error) {
            return error;
        }
    }

    async getAccounts(): Promise<any> {
        try {
            const suiAddress = await this.getSuiAccount();
            return suiAddress;
        } catch (error) {
            return error;
        }
    }

    async getAirdrop(): Promise<any> {
        try {
            const devProvider = await this.getSUIProvider();
            const address = await this.getSuiAccount();
            await devProvider.requestSuiFromFaucet(
                address
            );
            return 'Airdrop success, wait for about 5 seconds';
        } catch (e) {
            return 'Airdrop failed with error: ' + e;
        }
    }

    async getBalance(): Promise<any> {
        try {
            const devProvider = await this.getSUIProvider();
            const address = await this.getSuiAccount();
            const coinBalance = await devProvider.getBalance(
                address,
                '0x2::sui::SUI'
            );
            return coinBalance['totalBalance'] / 1e9;
        } catch (e) {
            return 'GetBalance failed with error: ' + e;
        }
    }

    async sendTransaction(): Promise<any> {
        try {
            const privateKey = await this.getPrivateKey();
            const suiKeyPair = Ed25519Keypair.fromSecretKey(privateKey);
            const devProvider = await this.getSUIProvider();
            const signer = new RawSigner(suiKeyPair, devProvider);
            const allCoins = await devProvider.getAllCoins(
                await this.getAccounts()
            );
            let firstSuiCoin;
            let secondSuiCoin;
            for (const coin of allCoins.data) {
                if (coin.coinType === "0x2::sui::SUI") {
                    if (!firstSuiCoin) {
                        firstSuiCoin = coin;
                    } else if (!secondSuiCoin) {
                        secondSuiCoin = coin;
                    } else {
                        if (firstSuiCoin.coinObjectId != coin.coinObjectId &&
                            secondSuiCoin.coinObjectId != coin.coinObjectId) {
                            const payer = firstSuiCoin.balance >= secondSuiCoin.balance ? firstSuiCoin : secondSuiCoin;
                            const merger = payer.coinObjectId == firstSuiCoin.coinObjectId ? secondSuiCoin : firstSuiCoin;
                            await signer.mergeCoin({
                                primaryCoin: merger.coinObjectId,
                                coinToMerge: coin.coinObjectId,
                                gasPayment: payer.coinObjectId,
                                gasBudget: 1000,
                            });
                        }
                    }
                }
            }
            const transferTxn = await signer.transferSui({
                suiObjectId: firstSuiCoin.coinObjectId,
                amount: 1000,
                recipient: '0xa52e70466ab609437b7f718b3baad56f48afad75',
                gasBudget: 1000,
            });
            // @ts-ignore
            return transferTxn && transferTxn.EffectsCert && transferTxn.EffectsCert.certificate && transferTxn.EffectsCert.certificate.transactionDigest
        } catch (e) {
            return 'SendTransaction failed with error: ' + e;
        }
    }

}
