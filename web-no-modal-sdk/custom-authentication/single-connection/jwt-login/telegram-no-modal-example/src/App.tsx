import { useEffect, useState } from "react";
import { Web3AuthNoModal, WALLET_CONNECTORS, authConnector, AUTH_CONNECTION, WEB3AUTH_NETWORK } from "@web3auth/no-modal";
import "./App.css";
// Import RPC libraries for blockchain calls
// import RPC from "./evm.web3";
import RPC from "./evm.ethers";
import Loading from "./Loading";
// import RPC from "./evm.viem";

const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // get from https://dashboard.web3auth.io

// Initialising Web3Auth No Modal SDK
const web3auth = new Web3AuthNoModal({
  clientId, // Get your Client ID from Web3Auth Dashboard
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  authBuildEnv: "testing",
  connectors: [authConnector()],
});

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.init();
        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const onTelegramAuth = async (user: any) => {
    try {
      if (!web3auth) {
        uiConsole("Web3Auth No Modal SDK not initialized yet");
        return;
      }
      setIsLoading(true);
      
      // Get JWT token from server
      const response = await fetch("http://localhost:8080/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      
      const data = await response.json();
      if (!data.token) {
        console.error("No token found");
        setIsLoading(false);
        return;
      }
      
      await web3auth.connectTo(WALLET_CONNECTORS.AUTH, {
        authConnection: AUTH_CONNECTION.CUSTOM,
        authConnectionId: "telegram-web3auth",
        extraLoginOptions: {
          id_token: data.token,
        },
      });
      
      setIsLoading(false);
      setLoggedIn(true);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      uiConsole("Web3Auth No Modal SDK not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    if (!web3auth) {
      uiConsole("Web3Auth No Modal SDK not initialized yet");
      return;
    }
    web3auth.logout();
    setLoggedIn(false);
  };

  const getAccounts = async () => {
    if (!web3auth?.provider) {
      uiConsole("No provider found");
      return;
    }
    const rpc = new RPC(web3auth.provider);
    const userAccount = await rpc.getAccounts();
    uiConsole(userAccount);
  };

  const getBalance = async () => {
    if (!web3auth?.provider) {
      uiConsole("No provider found");
      return;
    }
    const rpc = new RPC(web3auth.provider);
    const balance = await rpc.getBalance();
    uiConsole(balance);
  };

  const signMessage = async () => {
    if (!web3auth?.provider) {
      uiConsole("No provider found");
      return;
    }
    const rpc = new RPC(web3auth.provider);
    const result = await rpc.signMessage();
    uiConsole(result);
  };

  const sendTransaction = async () => {
    if (!web3auth?.provider) {
      uiConsole("No provider found");
      return;
    }
    const rpc = new RPC(web3auth.provider);
    const result = await rpc.signAndSendTransaction();
    uiConsole(result);
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

  const loginView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={getUserInfo} className="card">
            User Info
          </button>
        </div>
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Account Address
          </button>
        </div>
        <div>
          <button onClick={getBalance} className="card">
            Balance
          </button>
        </div>
        <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={sendTransaction} className="card">
            Send Transaction
          </button>
        </div>
      </div>

      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}>Logged in Successfully!</p>
      </div>
    </>
  );

  const logoutView = (
    <>
      <button onClick={onTelegramAuth} className="card">
        Login with Telegram
      </button>
    </>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/no-modal" rel="noreferrer">
          Web3Auth
        </a>{" "}
        & Telegram Login Demo
      </h1>

      <div className="grid">{loggedIn ? loginView : logoutView}</div>
      {isLoading ? <Loading /> : <div className="grid">{web3auth ? (loggedIn ? loginView : logoutView) : null}</div>}

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-no-modal-sdk/custom-authentication/single-verifier-examples/telegram-no-modal-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
        <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FWeb3Auth%2Fweb3auth-pnp-examples%2Ftree%2Fmain%2Fweb-no-modal-sdk%2Fcustom-authentication%2Fsingle-verifier-examples%2Ftelegram-no-modal-example&project-name=w3a-telegram-no-modal&repository-name=w3a-telegram-no-modal">
          <img src="https://vercel.com/button" alt="Deploy with Vercel" />
        </a>
      </footer>
    </div>
  );
}

export default App;
