/* eslint-disable no-console */
import "./App.css";
import { useWeb3AuthConnect, useWeb3AuthDisconnect, useWeb3AuthUser} from "@web3auth/no-modal/react";
import { WALLET_CONNECTORS, AUTH_CONNECTION } from "@web3auth/no-modal";
import { useAccount } from "wagmi";
import { SendTransaction } from "./components/sendTransaction";
import { Balance } from "./components/getBalance";
import { SwitchChain } from "./components/switchNetwork";
import { useState, useEffect } from "react";

// Farcaster configuration
declare global {
  interface Window {
    farcaster: any;
  }
}

function App() {
  const { connect, isConnected, connectorName } = useWeb3AuthConnect();
  const { disconnect } = useWeb3AuthDisconnect();
  const { userInfo } = useWeb3AuthUser();
  const { address } = useAccount();
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  useEffect(() => {
    // Load Farcaster Connect script
    const script = document.createElement("script");
    script.src = "https://connect.farcaster.xyz/connect.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const loginWithFarcaster = async () => {
    setIsLoggingIn(true);
    try {
      if (!window.farcaster) {
        console.error("Farcaster Connect not loaded");
        setIsLoggingIn(false);
        return;
      }

      const farcasterConnect = window.farcaster.connect({
        relay: "https://relay.farcaster.xyz",
        domain: window.location.host,
        siweUri: window.location.origin,
      });

      const result = await farcasterConnect.signIn();
      
      if (result.success) {
        // Get JWT from backend
        const response = await fetch("http://localhost:8080/api/farcaster/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(result),
        });
        
        const data = await response.json();
        
        if (data.token) {
          await connect(WALLET_CONNECTORS.AUTH, {
            authConnection: AUTH_CONNECTION.CUSTOM,
            authConnectionId: "w3a-farcaster-demo",
            extraLoginOptions: {
              id_token: data.token,
            },
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
      console.log(...args);
    }
  }

  const loggedInView = (
    <>
      <h2>Connected to {connectorName}</h2>
      <div>{address}</div>
      <div className="flex-container"> 
        <div>
          <button onClick={() => uiConsole(userInfo)} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={() => disconnect()} className="card">
            Log Out
          </button>
        </div>
      </div>
      <SendTransaction />
      <Balance />
      <SwitchChain />
    </>
  );

  const unloggedInView = (
    <div className="flex-container">
      <button 
        onClick={loginWithFarcaster} 
        className="card" 
        disabled={isLoggingIn}
      >
        {isLoggingIn ? "Logging in..." : "Login with Farcaster"}
      </button>
    </div>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/no-modal" rel="noreferrer">
          Web3Auth{" "}
        </a>
        & React No Modal with Farcaster
      </h1>

      <div className="grid">{isConnected ? loggedInView : unloggedInView}</div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-no-modal-sdk/custom-authentication/single-connection/jwt-login/farcaster-no-modal-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
      </footer>
    </div>
  );
}

export default App;
