import { useEffect, useState } from "react";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { WALLET_ADAPTERS, IProvider, WEB3AUTH_NETWORK, UX_MODE, getEvmChainConfig } from "@web3auth/base";
import { AuthAdapter } from "@web3auth/auth-adapter";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import "./App.css";
//import RPC from "./evm.web3";
// import RPC from './evm.ethers';
import RPC from "./evm.viem";

const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // get from https://dashboard.web3auth.io

function App() {
  const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(false);

  useEffect(() => {
    const init = async () => {
      try {
        // Get custom chain configs for your chain from https://web3auth.io/docs/connect-blockchain
        const chainConfig = getEvmChainConfig(0x13881, clientId)!;

        const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

        const web3auth = new Web3AuthNoModal({
          clientId, // get from https://dashboard.web3auth.io
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
          privateKeyProvider,
        });

        const authAdapter = new AuthAdapter({
          adapterSettings: {
            clientId,
            uxMode: UX_MODE.REDIRECT,
            loginConfig: {
              google: {
                verifier: "aggregate-sapphire",
                verifierSubIdentifier: "w3a-google",
                typeOfLogin: "google",
                clientId: "519228911939-cri01h55lsjbsia1k7ll6qpalrus75ps.apps.googleusercontent.com",
              },
              auth0github: {
                verifier: "aggregate-sapphire",
                verifierSubIdentifier: "w3a-a0-github",
                typeOfLogin: "jwt",
                clientId: "hiLqaop0amgzCC0AXo4w0rrG9abuJTdu",
              },
              facebook: {
                verifier: "aggregate-sapphire",
                verifierSubIdentifier: "w3a-facebook",
                typeOfLogin: "facebook",
                clientId: "1222658941886084",
              },
              auth0emailpasswordless: {
                verifier: "aggregate-sapphire",
                verifierSubIdentifier: "w3a-a0-email-passwordless",
                typeOfLogin: "jwt",
                clientId: "QiEf8qZ9IoasbZsbHvjKZku4LdnRC1Ct",
              },
              auth0Google: {
                verifier: "aggregate-sapphire",
                verifierSubIdentifier: "w3a-a0-google",
                typeOfLogin: "jwt",
                clientId: "hiLqaop0amgzCC0AXo4w0rrG9abuJTdu",
              },
            },
          },
        });
        web3auth.configureAdapter(authAdapter);
        setWeb3auth(web3auth);

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

  const loginGoogle = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.AUTH, {
      loginProvider: "google",
    });
    setProvider(web3authProvider);
  };

  const loginAuth0EmailPasswordless = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.AUTH, {
      loginProvider: "auth0emailpasswordless",
      extraLoginOptions: {
        domain: "https://web3auth.au.auth0.com",
        // this corresponds to the field inside jwt which must be used to uniquely
        // identify the user. This is mapped b/w google and email passwordless logins of Auth0
        verifierIdField: "email",
        isVerifierIdCaseSensitive: false,
      },
    });
    setProvider(web3authProvider);
  };

  const loginAuth0Google = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.AUTH, {
      loginProvider: "auth0Google",
      extraLoginOptions: {
        domain: "https://web3auth.au.auth0.com",
        // this corresponds to the field inside jwt which must be used to uniquely
        // identify the user. This is mapped b/w google and email passwordless logins of Auth0
        verifierIdField: "email",
        isVerifierIdCaseSensitive: false,
        connection: "google-oauth2",
      },
    });
    setProvider(web3authProvider);
  };

  const loginAuth0GitHub = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.AUTH, {
      loginProvider: "auth0github",
      extraLoginOptions: {
        domain: "https://web3auth.au.auth0.com",
        // this corresponds to the field inside jwt which must be used to uniquely
        // identify the user. This is mapped b/w google and github logins
        verifierIdField: "email",
        isVerifierIdCaseSensitive: false,
        connection: "github",
      },
    });
    setProvider(web3authProvider);
  };

  const loginFacebook = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.AUTH, {
      loginProvider: "facebook",
    });
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
    setLoggedIn(false);
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
      <button onClick={loginAuth0Google} className="card">
        Login using <b>Google</b> [ via Auth0 ]
      </button>
      <button onClick={loginAuth0GitHub} className="card">
        Login using <b>GitHub</b> [ via Auth0 ]
      </button>
      <button onClick={loginFacebook} className="card">
        Login using <b>Facebook</b>
      </button>
    </>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/no-modal" rel="noreferrer">
          Web3Auth
        </a>{" "}
        Aggregate Verifier Example in React
      </h1>
      <h3 className="sub-title">Aggregate Verifier - Google, Email Passwordless, Discord & GitHub</h3>

      <h6 className="center">
        Logging in with any of the below login methods will return the same wallet address. Provided, you have the same email address for all the
        logins.
      </h6>

      <div className="grid">{loggedIn ? loginView : logoutView}</div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-no-modal-sdk/custom-authentication/aggregate-verifier-examples/auth0-google-aggregate-no-modal-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
        <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FWeb3Auth%2Fweb3auth-pnp-examples%2Ftree%2Fmain%2Fweb-no-modal-sdk%2Fcustom-authentication%2Faggregate-verifier-examples%2Fauth0-google-aggregate-no-modal-example&project-name=w3a-auth0-aggregate-no-modal&repository-name=w3a-auth0-aggregate-no-modal">
          <img src="https://vercel.com/button" alt="Deploy with Vercel" />
        </a>
      </footer>
    </div>
  );
}

export default App;
