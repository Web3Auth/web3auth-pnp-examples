import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { TorusWalletConnectorPlugin } from "@web3auth/torus-wallet-connector-plugin";

const torusPlugin = new TorusWalletConnectorPlugin({
  torusWalletOpts: {
    buttonPosition: "bottom-left",
  },
  walletInitOptions: {
    whiteLabel: {
      theme: { isDark: true, colors: { primary: "#00a8ff" } },
      logoDark: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
      logoLight: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
    },
    useWalletConnect: true,
    enableLogging: true,
  },
});

export const rainbowWeb3AuthConnector = ({ chains }) => ({
  id: "web3auth",
  name: "Web3Auth",
  iconUrl: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
  iconBackground: "#fff",
  createConnector: () => {
    const connector = new Web3AuthConnector({
      chains: chains,
      options: {
        enableLogging: true,
        clientId: "YOUR_CLIENT_ID", // Get your own client id from https://dashboard.web3auth.io
        network: "testnet",
        chainId: "0x1",
      },
    });
    connector.web3AuthInstance.addPlugin(torusPlugin);
    return {
      connector,
    };
  },
});
