import { IProvider } from "@web3auth/base";
import { PublicClient, WalletClient, createPublicClient, createWalletClient, custom, formatEther, parseEther } from "viem";
import { sepolia } from "viem/chains";

export default class EthereumRPC {
    readonly walletClient: WalletClient;
    readonly publicClient: PublicClient;

    constructor(provider: IProvider) {
        this.publicClient = createPublicClient({
            chain: sepolia,
            transport: custom(provider)
        })

        this.walletClient = createWalletClient({
            chain: sepolia,
            transport: custom(provider)
        });
    }

    async getAccount(): Promise<string> {
        const addresses = await this.walletClient.getAddresses();
        return addresses[0];
    }

    async fetchBalance(): Promise<string> {
        const address = await this.getAccount();
        const balance = await this.publicClient.getBalance({ address: address as any });
        return formatEther(balance);
    }

    async signMessage(): Promise<string> {

        const address = await this.getAccount();
        const message = "Sign Protocol Demo";

        // Sign the message
        const hash = await this.walletClient.signMessage({
            account: address as any,
            message: message
        });

        return hash;
    }

    async sendTransaction(): Promise<string> {
        const amount = parseEther("0.0001");
        const address = await this.getAccount();

        // Submit transaction to the blockchain
        const response = await this.walletClient.sendTransaction({
            account: address as any,
            to: address as any,
            value: amount,
            chain: sepolia,
        });

        return response;
    }
}