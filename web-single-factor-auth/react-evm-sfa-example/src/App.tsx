import { useEffect, useState } from "react";

// Import Single Factor Auth SDK for no redirect flow
import { Web3Auth } from "@web3auth/single-factor-auth";

// Import Web3Auth Core SDK for redirect in case of users who have enabled MFA
import { Web3AuthCore } from "@web3auth/core";
import {
  WALLET_ADAPTERS,
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
  WalletLoginError,
} from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";

// RPC libraries for blockchain calls
// import RPC from "./evm.web3";
import RPC from "./evm.ethers";

// Firebase libraries for custom authentication
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";

import "./App.css";

const verifier = "web3auth-firebase-examples";

const clientId =
  "BEglQSgt4cUWcj6SKRdu5QkOXTsePmMcusG5EAoyjyOYKlVRjIF1iCNnMOTfpzCiunHRrMui8TIwQPXdkQ8Yxuk"; // get from https://dashboard.web3auth.io

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x5",
  rpcTarget: "https://rpc.ankr.com/eth_goerli",
  displayName: "Goerli Testnet",
  blockExplorer: "https://goerli.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
};

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0nd9YsPLu-tpdCrsXn8wgsWVAiYEpQ_E",
  authDomain: "web3auth-oauth-logins.firebaseapp.com",
  projectId: "web3auth-oauth-logins",
  storageBucket: "web3auth-oauth-logins.appspot.com",
  messagingSenderId: "461819774167",
  appId: "1:461819774167:web:e74addfb6cc88f3b5b9c92",
};

function App() {
  const [web3authCore, setWeb3authCore] = useState<Web3AuthCore | null>(null);
  const [web3authSFAuth, setWeb3authSFAuth] = useState<Web3Auth | null>(null);
  const [usesSfaSDK, setUsesSfaSDK] = useState(false);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );
  const [idToken, setIdToken] = useState<string | null>(null);
  const app = initializeApp(firebaseConfig);

  useEffect(() => {
    const init = async () => {
      try {
        // Initialising Web3Auth Single Factor Auth SDK
        const web3authSfa = new Web3Auth({
          clientId, // Get your Client ID from Web3Auth Dashboard
          chainConfig,
        });
        setWeb3authSFAuth(web3authSfa);
        await web3authSfa.init({
          network: "cyan",
        });

        // Initialising Web3Auth Core SDK
        const web3authCore = new Web3AuthCore({
          clientId,
          chainConfig,
        });

        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: {
            network: "cyan",
            loginConfig: {
              jwt: {
                name: "Web3Auth One Key Login Flow",
                verifier,
                typeOfLogin: "jwt",
                clientId,
              },
            },
          },
        });
        web3authCore.configureAdapter(openloginAdapter);
        setWeb3authCore(web3authCore);
        await web3authCore.init();

        if (web3authCore.provider) {
          setProvider(web3authCore.provider);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const signInWithGoogle = async (): Promise<UserCredential> => {
    try {
      const auth = getAuth(app);
      const googleProvider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, googleProvider);
      console.log(res);
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const parseToken = (token: any) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace("-", "+").replace("_", "/");
      return JSON.parse(window.atob(base64 || ""));
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const login = async () => {
    // login with firebase
    const loginRes = await signInWithGoogle();
    // get the id token from firebase
    const idToken = await loginRes.user.getIdToken(true);
    setIdToken(idToken);

    // trying logging in with the Single Factor Auth SDK
    try {
      if (!web3authSFAuth) {
        uiConsole("Web3Auth Single Factor Auth SDK not initialized yet");
        return;
      }
      
      // get sub value from firebase id token
      const { sub } = parseToken(idToken);

      const web3authSfaprovider = await web3authSFAuth.connect({
        verifier,
        verifierId: sub,
        idToken,
      });
      if (web3authSfaprovider) {
        setProvider(web3authSfaprovider);
      }
      setUsesSfaSDK(true);
    } catch (err) {
      // Single Factor Auth SDK throws an error if the user has already enabled MFA
      // We will try to use the Web3AuthCore SDK to handle this case

      if (err instanceof WalletLoginError && err.code === 5115) {
        try {
          if (!web3authCore) {
            uiConsole("Web3Auth Core SDK not initialized yet");
            return;
          }
          const web3authProvider = await web3authCore.connectTo(
            WALLET_ADAPTERS.OPENLOGIN,
            {
              loginProvider: "jwt",
              extraLoginOptions: {
                id_token: idToken,
                verifierIdField: "sub",
                domain: "http://localhost:3000",
              },
            }
          );
          setProvider(web3authProvider);
          setUsesSfaSDK(false);
        } catch (err) {
          console.error(err);
          uiConsole(err);
        }
      } else {
        console.error(err);
        uiConsole(err);
      }
    }
  };

  const getUserInfo = async () => {
    if (usesSfaSDK) {
      uiConsole(
        "You are directly using Single Factor Auth SDK to login the user, hence the Web3Auth <code>getUserInfo</code> function won't work for you. Get the user details directly from id token.",
        parseToken(idToken)
      );
      return;
    }
    if (!web3authCore) {
      uiConsole("Web3Auth Core SDK not initialized yet");
      return;
    }
    const user = await web3authCore.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    if (usesSfaSDK) {
      console.log(
        "You are directly using Single Factor Auth SDK to login the user, hence the Web3Auth logout function won't work for you. You can logout the user directly from your login provider, or just clear the provider object."
      );
      setProvider(null);
      return;
    }
    if (!web3authCore) {
      uiConsole("Web3Auth Core SDK not initialized yet");
      return;
    }
    await web3authCore.logout();
    setProvider(null);
  };

  const enableMfa = async () => {
    if (!web3authCore) {
      uiConsole("Web3Auth Core SDK not initialized yet");
      return;
    }
    const auth = getAuth(app);
    const user = auth.currentUser;
    // user
    if (!user) {
      uiConsole("User ID Token not found");
      return;
    }
    const idToken = await user.getIdToken(true);
  
    // web3auth instance must be initialized before calling this function
    // as decribed in login with mfa flow above
    const web3AuthProvider = await web3authCore.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
      loginProvider: "jwt",
      extraLoginOptions: {
        id_token: idToken,
        verifierIdField: "sub",
        domain: window.location.origin,
      },
      mfaLevel: "optional",
    });
    return web3AuthProvider;
  };

  const getAccounts = async () => {
    if (!provider) {
      uiConsole("No provider found");
      return;
    }
    const rpc = new RPC(provider);
    const userAccount = await rpc.getAccounts();
    uiConsole(userAccount);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("No provider found");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    uiConsole(balance);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("No provider found");
      return;
    }
    const rpc = new RPC(provider);
    const result = await rpc.signMessage();
    uiConsole(result);
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("No provider found");
      return;
    }
    const rpc = new RPC(provider);
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
        {
          usesSfaSDK ? (
            <div>
            <button onClick={enableMfa} className="card">
              Enable MFA
            </button>
          </div>
          ) : null
        }
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
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
    </>
  );

  const logoutView = (
    <button onClick={login} className="card">
      Login
    </button>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="http://web3auth.io/" rel="noreferrer">
          Web3Auth
        </a>{" "}
        One Key Login Flow (without Openlogin Redirect)
      </h1>

      <div className="grid">
        {web3authCore && web3authSFAuth
          ? provider
            ? loginView
            : logoutView
          : null}
      </div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/examples/tree/master/single-factor-auth/one-key-flow/react-single-factor-auth-evm-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
        <a
          href="https://faucet.egorfine.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ropsten Faucet
        </a>
      </footer>
    </div>
  );
}

export default App;
