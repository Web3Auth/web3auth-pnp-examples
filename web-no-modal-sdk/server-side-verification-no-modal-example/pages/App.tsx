/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import "react-toastify/dist/ReactToastify.css";

import { getPublicCompressed } from "@toruslabs/eccrypto";
import { CHAIN_NAMESPACES, IProvider, UX_MODE, WALLET_ADAPTERS, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { AuthAdapter } from "@web3auth/auth-adapter";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

// import RPC from "../components/evm.ethers";
// import RPC from "../components/evm.web3";
import RPC from "../components/evm.viem";

const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // get from https://dashboard.web3auth.io

function App() {
  const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(false);

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

  const logout = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const validateIdToken = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const { idToken } = await web3auth.authenticateUser();
    // console.log(idToken);

    const privKey: any = await web3auth.provider?.request({
      method: "eth_private_key",
    });
    console.log(privKey);
    const pubkey = getPublicCompressed(Buffer.from(privKey, "hex")).toString("hex");

    // Validate idToken with server
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ appPubKey: pubkey }),
    });
    if (res.status === 200) {
      toast.success("JWT Verification Successful");
      await getUserInfo();
    } else {
      toast.error("JWT Verification Failed");
      console.log("JWT Verification Failed");
      await logout();
    }
    return res.status;
  };

  const login = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.AUTH, {
      loginProvider: "google",
    });
    setProvider(web3authProvider);
    setLoggedIn(true);
  };

  const authenticateUser = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const idToken = await web3auth.authenticateUser();
    uiConsole(idToken);
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

        const web3authInstance = new Web3AuthNoModal({
          clientId,
          privateKeyProvider,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
        });

        const authAdapter = new AuthAdapter({
          adapterSettings: {
            uxMode: UX_MODE.REDIRECT,
          },
          privateKeyProvider,
        });
        web3authInstance.configureAdapter(authAdapter);
        setWeb3auth(web3authInstance);
        await web3authInstance.init();
        setProvider(web3authInstance.provider);
        if (web3authInstance.connected) {
          setLoggedIn(true);
          await validateIdToken();
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

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
          <button onClick={validateIdToken} className="card">
            Validate ID Token
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
    <button onClick={login} className="card">
      Login
    </button>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/no-modal" rel="noreferrer">
          Web3Auth
        </a>{" "}
        & NextJS Server Side Verification Example
      </h1>

      <div className="grid">{loggedIn ? loginView : logoutView}</div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-no-modal-sdk/server-side-verification-no-modal-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
        <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FWeb3Auth%2Fweb3auth-pnp-examples%2Ftree%2Fmain%2Fweb-no-modal-sdk%2Fserver-side-verification-no-modal-example&project-name=w3a-ssv-no-modal&repository-name=w3a-ssv-no-modal">
          <img src="https://vercel.com/button" alt="Deploy with Vercel" />
        </a>
      </footer>
    </div>
  );
}

export default App;
