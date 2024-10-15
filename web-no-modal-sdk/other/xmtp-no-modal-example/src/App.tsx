import { CHAIN_NAMESPACES, IProvider, WALLET_ADAPTERS, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { AuthAdapter } from "@web3auth/auth-adapter";
import { useEffect, useState } from "react";
import { FloatingInbox } from "./FloatingInbox";
import { ethers, JsonRpcSigner } from "ethers";

const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // get from https://dashboard.web3auth.io

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x1",
  rpcTarget: "https://rpc.ankr.com/eth",
  // Avoid using public rpcTarget in production.
  // Use services like Infura, Quicknode etc
  displayName: "Ethereum Mainnet",
  blockExplorerUrl: "https://etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

declare global {
  interface Window {
    FloatingInbox: {
      open: () => void;
      close: () => void;
    }
  }
}

const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

const web3auth = new Web3AuthNoModal({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  privateKeyProvider,
});

const authAdapter = new AuthAdapter();
web3auth.configureAdapter(authAdapter);

function App() {
  const isPWA = true;
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [wallet, setWallet] = useState<any | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.init();
        setProvider(web3auth.provider);

        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  useEffect(() => {
    const getDetails = async () => {
      if (web3auth.connected) {
        const address = await getAccounts();
        setAddress(address);
        const wallet = await getWallet();
        setWallet(wallet);
      }
    }
    getDetails();
  }, [provider, loggedIn]);

  const login = async () => {
    const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.AUTH, {
      loginProvider: "google",
    });
    setProvider(web3authProvider);
    if (web3auth.connected) {
      setLoggedIn(true);
    }
  };

  const getWallet = async (): Promise<JsonRpcSigner | null> => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return null;
    }
    const ethersProvider = new ethers.BrowserProvider(provider);

    return ethersProvider.getSigner();
  }

  const getAccounts = async (): Promise<any> => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();

      // Get user's Ethereum public address
      const address = signer.getAddress();

      return await address;
    } catch (error) {
      return error;
    }
  }

  const logout = async () => {
    await web3auth.logout();
    setProvider(null);
    setWallet(null);
    setLoggedIn(false);
    uiConsole("logged out");
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
      console.log(...args);
    }
  }

  const styles: any = {
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
        onClick={() => login()}
      >
        {loggedIn ? "Connected" : "Login with Google"}
      </button>
      {loggedIn && (
        <button
          className="home-button"
          style={{ ...styles.ButtonStyledStyle, marginLeft: 10 }}
          onClick={() => logout()}
        >
          Logout
        </button>
      )}
      <h3>{address}</h3>
      {loggedIn && (
        <section className="App-section">
          <button
            className="home-button"
            style={styles.ButtonStyledStyle}
            onClick={() => window.FloatingInbox.open()}
          >
            Open
          </button>
          <button
            className="home-button"
            style={{ ...styles.ButtonStyledStyle, marginLeft: 10 }}
            onClick={() => window.FloatingInbox.close()}
          >
            Close
          </button>
        </section>
      )}
      {loggedIn && (
        <FloatingInbox wallet={wallet} onLogout={logout} />
      )}
    </div>
  );
}

export default App;
