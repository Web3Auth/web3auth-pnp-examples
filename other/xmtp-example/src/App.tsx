import { useWeb3AuthConnect, useWeb3AuthDisconnect, useWeb3AuthUser, useWeb3Auth } from "@web3auth/no-modal/react";
import { WALLET_CONNECTORS, AUTH_CONNECTION } from "@web3auth/no-modal";
import { useEffect, useState } from "react";
import { FloatingInbox } from "./FloatingInbox";
import { ethers, JsonRpcSigner } from "ethers";
import "./index.css";
declare global {
  interface Window {
    FloatingInbox: {
      open: () => void;
      close: () => void;
    };
  }
}

function App() {
  const { connect, isConnected, loading: connectLoading, error: connectError } = useWeb3AuthConnect();
  const { disconnect, loading: disconnectLoading, error: disconnectError } = useWeb3AuthDisconnect();  
  const { provider } = useWeb3Auth();
  
  const [address, setAddress] = useState<string | null>(null);
  const [wallet, setWallet] = useState<any | null>(null);

  useEffect(() => {
    const getDetails = async () => {
      if (isConnected && provider) {
        try {
          const address = await getAccounts();
          setAddress(address);
          const wallet = await getWallet();
          setWallet(wallet);
        } catch (err) {
          console.error(err);
        }
      }
    };
    getDetails();
  }, [provider, isConnected]);

  const getWallet = async (): Promise<JsonRpcSigner | null> => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return null;
    }
    const ethersProvider = new ethers.BrowserProvider(provider as any);
    return ethersProvider.getSigner();
  };

  const getAccounts = async (): Promise<any> => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);
      const signer = await ethersProvider.getSigner();

      // Get user's Ethereum public address
      const address = await signer.getAddress();
      return address;
    } catch (error) {
      return error;
    }
  };

  function uiConsole(...args: unknown[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
      console.log(...args);
    }
  }

  const styles: Record<string, React.CSSProperties> = {
    uContainer: {
      height: "100vh",
      backgroundColor: "#f9f9f9",
      borderRadius: "10px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      zIndex: "1000",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    },
    xmtpContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    },
    btnXmtp: {
      backgroundColor: "#f0f0f0",
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      color: "#000",
      justifyContent: "center",
      border: "1px solid grey",
      padding: "10px",
      borderRadius: "5px",
      fontSize: "14px",
    },
    HomePageWrapperStyle: {
      textAlign: "center",
      marginTop: "2rem",
    },
    ButtonStyledStyle: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "10px 20px",
      borderRadius: "5px",
      marginBottom: "2px",
      border: "none",
      textAlign: "left",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
      color: "#333333",
      backgroundColor: "#ededed",
      fontSize: "12px",
    },
  };

  return (
    <div style={styles.HomePageWrapperStyle}>
      <h1>Web3Auth XMTP Quickstart </h1>
      <button 
        className="home-button" 
        style={{ ...styles.ButtonStyledStyle, marginLeft: 10 }} 
        onClick={() => connect(WALLET_CONNECTORS.AUTH, {
          authConnection: AUTH_CONNECTION.GOOGLE,
        })} 
        disabled={connectLoading}
      >
        {isConnected ? "Connected" : connectLoading ? "Connecting..." : "Login with Google"}
      </button>
      {isConnected && (
        <button 
          className="home-button" 
          style={{ ...styles.ButtonStyledStyle, marginLeft: 10 }} 
          onClick={() => disconnect()} 
          disabled={disconnectLoading}
        >
          {disconnectLoading ? "Logging out..." : "Logout"}
        </button>
      )}
      {connectError && <div className="error">{connectError.message}</div>}
      {disconnectError && <div className="error">{disconnectError.message}</div>}
      <h3>{address}</h3>
      {isConnected && (
        <section className="App-section">
          <button className="home-button" style={styles.ButtonStyledStyle} onClick={() => window.FloatingInbox.open()}>
            Open
          </button>
          <button className="home-button" style={{ ...styles.ButtonStyledStyle, marginLeft: 10 }} onClick={() => window.FloatingInbox.close()}>
            Close
          </button>
        </section>
      )}
      {isConnected && <FloatingInbox wallet={wallet} onLogout={() => disconnect()} />}
    </div>
  );
}

export default App;
