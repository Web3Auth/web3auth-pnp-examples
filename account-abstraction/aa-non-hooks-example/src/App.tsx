import "./App.css";

import { AUTH_CONNECTION, WALLET_CONNECTORS, WEB3AUTH_NETWORK, type IProvider, type Web3AuthNoModalOptions } from "@web3auth/no-modal";
import { useEffect, useState } from "react";
import { SendUserOperation } from "./components/SendUserOperation";
import { Balance } from "./components/Balance";
import RPC from "./ethersRPC";
import { Web3AuthNoModal } from "@web3auth/no-modal";

// Get from https://dashboard.web3auth.io
const clientId = "BBWsHL_ho__CfdDwMoJTwvBkt6KtsMq9F1XlqYF2uuS1V_MTgVUm3U93PVkp0rdcLHdtwLqv_E6U-ogTvSY226E";

const web3AuthOptions: Web3AuthNoModalOptions = {
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  authBuildEnv: 'testing',
}

const web3auth = new Web3AuthNoModal(web3AuthOptions);

function App() {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.init();
        setProvider(web3auth.provider);

        if (web3auth.connected) {
          setLoggedIn(true);
          const user = await web3auth.getUserInfo();
          setUserInfo(user);
          const accounts = await RPC.getAccounts(web3auth.provider!);
          setAddress(accounts);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    const web3authProvider = await web3auth.connectTo(WALLET_CONNECTORS.AUTH, {
      authConnection: AUTH_CONNECTION.GOOGLE,
    });
    setProvider(web3authProvider);
    if (web3auth.connected && web3authProvider) {
      setLoggedIn(true);
      const user = await web3auth.getUserInfo();
      setUserInfo(user);
      const accounts = await RPC.getAccounts(web3authProvider);
      setAddress(accounts);
    }
  };

  const logout = async () => {
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
    setUserInfo(null);
    setAddress("");
    uiConsole("logged out");
  };

  function uiConsole(...args: unknown[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
      console.log(...args);
    }
  }

  const loggedInView = (
    <>
      <h2>Connected to Web3Auth</h2>
      <div>{address}</div>
      <div className="flex-container">
        <div>
          <button onClick={() => uiConsole(userInfo)} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>
      <SendUserOperation provider={provider} />
      <Balance provider={provider} />
    </>
  );

  const unloggedInView = (
    <button onClick={login} className="card">
      Login with Google
    </button>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/modal" rel="noreferrer">
          Web3Auth{" "}
        </a>
        & React No Modal AA Quick Start (Non Hook)
      </h1>

      <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-modal-sdk/account-abstraction/aa-modal-quick-start"
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