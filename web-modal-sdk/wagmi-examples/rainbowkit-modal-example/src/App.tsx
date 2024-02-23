import "@rainbow-me/rainbowkit/styles.css";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectButton, RainbowKitProvider, connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { WagmiProvider, http, createConfig } from 'wagmi'
import {RainbowWeb3authConnector} from "./RainbowWeb3authConnector";
import { sepolia, mainnet, polygon } from "wagmi/chains";

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [rainbowWallet, walletConnectWallet, RainbowWeb3authConnector],
    },
  ],
  {
    appName: 'My RainbowKit App',
    projectId: '04309ed1007e77d1f119b85205bb779d',
  }
);

const config = createConfig({
  chains: [mainnet, sepolia, polygon],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
  },
  connectors,
});


const queryClient = new QueryClient()

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div
            style={{
              position: "fixed",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "sans-serif",
            }}>
            <ConnectButton />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
