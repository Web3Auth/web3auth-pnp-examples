import "./App.css";

import { ADAPTER_EVENTS, IProvider, WALLET_ADAPTERS, WEB3AUTH_NETWORK, getEvmChainConfig } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { AccountAbstractionProvider, SafeSmartAccount } from "@web3auth/account-abstraction-provider";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { useEffect, useState } from "react";


import RPC from "./ethersRPC";
import { AuthAdapter } from "@web3auth/auth-adapter";

const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // get from https://dashboard.web3auth.io

// Get custom chain configs for your chain from https://web3auth.io/docs/connect-blockchain
const chainConfig = getEvmChainConfig(0xaa36a7, clientId)!;

const pimlicoAPIKey = import.meta.env.VITE_API_KEY;

const accountAbstractionProvider = new AccountAbstractionProvider({
  config: {
    chainConfig,
    bundlerConfig: {
      url: `https://api.pimlico.io/v2/11155111/rpc?apikey=${pimlicoAPIKey}`,
    },
    smartAccountInit: new SafeSmartAccount(),
    paymasterConfig: {
      url: `https://api.pimlico.io/v2/11155111/rpc?apikey=${pimlicoAPIKey}`,
    }
  }
});

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3auth = new Web3AuthNoModal({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  privateKeyProvider,
  accountAbstractionProvider
});

const authadapter = new AuthAdapter();
web3auth.configureAdapter(authadapter);

function App() {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  web3auth.addListener(ADAPTER_EVENTS.CONNECTED, () => {
    setLoggedIn(true);
  })

  useEffect(() => {
    const init = async () => {
      try {
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

  const login = async () => {
    const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.AUTH, {
      loginProvider: "google",
    });

    setProvider(web3authProvider);
    if (web3auth.connected) {
      setLoggedIn(true);
    }
  };

  const getUserInfo = async () => {
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
    uiConsole("logged out");
  };


  const getAccounts = async () => {
    if (!provider) {
      uiConsole("Provider is not initialized yet");
      return;
    }
    const address = await RPC.getAccounts(provider);
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("Provider is not initialized yet");
      return;
    }
    const balance = await RPC.getBalance(provider);
    uiConsole(balance);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("Provider is not initialized yet");
      return;
    }
    const signedMessage = await RPC.signMessage(provider);
    uiConsole(signedMessage);
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("Provider is not initialized yet");
      return;
    }
    uiConsole("Sending Transaction...");
    const transactionReceipt = await RPC.sendTransaction(provider);
    uiConsole(transactionReceipt);
  };

  const signTransaction = async () => {
    if (!provider) {
      uiConsole("Provider is not initialized yet");
      return;
    }
    uiConsole("Signing Transaction...");
    const signature = await RPC.signTransaction(provider);
    uiConsole(signature);
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
          <button onClick={signTransaction} className="card">
            Sign Transaction
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
        <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/modal" rel="noreferrer">
          Web3Auth{" "}
        </a>
        & AA React Quick Start
      </h1>

      <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-no-modal-sdk/account-abstraction/aa-no-modal-quick-start"
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
