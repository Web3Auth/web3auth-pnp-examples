"use client";

// IMP START - Setup Web3Auth Provider
import { Web3AuthProvider } from "@web3auth/modal/react";
import web3AuthContextConfig from "./web3authContext";
// IMP END - Setup Web3Auth Provider
// IMP START - Setup Wagmi Provider
import { WagmiProvider } from "@web3auth/modal/react/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// IMP END - Setup Wagmi Provider

import App from "./App";

const queryClient = new QueryClient();

export default function Home() {
  return (
    // IMP START - Setup Web3Auth Provider
    <Web3AuthProvider config={web3AuthContextConfig}>
      {/* // IMP END - Setup Web3Auth Provider */}
      {/*// IMP START - Setup Wagmi Provider*/}
      <QueryClientProvider client={queryClient}>
        <WagmiProvider>
          <App />
        </WagmiProvider>
      </QueryClientProvider>
      {/*// IMP END - Setup Wagmi Provider*/}
      {/*// IMP START - Setup Web3Auth Provider*/}
    </Web3AuthProvider>
    // IMP END - Setup Web3Auth Provider
  );
}