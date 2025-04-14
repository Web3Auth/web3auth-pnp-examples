import { useEffect, useState } from "react";

// Import No Modal SDK instead of Single Factor Auth
import { Web3AuthNoModal, WALLET_CONNECTORS, authConnector, AUTH_CONNECTION, WEB3AUTH_NETWORK } from "@web3auth/no-modal";

// RPC libraries for blockchain calls
// import RPC from "./evm.web3";
// import RPC from "./evm.viem";
import RPC from "./evm.ethers";

import { useAuth0 } from "@auth0/auth0-react";

import Loading from "./Loading";
import "./App.css";

const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // get from https://dashboard.web3auth.io

// Initialising Web3Auth No Modal SDK
const web3auth = new Web3AuthNoModal({
  clientId, // Get your Client ID from Web3Auth Dashboard
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET, // ["cyan", "testnet"]
  authBuildEnv: "testing",
  connectors: [authConnector()],
});

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const { getIdTokenClaims, loginWithPopup } = useAuth0();

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.init();
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    // trying logging in with the No Modal SDK
    try {
      if (!web3auth) {
        uiConsole("Web3Auth No Modal SDK not initialized yet");
        return;
      }
      setIsLoading(true);
      await loginWithPopup();
      const id_token = (await getIdTokenClaims())?.__raw.toString();
      if (!id_token) {
        console.error("No id token found");
        return;
      }
      
      await web3auth.connectTo(WALLET_CONNECTORS.AUTH, {
        authConnection: AUTH_CONNECTION.CUSTOM,
        authConnectionId: "w3a-auth0-demo",
        extraLoginOptions: {
          id_token,
        },
      });
      
      setIsLoading(false);
      setLoggedIn(true);
    } catch (err) {
      setIsLoading(false);
      console.error(err);
    }
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      uiConsole("Web3Auth No Modal SDK not initialized yet");
      return;
    }
    const userInfo = await web3auth.getUserInfo();
    uiConsole(userInfo);
  };

  const logout = () => {
    if (!web3auth) {
      uiConsole("Web3Auth No Modal SDK not initialized yet");
      return;
    }
    web3auth.logout();
    setLoggedIn(false);
    return;
  };

  const getAccounts = async () => {
    if (!web3auth) {
      uiConsole("No provider found");
      return;
    }
    const rpc = new RPC(web3auth.provider);
    const userAccount = await rpc.getAccounts();
    uiConsole(userAccount);
  };

  const getBalance = async () => {
    if (!web3auth) {
      uiConsole("No provider found");
      return;
    }
    const rpc = new RPC(web3auth.provider);
    const balance = await rpc.getBalance();
    uiConsole(balance);
  };

  const signMessage = async () => {
    if (!web3auth) {
      uiConsole("No provider found");
      return;
    }
    const rpc = new RPC(web3auth.provider);
    const result = await rpc.signMessage();
    uiConsole(result);
  };

  const sendTransaction = async () => {
    if (!web3auth) {
      uiConsole("No provider found");
      return;
    }
    const rpc = new RPC(web3auth.provider);
    const result = await rpc.signAndSendTransaction();
    uiConsole(result);
  };

  const authenticateUser = async () => {
    try {
      const userCredential = await web3auth.authenticateUser();
      uiConsole(userCredential);
    } catch (err) {
      uiConsole(err);
    }
  };

  const switchChain = async () => {
    try {
      await web3auth.switchChain({ chainId: "0xaa36a7" });
      uiConsole("Chain switched successfully");
    } catch (err) {
      uiConsole(err);
    }
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
            Authenticate User
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={switchChain} className="card">
            Switch Chain
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
        <a target="_blank" href="https://web3auth.io/docs/sdk/core-kit/sfa-web" rel="noreferrer">
          Web3Auth
        </a>{" "}
        SFA React Auth0 GitHub Example
      </h1>

      {isLoading ? <Loading /> : <div className="grid">{web3auth ? (loggedIn ? loginView : logoutView) : null}</div>}

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-core-kit-examples/tree/main/single-factor-auth-web/sfa-web-auth0-example"
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
