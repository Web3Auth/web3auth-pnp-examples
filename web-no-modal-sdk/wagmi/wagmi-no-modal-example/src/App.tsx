// WAGMI Libraries
import { useWalletClient,useAccount, useConnect, useDisconnect } from "wagmi";
import { useEffect } from 'react';

import { SendTransaction } from "./sendTransaction";
import { SwitchChain } from "./switchNetwork";
import { Balance } from "./balance";
import { WriteContract } from "./writeContract";

import "./App.css";

// context to get the userInfo with web3auth.getUserInfo()
import { ContextProvider, useWeb3Auth } from "./ContextProvider";

function Profile() {
  const { address, connector, isConnected } = useAccount();
  const { connect, connectors, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: walletClient } = useWalletClient();
  let web3Auth = useWeb3Auth();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        var userInfo = await web3Auth?.getUserInfo();
      } catch (e) {
        console.log("Cannot get userInfo first time, likely web3Auth not fully updated");
      }
      console.log("/app, userInfo", userInfo);
    };
    getUserInfo();
  }, [walletClient]);

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
  return (
    <ContextProvider>
      <div className="container">
        <Profile />
      </div>
    </ContextProvider>
  );
}

export default App;