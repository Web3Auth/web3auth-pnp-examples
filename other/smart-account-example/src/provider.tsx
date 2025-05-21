import { WEB3AUTH_NETWORK, type Web3AuthOptions } from "@web3auth/modal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "@web3auth/modal/react/wagmi";
import { type ReactNode } from "react";
import { Web3AuthProvider } from "@web3auth/modal/react";

const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID || ""; // get from https://dashboard.web3auth.io

const web3AuthOptions: Web3AuthOptions = {
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  authBuildEnv: "testing",
};

const web3authConfig = {
  web3AuthOptions,
};

const queryClient = new QueryClient();

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <Web3AuthProvider config={web3authConfig}>
    <QueryClientProvider client={queryClient}>
      <WagmiProvider>
        {children}
      </WagmiProvider>
    </QueryClientProvider>
  </Web3AuthProvider>
  );
}