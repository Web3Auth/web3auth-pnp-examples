import { useEffect, useState } from "react";
import { Web3AuthCore } from "@web3auth/core";
import {
  WALLET_ADAPTERS,
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
} from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import "./App.css";
// import RPC from "./evm.web3";
import RPC from "./evm.ethers";
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";
import { Web3Auth } from "@web3auth/node-sdk";

const verifier = "web3auth-core-firebase";

const clientId =
  "BKjpD5DNAFDbX9Ty9RSBAXdQP8YDY1rldKqKCgbxxa8JZODZ8zxVRzlT74qRIHsor5aIwZ55dQVlcmrwJu37PI8"; // get from https://dashboard.web3auth.io

const chainConfig = {
  chainId: "0x3",
  rpcTarget: "https://rpc.ankr.com/eth_ropsten",
  displayName: "Ropsten Testnet",
  blockExplorer: "https://ropsten.etherscan.io/",
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
  const [web3authcore, setWeb3authCore] = useState<Web3AuthCore | null>(null);
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [usesNodeJSsdk, setUsesNodeJSsdk] = useState(false);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );
  const [idToken, setIdToken] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Initialising Web3Auth
        const web3authcore = new Web3AuthCore({
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
        web3authcore.configureAdapter(openloginAdapter);
        setWeb3authCore(web3authcore);
        await web3authcore.init();

        const web3auth = new Web3Auth({
          clientId, // Get your Client ID from Web3Auth Dashboard
          chainConfig: {
            chainNamespace: "eip155",
            chainId: "0x1",
            rpcTarget: "https://rpc.ankr.com/eth", // needed for non-other chains
          },
        });
        setWeb3auth(web3auth);

        await web3auth.init({
          network: "testnet",
        });

        if (web3authcore.provider) {
          setProvider(web3authcore.provider);
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
    if (!web3authcore) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    // login with firebase
    const loginRes = await signInWithGoogle();
    // get the id token from firebase
    const idToken = await loginRes.user.getIdToken(true);
    setIdToken(idToken);

    // get sub value from firebase id token
    const { sub } = parseToken(idToken);

    // logging in with the NodeJS SDK
    try {
      const web3authnodeprovider = await web3auth?.connect({
        verifier,
        verifierId: sub,
        idToken,
      });
      if (web3authnodeprovider) {
        setProvider(web3authnodeprovider);
      }
      setUsesNodeJSsdk(true);
    } catch (err) {
      // NodeJS SDK throws an error if the user has already enabled MFA
      // We can use the Web3AuthCore SDK to handle this case
      const web3authProvider = await web3authcore.connectTo(
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
      setUsesNodeJSsdk(false);
    }
  };

  const getUserInfo = async () => {
    if (!web3authcore) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    if (usesNodeJSsdk) {
      uiConsole(
        "You are directly using NodeJS SDK to login the user, hence the Web3Auth <code>getUserInfo</code> function won't work for you. Get the user details directly from id token.",
        parseToken(idToken)
      );
      return;
    }
    const user = await web3authcore.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    if (!web3authcore) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    if (usesNodeJSsdk) {
      console.log(
        "You are directly using NodeJS SDK to login the user, hence the Web3Auth logout function won't work for you. You can logout the user directly from your login provider, or just clear the provider object."
      );
      setProvider(null);
      return;
    }
    await web3authcore.logout();
    setProvider(null);
  };

  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const userAccount = await rpc.getAccounts();
    uiConsole(userAccount);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    uiConsole(balance);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const result = await rpc.signMessage();
    uiConsole(result);
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
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
        {web3authcore && web3auth ? (provider ? loginView : logoutView) : null}
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
