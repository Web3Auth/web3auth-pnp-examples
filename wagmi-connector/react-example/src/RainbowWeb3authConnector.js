import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";

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
    return {
      connector,
    };
  },
});
