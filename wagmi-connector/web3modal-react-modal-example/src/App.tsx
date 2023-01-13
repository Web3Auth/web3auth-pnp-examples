// WAGMI Libraries
import { WagmiConfig, createClient, configureChains } from 'wagmi'
import { arbitrum, mainnet, polygon } from "wagmi/chains";
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import { Web3Modal, Web3Button, Web3NetworkSwitch } from "@web3modal/react";

import './App.css';
import Web3AuthConnectorInstance from "./Web3AuthConnectorInstance";

// Configure chains & providers with the Public provider.
const chains = [arbitrum, mainnet, polygon];

// Wagmi client
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: "6beb08746d01ef4c619e470c64f2d9e9" }),
]);

// Set up client
const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    Web3AuthConnectorInstance(chains),
    ...modalConnectors({ appName: "web3Modal", chains }),
  ],
  provider,
})

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains);

function App() {
  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <div className="container">
          <div className="main">
            <Web3Button />
            <Web3NetworkSwitch />
          </div>
        </div>
      </WagmiConfig>

      <Web3Modal
        projectId="6beb08746d01ef4c619e470c64f2d9e9"
        ethereumClient={ethereumClient}
        themeMode="light"
        walletImages={
          {
            web3auth: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
          }
        }
      />
    </>
  );
}

export default App;
