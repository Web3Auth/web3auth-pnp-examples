"use client";

// IMP START - Setup Web3Auth Provider
import { Web3AuthProvider, type Web3AuthContextConfig } from "@web3auth/no-modal/react";
import { WEB3AUTH_NETWORK } from "@web3auth/no-modal";
// IMP END - Setup Web3Auth Provider
// IMP START - Setup Wagmi Provider
import { WagmiProvider } from "@web3auth/no-modal/react/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// IMP END - Setup Wagmi Provider

// IMP START - Dashboard Registration
const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // get from https://dashboard.web3auth.io
// IMP END - Dashboard Registration
const queryClient = new QueryClient();

// IMP START - Instantiate SDK
const web3AuthContextConfig: Web3AuthContextConfig = {
    web3AuthOptions: {
      clientId,
      web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
      authBuildEnv: "testing",
    }
  };
// IMP END - Instantiate SDK

export default function Provider({ children }: { children: React.ReactNode }) {
    return (
    // IMP START - Setup Web3Auth Provider
    <Web3AuthProvider config={web3AuthContextConfig}>
      {/* // IMP END - Setup Web3Auth Provider */}
      {/*// IMP START - Setup Wagmi Provider*/}
      <QueryClientProvider client={queryClient}>
        <WagmiProvider>
        {children}
        </WagmiProvider>
      </QueryClientProvider>
      {/*// IMP END - Setup Wagmi Provider*/}
      {/*// IMP START - Setup Web3Auth Provider*/}
    </Web3AuthProvider>
    // IMP END - Setup Web3Auth Provider
  );
}
