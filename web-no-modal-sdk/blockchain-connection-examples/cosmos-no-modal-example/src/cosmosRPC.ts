import type { IProvider } from "@web3auth/base";
import { 
    TonClient, 
    WalletContractV4, 
    internal,
    Address,
    toNano,
    fromNano,
    beginCell,
    SendMode
} from "@ton/ton";
import { mnemonicToWalletKey } from "@ton/crypto";

const endpoint = "https://toncenter.com/api/v2/jsonRPC"; // Replace with appropriate TON endpoint

export default class TonRPC {
    private provider: IProvider;
    private client: TonClient;

    constructor(provider: IProvider) {
        this.provider = provider;
        this.client = new TonClient({ endpoint });
    }

    async getAddress(): Promise<string> {
        try {
            const mnemonic = await this.getMnemonic();
            const keyPair = await mnemonicToWalletKey(mnemonic.split(" "));
            const wallet = WalletContractV4.create({ publicKey: keyPair.publicKey, workchain: 0 });
            return wallet.address.toString({ urlSafe: true, bounceable: true });
        } catch (error) {
            return error as string;
        }
    }

    async getBalance(): Promise<string> {
        try {
            const address = await this.getAddress();
            const balance = await this.client.getBalance(Address.parse(address));
            return fromNano(balance);
        } catch (error) {
            return error as string;
        }
    }

    async sendTransaction(toAddress: string, amount: string): Promise<any> {
        try {
            const mnemonic = await this.getMnemonic();
            const keyPair = await mnemonicToWalletKey(mnemonic.split(" "));
            const wallet = WalletContractV4.create({ publicKey: keyPair.publicKey, workchain: 0 });
            
            const walletContract = this.client.open(wallet);
            const seqno = await walletContract.getSeqno();
            
            const transfer = wallet.createTransfer({
                secretKey: keyPair.secretKey,
                seqno: seqno,
                messages: [
                    internal({
                        to: Address.parse(toAddress),
                        value: toNano(amount),
                        bounce: false,
                        body: beginCell().endCell(),
                    })
                ],
                sendMode: SendMode.PAY_GAS_SEPARATELY + SendMode.IGNORE_ERRORS,
            });

            const result = await this.client.sendExternalMessage(wallet, transfer);
            return result;
        } catch (error) {
            return error as string;
        }
    }

    async getMnemonic(): Promise<string> {
        try {
            return await this.provider.request({
                method: "private_key",
            }) as string;
        } catch (error) {
            return error as string;
        }
    }

    async getChainId(): Promise<string> {
        // TON doesn't have a chain ID in the same way as other blockchains
        // You might want to return a network identifier instead
        return "mainnet"; // or "testnet" depending on your configuration
    }
}