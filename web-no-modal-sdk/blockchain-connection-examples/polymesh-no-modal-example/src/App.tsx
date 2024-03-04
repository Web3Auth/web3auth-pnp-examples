import { CHAIN_NAMESPACES, IProvider, WALLET_ADAPTERS, CustomChainConfig } from "@web3auth/base";
import { CommonPrivateKeyProvider } from "@web3auth/base-provider";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { useEffect, useState } from "react";
import "./App.css";

import RPC from "./polymeshRPC";

const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // get from https://dashboard.web3auth.io

export default function App() {
  const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      try {
        const chainConfig: CustomChainConfig = {
          chainNamespace: CHAIN_NAMESPACES.OTHER,
          chainId: "0x5", // '0x1' for mainnet
          rpcTarget: "https://testnet-rpc.polymesh.live", // 'https://mainnet-rpc.polymesh.network' for mainnet
          displayName: "Polymesh Testnet", // 'Polymesh Mainnet' for mainnet
          blockExplorerUrl: "https://polymesh-testnet.subscan.io", // 'https://polymesh.subscan.io' for mainnet
          ticker: "POLYX",
          tickerName: "Polymesh",
        };
        const web3authInstance = new Web3AuthNoModal({
          clientId,
          chainConfig,
          web3AuthNetwork: "sapphire_mainnet",
        });
        setWeb3auth(web3authInstance);

        const privateKeyProvider = new CommonPrivateKeyProvider({ config: { chainConfig } });

        const openloginAdapter = new OpenloginAdapter({
          privateKeyProvider,
        });
        web3authInstance.configureAdapter(openloginAdapter);

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

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

  const login = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
      loginProvider: "google",
    });
    setProvider(web3authProvider);
    setLoggedIn(true);
    uiConsole("Logged in Successfully!");
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
    console.log(user);
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

  const onGetPolymeshPrivateKey = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider as IProvider);
    const privateKey = await rpc.getPolymeshPrivateKey();
    uiConsole("Private Key", privateKey);
  };

  const getPublicKey = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const userAccount = await rpc.getKey();
    uiConsole("Public Key", userAccount);
  };

  const getSignersIdentity = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const identity = await rpc.getIdentity();
    if (!identity) {
      uiConsole("No Identity found for the connected key, visit https://testnet-onboarding.polymesh.live to create an onchain identity");
    } else {
      uiConsole("Identity ID", identity);
    }
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    uiConsole("Balance", balance);
  };

  const transferPolyx = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    uiConsole("Submitting POLYX transfer...");
    const rpc = new RPC(provider);
    const result = await rpc.transferPolyx();
    uiConsole("Transaction Details", result);
  };

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
          <button onClick={onGetPolymeshPrivateKey} className="card">
            Get Private Key
          </button>
        </div>
        <div>
          <button onClick={getPublicKey} className="card">
            Get Signing Key
          </button>
        </div>
        <div>
          <button onClick={getSignersIdentity} className="card">
            Get Identity ID
          </button>
        </div>
        <div>
          <button onClick={getBalance} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={transferPolyx} className="card">
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

  const unloggedInView = (
    <button onClick={login} className="card">
      Login
    </button>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/no-modal" rel="noreferrer">
          Web3Auth{" "}
        </a>
        & React Polymesh Example
      </h1>

      <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-no-modal-sdk/blockchain-connection-examples/polymesh-no-modal-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
      </footer>
    </div>
  );
}
