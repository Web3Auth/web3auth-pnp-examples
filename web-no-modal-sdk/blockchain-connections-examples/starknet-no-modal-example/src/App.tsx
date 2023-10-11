import { useEffect, useState } from "react";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import {
  CHAIN_NAMESPACES,
  IProvider,
  WALLET_ADAPTERS,
} from "@web3auth/base";
import { CommonPrivateKeyProvider } from "@web3auth/base-provider";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import RPC from "./starknetRPC";
import "./App.css";

const clientId =
  "BEglQSgt4cUWcj6SKRdu5QkOXTsePmMcusG5EAoyjyOYKlVRjIF1iCNnMOTfpzCiunHRrMui8TIwQPXdkQ8Yxuk"; // get from https://dashboard.web3auth.io

function App() {
  const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(
    null
  );
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      try {
        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.OTHER,
          chainId: "0x1",
          rpcTarget: "https://rpc.ankr.com/eth",
          displayName: "Ethereum Mainnet",
          blockExplorer: "https://goerli.etherscan.io",
          ticker: "ETH",
          tickerName: "Ethereum",
        };
        const web3authInstance = new Web3AuthNoModal({
          clientId,
          chainConfig,
          web3AuthNetwork: "cyan",
        });

        const privateKeyProvider = new CommonPrivateKeyProvider({ config: { chainConfig } });
        const openloginAdapter = new OpenloginAdapter({
          privateKeyProvider,
        });
        web3authInstance.configureAdapter(openloginAdapter);
        setWeb3auth(web3authInstance);

        await web3authInstance.init();
        setProvider(web3authInstance.provider);
        if (web3authInstance.connectedAdapterName) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
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
    setProvider(null);
    setLoggedIn(false);
  };

  const onGetStarkAccount = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider as IProvider);
    const starkaccounts = await rpc.getStarkAccount();
    uiConsole(starkaccounts);
  };

  const getStarkKey = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider as IProvider);
    const starkKey = await rpc.getStarkKey();
    uiConsole(starkKey);
  };

  const onDeployAccount = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider as IProvider);
    const deployaccount = await rpc.deployAccount();
    uiConsole(deployaccount);
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

  const loggedInView = (
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
          <button onClick={onGetStarkAccount} className="card">
            Get Stark Accounts
          </button>
        </div>
        <div>
          <button onClick={getStarkKey} className="card">
            Get Stark Key
          </button>
        </div>
        <div>
          <button onClick={onDeployAccount} className="card">
            Deploy Account
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

  const unloggedInView = (
    <button onClick={login} className="card">
      Login
    </button>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="http://web3auth.io/" rel="noreferrer">
          Web3Auth
        </a>
        & ReactJS StarkNet Example
      </h1>

      <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/examples/tree/main/web-no-modal-sdk/other-chains/starknet-no-modal-example"
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
