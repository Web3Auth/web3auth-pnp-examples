import { useEffect, useState } from "react";
import { Web3AuthNoModal, WALLET_CONNECTORS, AUTH_CONNECTION, WEB3AUTH_NETWORK } from "@web3auth/no-modal";
import { auth } from "./FireBaseConfig";
import { GoogleAuthProvider, TwitterAuthProvider, signInWithPopup } from "firebase/auth";

import "./App.css";
// import RPC from "./evm.ethers";
// import RPC from "./evm.web3";
import RPC from "./evm.viem";

const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // get from https://dashboard.web3auth.io

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
    };

    init();
  }, []);

  const signInWithGoogle = async () => {
    try {
      if (!web3auth) {
        uiConsole("Web3Auth No Modal SDK not initialized yet");
        return;
      }
      setIsLoggingIn(true);
      
      const googleProvider = new GoogleAuthProvider();
      const loginRes = await signInWithPopup(auth, googleProvider);
      const idToken = await loginRes.user.getIdToken(true);
      
      await web3auth.connectTo(WALLET_CONNECTORS.AUTH, {
        authConnection: AUTH_CONNECTION.CUSTOM,
        authConnectionId: "w3a-firebase-demo",
        extraLoginOptions: {
          id_token: idToken,
        },
      });
      
      setIsLoggingIn(false);
      setLoggedIn(true);
    } catch (err) {
      setIsLoggingIn(false);
      console.error(err);
    }
  };

  const signInWithTwitter = async () => {
    try {
      if (!web3auth) {
        uiConsole("Web3Auth No Modal SDK not initialized yet");
        return;
      }
      setIsLoggingIn(true);
      
      const twitterProvider = new TwitterAuthProvider();
      const loginRes = await signInWithPopup(auth, twitterProvider);
      const idToken = await loginRes.user.getIdToken(true);
      
      await web3auth.connectTo(WALLET_CONNECTORS.AUTH, {
        authConnection: AUTH_CONNECTION.CUSTOM,
        authConnectionId: "w3a-firebase-demo",
        extraLoginOptions: {
          id_token: idToken,
        },
      });
      
      setIsLoggingIn(false);
      setLoggedIn(true);
    } catch (err) {
      setIsLoggingIn(false);
      console.error(err);
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
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={sendTransaction} className="card">
            Send Transaction
          </button>
        </div>
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>

      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}>Logged in Successfully!</p>
      </div>
    </>
  );

  const logoutView = (
    <div className="flex-container">
      <button onClick={signInWithTwitter} className="card">
        Login with Twitter
      </button>
      <button onClick={signInWithGoogle} className="card">
        Login with Google
      </button>
    </div>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/no-modal" rel="noreferrer">
          Web3Auth
        </a>{" "}
        & Firebase React Example for Google Login
      </h1>

      <div className="grid">{loggedIn ? loginView : logoutView}</div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-no-modal-sdk/custom-authentication/single-verifier-examples/firebase-no-modal-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
        <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FWeb3Auth%2Fweb3auth-pnp-examples%2Ftree%2Fmain%2Fweb-no-modal-sdk%2Fcustom-authentication%2Fsingle-verifier-examples%2Ffirebase-no-modal-example&project-name=w3a-firebase-no-modal&repository-name=w3a-firebase-no-modal">
          <img src="https://vercel.com/button" alt="Deploy with Vercel" />
        </a>
      </footer>
    </div>
  );
}

export default App;
