// WAGMI Libraries
import { WagmiConfig, createClient, configureChains } from 'wagmi'
import {
	useAccount,
	useConnect,
	useDisconnect,
} from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { arbitrum, mainnet, polygon } from "wagmi/chains";
import { publicProvider } from 'wagmi/providers/public'

import './App.css';
import Web3AuthConnectorInstance from "./Web3AuthConnectorInstance";

// Configure chains & providers with the Public provider.
const { chains, provider, webSocketProvider } = configureChains(
 [mainnet, arbitrum, polygon],
 [publicProvider()],
)

// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
    Web3AuthConnectorInstance(chains)
 ],
 provider,
 webSocketProvider,
})

function Profile() {
  const { address, connector, isConnected } = useAccount();
	const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
	const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="main">
        <div className="title">Connected to {connector?.name}</div>
        <div>{address}</div>
        <button className="card" onClick={disconnect as any}>Disconnect</button>
      </div>
    );
  } else {
    return (
      <div className="main">
        {connectors.map((connector) => (
          <button
          className="card"
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
          >
            {connector.name}
            {!connector.ready && ' (unsupported)'}
            {isLoading &&
            connector.id === pendingConnector?.id &&
            ' (connecting)'}
          </button>
        ))}
      {error && <div>{error.message}</div>}
    </div>)
  }
}


// Pass client to React Context Provider
function App() {
	
  return (
    <WagmiConfig client={client}>
      <div className="container">
        <Profile />
      </div>
    </WagmiConfig>
  )
}

export default App;
