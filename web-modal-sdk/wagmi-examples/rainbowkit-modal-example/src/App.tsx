import "@rainbow-me/rainbowkit/styles.css";

import { ConnectButton, RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { WagmiProvider, http } from "wagmi";
import { rainbowWeb3AuthConnector } from "./RainbowWeb3authConnector";
import { rainbowWallet, metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { sepolia, mainnet, polygon } from "wagmi/chains";

const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: '04309ed1007e77d1f119b85205bb779d',
  chains: [mainnet, sepolia, polygon],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
  },
  wallets: [{
    groupName: 'Recommended',
    wallets: [
      rainbowWallet,
      rainbowWeb3AuthConnector,
      metaMaskWallet,
    ],
  }],
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
