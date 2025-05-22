import "./index.css";

import ReactDOM from "react-dom/client";
// Setup Web3Auth Provider
import { Web3AuthProvider } from "@web3auth/modal/react";
import web3AuthContextConfig from "./web3authContext";
// Setup Wagmi Provider
import { WagmiProvider } from "@web3auth/modal/react/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  // Setup Web3Auth Provider
  <Web3AuthProvider config={web3AuthContextConfig}>
    <QueryClientProvider client={queryClient}>
      <WagmiProvider>
        <GoogleOAuthProvider clientId="461819774167-5iv443bdf5a6pnr2drt4tubaph270obl.apps.googleusercontent.com">
            <App />
        </GoogleOAuthProvider>
      </WagmiProvider>
    </QueryClientProvider>
  </Web3AuthProvider>
);
