import "./index.css";

import ReactDOM from "react-dom/client";
// Setup Web3Auth Provider
import { Web3AuthProvider } from "@web3auth/no-modal/react";
import web3AuthContextConfig from "./web3authContext";
// Setup Wagmi Provider
import { WagmiProvider } from "@web3auth/no-modal/react/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Web3AuthProvider config={web3AuthContextConfig}>
    <QueryClientProvider client={queryClient}>
      <WagmiProvider>
        <App />
      </WagmiProvider>
    </QueryClientProvider>
  </Web3AuthProvider>
);
