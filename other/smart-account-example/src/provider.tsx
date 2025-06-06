import { WEB3AUTH_NETWORK, type Web3AuthOptions } from "@web3auth/modal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "@web3auth/modal/react/wagmi";
import { type ReactNode } from "react";
import { Web3AuthProvider } from "@web3auth/modal/react";

const clientId = "BCfIbiMcEwBkmyNxwn-DcYIfUU4QrpQgyOZZTNi5f_ygWMS1g_dNcuxylwDkIbVNhDtn7dAs-aMUhX0dtAYhvWk"; // get from https://dashboard.web3auth.io

const web3AuthOptions: Web3AuthOptions = {
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  
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