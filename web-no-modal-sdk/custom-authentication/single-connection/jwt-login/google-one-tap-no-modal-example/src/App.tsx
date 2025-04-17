import { useEffect, useState } from "react";
import { Web3AuthNoModal, WALLET_CONNECTORS, AUTH_CONNECTION, WEB3AUTH_NETWORK } from "@web3auth/no-modal";
import "./App.css";
// Import RPC libraries for blockchain calls
// import RPC from "./evm.web3";
import RPC from "./evm.ethers";
// import RPC from "./evm.viem";

const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // get from https://dashboard.web3auth.io

declare global {
  interface Window {
    google: any;
  }
}

// Initialising Web3Auth No Modal SDK
const web3auth = new Web3AuthNoModal({
  clientId, // Get your Client ID from Web3Auth Dashboard
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  authBuildEnv: "testing",
});

function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

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

      // Load Google One Tap script
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    };

    init();
  }, []);

  useEffect(() => {
    if (window.google && !loggedIn) {
      window.google.accounts.id.initialize({
        client_id: "461819774167-3n0b5lkkdt3e23jlhb0q2rb4nj3c4k6f.apps.googleusercontent.com",
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: false,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("googleOneTap"),
        { theme: "outline", size: "large", width: "100%" }
      );
      window.google.accounts.id.prompt();
    }
  }, [window.google, loggedIn]);

  const handleCredentialResponse = async (response: any) => {
    try {
      if (!web3auth) {
        uiConsole("Web3Auth No Modal SDK not initialized yet");
        return;
      }
      setIsLoggingIn(true);
      
      const idToken = response.credential;
      
      await web3auth.connectTo(WALLET_CONNECTORS.AUTH, {
        authConnection: AUTH_CONNECTION.CUSTOM,
        authConnectionId: "google-one-tap",
        extraLoginOptions: {
          id_token: idToken,
        },
      });
      
      setIsLoggingIn(false);
      setLoggedIn(true);
    } catch (error) {
      setIsLoggingIn(false);
      console.error(error);
    }
  };

  const authenticateUser = async () => {
    if (!web3auth) {
      uiConsole("Web3Auth No Modal SDK not initialized yet");
      return;
    }
    const idToken = await web3auth.authenticateUser();
    uiConsole(idToken);
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
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={authenticateUser} className="card">
            Get ID Token
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={getBalance} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>

      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
    </>
  );

  const logoutView = (
    <>
      <button onClick={logout} className="card">
        Log Out
      </button>
    </>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/core-kit/sfa-web" rel="noreferrer">
          Web3Auth
        </a>{" "}
        SFA React Google + Passkeys Example
      </h1>

      <p className="grid">Sign in with Google and register passkeys before doing Login with Passkey</p>

      {isLoggingIn ? <Loading /> : <div className="grid">{loggedIn ? loginView : logoutView}</div>}

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-core-kit-examples/tree/main/single-factor-auth-web/sfa-web-google-example"
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
