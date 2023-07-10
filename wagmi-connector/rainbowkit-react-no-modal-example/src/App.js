import "@rainbow-me/rainbowkit/styles.css";

import { ConnectButton, connectorsForWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { createConfig, WagmiConfig, configureChains } from "wagmi";
import { rainbowWeb3AuthConnector } from "./RainbowWeb3authConnector";
import { mainnet, polygon } from 'wagmi/chains';
import { walletConnectWallet, rainbowWallet, metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient } = configureChains(
  [mainnet, polygon],
  [alchemyProvider({ apiKey: "7wSu45FYTMHUO4HJkHjQwX4HFkb7k9Ui" }), alchemyProvider({ apiKey: "fGXusgBUDC-OPy6XI8IFRvu1i7sbWsYj" }), publicProvider()]
);
const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [rainbowWallet({ chains }), walletConnectWallet({ chains }), metaMaskWallet({ chains }), rainbowWeb3AuthConnector({ chains })],
  },
]);
const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient,
});

export default function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
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
          }}>
          <ConnectButton />
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
