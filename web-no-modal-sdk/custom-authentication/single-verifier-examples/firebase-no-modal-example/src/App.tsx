import { useEffect, useState } from "react";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { WALLET_ADAPTERS, CHAIN_NAMESPACES, WEB3AUTH_NETWORK, UX_MODE } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { auth } from "./FireBaseConfig";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { GoogleAuthProvider, TwitterAuthProvider, signInWithPopup } from "firebase/auth";

import "./App.css";
// import RPC from "./evm.ethers";
// import RPC from "./evm.web3";
import RPC from "./evm.viem";

const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // get from https://dashboard.web3auth.io

function App() {
  const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: "0x1", // Please use 0x1 for Mainnet
          rpcTarget: "https://rpc.ankr.com/eth",
          displayName: "Ethereum Mainnet",
          blockExplorerUrl: "https://etherscan.io/",
          ticker: "ETH",
          tickerName: "Ethereum",
          logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
        };

        const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

        const web3auth = new Web3AuthNoModal({
          clientId,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
          privateKeyProvider,
        });

        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: {
            uxMode: UX_MODE.REDIRECT,
            loginConfig: {
              jwt: {
                verifier: "w3a-firebase-demo",
                typeOfLogin: "jwt",
                clientId,
              },
            },
          },
        });
        web3auth.configureAdapter(openloginAdapter);

        const sfaAdapter = new SFAAdapter();
        web3auth.configureAdapter(sfaAdapter);
        setWeb3auth(web3auth);

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
      const googleProvider = new GoogleAuthProvider();
      const loginRes = await signInWithPopup(auth, googleProvider);
      console.log("login details", loginRes);
      const idToken = await loginRes.user.getIdToken(true);
      console.log("idToken", idToken);

      // check if mfa is enabled
      const check = web3auth.checkMfa(verifier, verifierIdValue); // works like lookup API and checks if isMfaEnabled is true or false/ basically if the nonce exists or not
      // login using sfa adapter if mfa not setup
      if (check === false) {
        web3auth?.connectTo(WALLET_ADAPTERS.SFA, {
          verifier, verifierIdValue, idToken});
      } else {
      // login using openlogin adapter if mfa is enabled
      await web3auth?.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
        loginProvider: "jwt",
        extraLoginOptions: {
          id_token: idToken,
          verifierIdField: "sub",
          domain: "http://localhost:3000",
        },
      });
    }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const signInWithTwitter = async () => {
    try {
      const twitterProvider = new TwitterAuthProvider();
      const loginRes = await signInWithPopup(auth, twitterProvider);
      if (!web3auth) {
        uiConsole("web3auth not initialized yet");
        return;
      }
      console.log("login details", loginRes);
      const idToken = await loginRes.user.getIdToken(true);
      console.log("idToken", idToken);

      await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
        loginProvider: "jwt",
        extraLoginOptions: {
          id_token: idToken,
          verifierIdField: "sub",
          domain: "http://localhost:3000",
        },
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // const login = async () => {
  //   if (!web3auth) {
  //     uiConsole("web3auth not initialized yet");
  //     return;
  //   }
  //   const loginRes = await signInWithGoogle();
  //   console.log("login details", loginRes);
  //   const idToken = await loginRes.user.getIdToken(true);
  //   console.log("idToken", idToken);

  //   const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
  //     loginProvider: "jwt",
  //     extraLoginOptions: {
  //       id_token: idToken,
  //       verifierIdField: "sub",
  //       domain: "http://localhost:3000",
  //     },
  //   });
  //   setProvider(web3authProvider);
  // };

  const authenticateUser = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const idToken = await web3auth.authenticateUser();
    uiConsole(idToken);
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setLoggedIn(false);
  };

  const getAccounts = async () => {
    if (!web3auth?.provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(web3auth?.provider);
    const userAccount = await rpc.getAccounts();
    uiConsole(userAccount);
  };

  const getBalance = async () => {
    if (!web3auth?.provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(web3auth?.provider);
    const balance = await rpc.getBalance();
    uiConsole(balance);
  };

  const signMessage = async () => {
    if (!web3auth?.provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(web3auth?.provider);
    const result = await rpc.signMessage();
    uiConsole(result);
  };

  const sendTransaction = async () => {
    if (!web3auth?.provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(web3auth?.provider);
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
