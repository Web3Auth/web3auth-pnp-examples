import "@rainbow-me/rainbowkit/styles.css";

import {
  ConnectButton,
  connectorsForWallets,
  RainbowKitProvider,
  wallet,
} from "@rainbow-me/rainbowkit";
import { chain, createClient, WagmiConfig, configureChains } from "wagmi";
import { rainbowWeb3AuthConnector } from "./RainbowWeb3authConnector";

// import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
  [
    // alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider()
  ]
);
const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      wallet.rainbow({ chains }),
      wallet.walletConnect({ chains }),
      wallet.metaMask({ chains }),
      rainbowWeb3AuthConnector({ chains }),
    ],
  },
]);
const wagmiClient = createClient({
  connectors,
  provider,
});

export default function App() {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
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
          }}
        >
          <ConnectButton />
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
