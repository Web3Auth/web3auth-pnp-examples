// WAGMI Libraries
import { WagmiProvider, createConfig, http, useAccount, useConnect, useDisconnect } from "wagmi";
import { coinbaseWallet, walletConnect } from "wagmi/connectors";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { sepolia, mainnet, polygon, Chain } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' 
import React, { useContext } from 'react';

import { Web3AuthConnectorInstance, Web3AuthInstance} from "./Web3AuthConnectorInstance";

// some configurations
const appName = "wagmi";
const projectWalletConnectId = "3314f39613059cb687432d249f1658d2";
const chains_available: [Chain, ...Chain[]] = [mainnet, sepolia, polygon];

const queryClient = new QueryClient() 

// Create Web3Auth Instance
const web3AuthInstance = Web3AuthInstance(chains_available, appName);

export const Web3AuthContext = React.createContext<Web3AuthNoModal | null>(web3AuthInstance);
export const useWeb3Auth = () => useContext(Web3AuthContext);

export const ContextProvider = ({ children }: { children: React.ReactNode }) => {
    // Set up wagmi client
    const config = createConfig({
        chains: chains_available,
        transports: {
            [mainnet.id]: http(),
            [sepolia.id]: http(),
            [polygon.id]: http(),
        },
        connectors: [
            walletConnect({
            projectId: projectWalletConnectId,
            showQrModal: true,
            }),
            coinbaseWallet({ appName: appName }),
            Web3AuthConnectorInstance(web3AuthInstance),
        ],
    });

    return (
        <Web3AuthContext.Provider value={web3AuthInstance}>
            <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </WagmiProvider>
        </Web3AuthContext.Provider>
    );
};