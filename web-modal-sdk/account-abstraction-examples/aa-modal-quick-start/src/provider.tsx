import { WEB3AUTH_NETWORK, Web3AuthOptions } from "@web3auth/modal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "@web3auth/modal/react/wagmi";
import { ReactNode } from "react";
import { Web3AuthProvider } from "@web3auth/modal/react";

const clientId = "BBWsHL_ho__CfdDwMoJTwvBkt6KtsMq9F1XlqYF2uuS1V_MTgVUm3U93PVkp0rdcLHdtwLqv_E6U-ogTvSY226E"; // get from https://dashboard.web3auth.io

const pimlicoAPIKey = import.meta.env.VITE_API_KEY;

const web3AuthOptions: Web3AuthOptions = {
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  authBuildEnv: "testing",
  defaultChainId: "0x14a34",
  accountAbstractionConfig: {
    smartAccountType: "metamask",
    chains: [
      {
        chainId: "0x14a34",
        bundlerConfig: {
          url: `https://api.pimlico.io/v2/84532/rpc?apikey=${pimlicoAPIKey}`,
          paymasterContext: {
            token: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
          }
        },
        paymasterConfig: {
          url: `https://api.pimlico.io/v2/84532/rpc?apikey=${pimlicoAPIKey}`,
        }
      },
    ],
  },
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