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
// import RPC from './evm.ethers';
import RPC from "./solanaRPC";

const clientId =
  "BG7vMGIhzy7whDXXJPZ-JHme9haJ3PmV1-wl9SJPGGs9Cjk5_8m682DJ-lTDmwBWJe-bEHYE_t9gw0cdboLEwR8"; // get from https://dashboard.web3auth.io

const solanaChainConfig = {
  chainNamespace: CHAIN_NAMESPACES.SOLANA,
  chainId: "0x3", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
  rpcTarget: "https://api.devnet.solana.com",
  displayName: "Solana Devnet",
  blockExplorer: "https://explorer.solana.com/?cluster=devnet",
  ticker: "SOL",
  tickerName: "Solana Token",
};

// const ethChainConfig = {
//   chainNamespace: CHAIN_NAMESPACES.EIP155,
//   chainId: "0x5", // Please use 0x1 for Mainnet
//   rpcTarget: "https://rpc.ankr.com/eth_goerli",
//   displayName: "Goerli Testnet",
//   blockExplorer: "https://goerli.etherscan.io/",
//   ticker: "ETH",
//   tickerName: "Ethereum",
// };

function App() {
  const [web3auth, setWeb3auth] = useState<Web3AuthCore | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3AuthCore({
          clientId, // get from https://dashboard.web3auth.io
          chainConfig: solanaChainConfig,
          web3AuthNetwork: "testnet"
        });

        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: {
            clientId,
            uxMode: "popup",
            loginConfig: {
              google: {
                verifier: "agg-google-emailpswd-github",
                verifierSubIdentifier: "w3a-google",
                typeOfLogin: "google",
                clientId:
                  "774338308167-q463s7kpvja16l4l0kko3nb925ikds2p.apps.googleusercontent.com",
              },
              auth0emailpasswordless: {
                verifier: "agg-google-emailpswd-github",
                verifierSubIdentifier: "w3a-email-passwordless",
                typeOfLogin: "jwt",
                clientId: "QQRQNGxJ80AZ5odiIjt1qqfryPOeDcb1",
                jwtParameters: {
                  domain: "https://shahbaz-torus.us.auth0.com",
                  // this corresponds to the field inside jwt which must be used to uniquely
                  // identify the user. This is mapped b/w google and email passwordless logins of Auth0
                  verifierIdField: "email",
                  isVerifierIdCaseSensitive: false,
                },
              },
              auth0github: {
                verifier: "agg-google-emailpswd-github",
                verifierSubIdentifier: "w3a-github",
                typeOfLogin: "jwt",
                clientId: "TcuxIlWeaexIhVzsyc4sShzHJxwJ7nsO",
                jwtParameters: {
                  domain: "https://shahbaz-torus.us.auth0.com",
                  // this corresponds to the field inside jwt which must be used to uniquely
                  // identify the user. This is mapped b/w google and github logins
                  verifierIdField: "email",
                  isVerifierIdCaseSensitive: false,
                },
              },
              
            },
          },
        });
        web3auth.configureAdapter(openloginAdapter);
        setWeb3auth(web3auth);

        await web3auth.init();
        if (web3auth.provider) {
          setProvider(web3auth.provider);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const loginGoogle = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connectTo(
      WALLET_ADAPTERS.OPENLOGIN,
      {
        loginProvider: "google",
      }
    );
    setProvider(web3authProvider);
  };

  const loginAuth0EmailPasswordless = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connectTo(
      WALLET_ADAPTERS.OPENLOGIN,
      {
        loginProvider: "auth0emailpasswordless",
      }
    );
    setProvider(web3authProvider);
  };

  const loginAuth0GitHub = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connectTo(
      WALLET_ADAPTERS.OPENLOGIN,
      {
        loginProvider: "auth0github",
      }
    );
    setProvider(web3authProvider);
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
    setProvider(null);
  };

  const getPrivateKey = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    uiConsole(privateKey);
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
    const result = await rpc.sendTransaction();
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
          <button onClick={getPrivateKey} className="card">
            Private Key
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
      <button onClick={loginGoogle} className="card">
        Login using <b>Google</b>
      </button>
      <button onClick={loginAuth0EmailPasswordless} className="card">
        Login using <b>Email Passwordless</b> [ via Auth0 ]
      </button>
      <button onClick={loginAuth0GitHub} className="card">
        Login using <b>GitHub</b> [ via Auth0 ]
      </button>
    </>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="http://web3auth.io/" rel="noreferrer">
          Web3Auth
        </a>{" "}
        Aggregate Verifier Example in React
      </h1>
      <h3 className="sub-title">
        Aggregate Verifier - Google, Email Passwordless & GitHub
      </h3>

      <h6 className="center">
        Logging in with any of the below login methods will return the same
        wallet address. Provided, you have the same email address for all the
        logins.
      </h6>

      <div className="grid">{provider ? loginView : logoutView}</div>

      <footer className="footer">
        <a
          href="https://github.com/web3auth/examples/web-core-sdk/custom-authentication/aggregate-verifiers/google-emailpasswordless-github-react-core-example"
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
