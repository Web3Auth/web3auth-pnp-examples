import { useEffect, useState } from "react";

// Import Node SDK for no redirect flow
import { Web3Auth } from "@web3auth/node-sdk";

// Import Web3Auth Core SDK for redirect in case of users who have enabled MFA
import { Web3AuthCore } from "@web3auth/core";
import {
  WALLET_ADAPTERS,
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
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

const verifier = "web3auth-core-firebase";

const clientId =
  "BHr_dKcxC0ecKn_2dZQmQeNdjPgWykMkcodEHkVvPMo71qzOV6SgtoN8KCvFdLN7bf34JOm89vWQMLFmSfIo84A"; // get from https://dashboard.web3auth.io

const chainConfig = {
  chainId: "0x1",
  rpcTarget: "https://rpc.ankr.com/eth",
  displayName: "Ethereum Mainnet",
  blockExplorer: "https://etherscan.io/",
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
  const [web3authNode, setWeb3authNode] = useState<Web3Auth | null>(null);
  const [usesNodeSDK, setUsesNodeSDK] = useState(false);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );
  const [idToken, setIdToken] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Initialising Web3Auth Node SDK
        const web3authNode = new Web3Auth({
          clientId, // Get your Client ID from Web3Auth Dashboard
          chainConfig: {
            chainNamespace: "eip155",
            chainId: "0x1",
            rpcTarget: "https://rpc.ankr.com/eth", // needed for non-other chains
          },
        });
        setWeb3authNode(web3authNode);
        await web3authNode.init({
          network: "testnet",
        });

        // Initialising Web3Auth Core SDK
        const web3authCore = new Web3AuthCore({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            ...chainConfig,
          },
        });

        const openloginAdapter = new OpenloginAdapter({
          loginSettings: {
            mfaLevel: "default",
          },
          adapterSettings: {
            network: "testnet",
            uxMode: "redirect",
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
      const app = initializeApp(firebaseConfig);
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
      const base64Url = token?.split(".")[1];
      const base64 = base64Url?.replace("-", "+").replace("_", "/");
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

    // trying logging in with the NodeJS SDK
    try {
      // get sub value from firebase id token
      const { sub } = parseToken(idToken);

      const web3authNodeprovider = await web3authNode?.connect({
        verifier,
        verifierId: sub,
        idToken,
      });
      if (web3authNodeprovider) {
        setProvider(web3authNodeprovider);
      }
      setUsesNodeSDK(true);
    } catch (err) {
      // NodeJS SDK throws an error if the user has already enabled MFA
      // We will try to use the Web3AuthCore SDK to handle this case
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
        setUsesNodeSDK(false);
      } catch (err) {
        console.error(err);
        uiConsole(err);
      }
    }
  };

  const getUserInfo = async () => {
    if (usesNodeSDK) {
      uiConsole(
        "You are directly using NodeJS SDK to login the user, hence the Web3Auth <code>getUserInfo</code> function won't work for you. Get the user details directly from id token.",
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
    if (usesNodeSDK) {
      console.log(
        "You are directly using NodeJS SDK to login the user, hence the Web3Auth logout function won't work for you. You can logout the user directly from your login provider, or just clear the provider object."
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
        {web3authCore && web3authNode ? (provider ? loginView : logoutView) : null}
      </div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/examples/tree/master/one-key-flow-core-react-example"
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
