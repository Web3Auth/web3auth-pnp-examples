import "./index.css";

import ReactDOM from "react-dom/client";
// Setup Web3Auth Provider
import { Web3AuthProvider } from "@web3auth/modal/react";
import web3AuthContextConfig from "./web3authContext";
// Setup Wagmi Provider
import { WagmiProvider } from "@web3auth/modal/react/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Auth0Provider } from "@auth0/auth0-react";

import App from "./App";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  // Setup Web3Auth Provider
  <Web3AuthProvider config={web3AuthContextConfig}>
    {/* Setup Wagmi Provider */}
    <QueryClientProvider client={queryClient}>
      <WagmiProvider>
        <Auth0Provider
          domain="web3auth.au.auth0.com"
          clientId={import.meta.env.VITE_AUTH0_CLIENT_ID || ""}
        >
          <App />
        </Auth0Provider>
      </WagmiProvider>
    </QueryClientProvider>
  </Web3AuthProvider>
);
