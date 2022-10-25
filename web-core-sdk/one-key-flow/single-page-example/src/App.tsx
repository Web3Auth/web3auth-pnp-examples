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
import Torus from "@toruslabs/torus.js";
import NodeDetailManager from "@toruslabs/fetch-node-details";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { subkey } from "@toruslabs/openlogin-subkey";

const TORUS_NETWORK = {
  TESTNET: "testnet",
  MAINNET: "mainnet",
  CYAN: "cyan",
};

export const CONTRACT_MAP = {
  [TORUS_NETWORK.MAINNET]: NodeDetailManager.PROXY_ADDRESS_MAINNET,
  [TORUS_NETWORK.TESTNET]: NodeDetailManager.PROXY_ADDRESS_TESTNET,
  [TORUS_NETWORK.CYAN]: NodeDetailManager.PROXY_ADDRESS_CYAN,
};

export const NETWORK_MAP = {
  [TORUS_NETWORK.MAINNET]: "https://rpc.ankr.com/eth",
  [TORUS_NETWORK.TESTNET]: "https://rpc.ankr.com/eth_ropsten",
  [TORUS_NETWORK.CYAN]: "https://rpc.ankr.com/polygon",
};

const network = NETWORK_MAP[TORUS_NETWORK.TESTNET];
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
  const [web3auth, setWeb3auth] = useState<Web3AuthCore | null>(null);
  const [usesTorus, setUsesTorus] = useState(false);
  const [torus, setTorus] = useState<Torus | any>(null);
  const [nodeDetailManager, setNodeDetailManager] = useState<
    NodeDetailManager | any
  >(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );
  const [idToken, setIdToken] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Initialising Web3Auth
        const web3auth = new Web3AuthCore({
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
        web3auth.configureAdapter(openloginAdapter);
        setWeb3auth(web3auth);
        await web3auth.init();

        // Instantiating Torus for One Key Flow
        const torus = new Torus({
          enableOneKey: true,
          network,
        });
        setTorus(torus);

        const nodeDetailManager = new NodeDetailManager({
          network,
          proxyAddress: CONTRACT_MAP[TORUS_NETWORK.TESTNET],
        });
        setNodeDetailManager(nodeDetailManager);

        if (web3auth.provider) {
          setProvider(web3auth.provider);
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
    if (!web3auth) {
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

    // get details of the node shares on the torus network
    const { torusNodeEndpoints, torusNodePub, torusIndexes } =
      await nodeDetailManager.getNodeDetails({ verifier, verifierId: sub });
    const userDetails = await torus.getUserTypeAndAddress(
      torusNodeEndpoints,
      torusNodePub,
      { verifier, verifierId: sub },
      true
    );

    // check if the user hasn't enabled one key login
    if (userDetails.typeOfUser === "v2" && !userDetails.upgraded) {
      // if YES, login directly with the torus libraries within your app
      const keyDetails = await torus.retrieveShares(
        torusNodeEndpoints,
        torusIndexes,
        verifier,
        { verifier_id: sub },
        idToken,
        {}
      );
      // use the private key to get the provider
      const finalPrivKey = subkey(
        keyDetails.privKey.padStart(64, "0"),
        Buffer.from(clientId, "base64")
      ).padStart(64, "0");
      const ethereumPrivateKeyProvider = new EthereumPrivateKeyProvider({
        config: {
          chainConfig,
        },
      });
      await ethereumPrivateKeyProvider.setupProvider(finalPrivKey);
      setProvider(ethereumPrivateKeyProvider.provider);
      setUsesTorus(true);
    } else {
      // if NO, login with web3auth
      const web3authProvider = await web3auth.connectTo(
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
      setUsesTorus(false);
    }
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    if (usesTorus) {
      uiConsole(
        "You are directly using Torus Libraries to login the user, hence the Web3Auth <code>getUserInfo</code> function won't work for you. Get the user details directly from id token.",
        parseToken(idToken)
      );
      return;
    }
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const authenticateUser = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    if (usesTorus) {
      uiConsole(
        "You are directly using Torus Libraries to login the user, hence the Web3Auth <code>authenticateUser</code> function won't work for you. For server side verification, directly use your login provider and id token. <br/><br/> You can use the Firebase Id Token for example in this case. <br/>",
        idToken
      );
      return;
    }
    const id_token = await web3auth.authenticateUser();
    // console.log(JSON.stringify(user, null, 2))
    uiConsole(
      "Id Token:",
      id_token,
      "You can use this id token from Web3Auth for server side verification from your own end, visit the web3auth documentation for more information."
    );
  };

  const logout = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    if (usesTorus) {
      console.log(
        "You are directly using Torus Libraries to login the user, hence the Web3Auth logout function won't work for you. You can logout the user directly from your login provider, or just clear the provider object."
      );
      setProvider(null);
      return;
    }
    await web3auth.logout();
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
          <button onClick={authenticateUser} className="card">
            Server Side Verification
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
        {web3auth && torus ? (provider ? loginView : logoutView) : null}
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
