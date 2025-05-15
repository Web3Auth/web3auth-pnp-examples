import "./index.css";

import ReactDOM from "react-dom/client";
// Setup Web3Auth Provider
import { Web3AuthProvider } from "@web3auth/no-modal/react";
import web3AuthContextConfig from "./web3authContext";
// Setup Wagmi Provider
import { WagmiProvider } from "@web3auth/no-modal/react/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  // Setup Web3Auth Provider
  <Web3AuthProvider config={web3AuthContextConfig}>
    {/* Setup Wagmi Provider */}
    <QueryClientProvider client={queryClient}>
      <WagmiProvider>
      <GoogleOAuthProvider clientId="519228911939-cri01h55lsjbsia1k7ll6qpalrus75ps.apps.googleusercontent.com">
          <App />
        </GoogleOAuthProvider>
      </WagmiProvider>
    </QueryClientProvider>
  </Web3AuthProvider>
);
