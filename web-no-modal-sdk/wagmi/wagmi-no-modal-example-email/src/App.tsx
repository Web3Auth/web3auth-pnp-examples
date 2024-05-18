

// WAGMI Libraries
import { WagmiProvider, createConfig, http, useAccount, useConnect, useDisconnect } from "wagmi";
import { coinbaseWallet, walletConnect } from "wagmi/connectors";
import { sepolia, mainnet, polygon } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' 

import { SendTransaction } from "./sendTransaction";
import { SwitchChain } from "./switchNetwork";
import { Balance } from "./balance";
import { WriteContract } from "./writeContract";

import Web3AuthConnectorInstance from "./Web3AuthConnectorInstance";
import "./App.css";
import { useEffect, useState } from "react";

const queryClient = new QueryClient() 

function Profile( {setEmail}: {setEmail: any}) {
  const { address, connector, isConnected } = useAccount();
  const { connect, connectors, error } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="main">
        <div className="title">Connected to {connector?.name}</div>
        <div>{address}</div>
        <button className="card" onClick={disconnect as any}>
          Disconnect
        </button>
        <SendTransaction />
        <Balance />
        <WriteContract />
        <SwitchChain />
      </div>
    );
  } else {
    return (
      <div className="main">
        {connectors.map((connector) => {
          return (
            // check if id = web3auth and create an input email field
            connector.id === "web3auth" ?
            <>
              <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
              <button className="card" key={connector.id} onClick={() => connect({ connector })}>
              {connector.name}
            </button>
            </> :
            // else render the button
            <button className="card" key={connector.id} onClick={() => connect({ connector })}>
              {connector.name}
            </button>
          );
        })}
        {error && <div>{error.message}</div>}
      </div>
    );
  }
}

// Pass client to React Context Provider
function App() {
  const [config, setConfig] = useState<any>("");
  const [email, setEmail] = useState<string>("");

// Set up client


useEffect(() => {
  const configState = createConfig({
    chains: [mainnet, sepolia, polygon],
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [polygon.id]: http(),
    },
    connectors: [
      walletConnect({
        projectId: "3314f39613059cb687432d249f1658d2",
        showQrModal: true,
      }),
      coinbaseWallet({ appName: 'wagmi' }),
      Web3AuthConnectorInstance([mainnet, sepolia, polygon], email),
    ],
  });
  setConfig(configState);
}, [email]);

  return (
    // if config is not set, return null
    !config ? null :
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
      <div className="container">
        <Profile setEmail={setEmail} />
      </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;