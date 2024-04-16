import { useEffect, useState } from "react";
import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";
import { CHAIN_NAMESPACES, IProvider } from "@web3auth/base";
import "./App.css";
import RPC from "./web3RPC"; // for using web3.js
// import RPC from "./ethersRPC"; // for using ethers.js

const newChain = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x89", // hex of 137, polygon mainnet
  rpcTarget: "https://rpc.ankr.com/polygon",
  // Avoid using public rpcTarget in production.
  // Use services like Infura, Quicknode etc
  displayName: "Polygon Mainnet",
  blockExplorerUrl: "https://polygonscan.com",
  ticker: "MATIC",
  tickerName: "MATIC",
  logo: "https://images.toruswallet.io/polygon.svg",
};

function App() {
  const { initModal, web3auth, isConnected, connect, authenticateUser, logout, addPlugin, addChain, switchChain, userInfo, isMFAEnabled } =
    useWeb3Auth();
  const [walletServicesPlugin, setWalletServicesPlugin] = useState<WalletServicesPlugin | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);

  useEffect(() => {
    console.log("web3auth", web3auth?.status);
    console.log("provider", provider);
    console.log("web3auth.provider", provider);
    const init = async () => {
      try {
        // Wallet Services Plugin
        const walletServicesPluginInstance = new WalletServicesPlugin();
        if (!walletServicesPlugin) {
          setWalletServicesPlugin(walletServicesPluginInstance);
          web3auth?.addPlugin(walletServicesPluginInstance);
        }

        if (web3auth) {
          await initModal();
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, [web3auth]);

  const showWCM = async () => {
    if (!walletServicesPlugin) {
      uiConsole("walletservices plugin not initialized yet");
      return;
    }
    await walletServicesPlugin.showWalletConnectScanner();
    uiConsole();
  };

  const showCheckout = async () => {
    if (!walletServicesPlugin) {
      uiConsole("walletservices plugin not initialized yet");
      return;
    }
    console.log(web3auth?.connected);
    await walletServicesPlugin.showCheckout();
  };

  const showWalletUi = async () => {
    if (!walletServicesPlugin) {
      uiConsole("walletservices plugin not initialized yet");
      return;
    }
    if (web3auth?.connected) {
      await walletServicesPlugin?.showWalletUi();
    }
  };

  const getChainId = async () => {
    if (provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider! as IProvider);
    const chainId = await rpc.getChainId();
    uiConsole(chainId);
  };

  const getAccounts = async () => {
    if (provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider! as IProvider);
    const address = await rpc.getAccounts();
    uiConsole(address);
  };

  const getBalance = async () => {
    if (provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider! as IProvider);
    const balance = await rpc.getBalance();
    uiConsole(balance);
  };

  const sendTransaction = async () => {
    if (provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider! as IProvider);
    const receipt = await rpc.sendTransaction();
    uiConsole(receipt);
  };

  const signMessage = async () => {
    if (provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider! as IProvider);
    const signedMessage = await rpc.signMessage();
    uiConsole(signedMessage);
  };

  const readContract = async () => {
    if (provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider! as IProvider);
    const message = await rpc.readContract();
    uiConsole(message);
  };

  const writeContract = async () => {
    if (provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider! as IProvider);
    const receipt = await rpc.writeContract();
    uiConsole(receipt);
    if (receipt) {
      setTimeout(async () => {
        await readContract();
      }, 2000);
    }
  };

  const getPrivateKey = async () => {
    if (provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider! as IProvider);
    const privateKey = await rpc.getPrivateKey();
    uiConsole(privateKey);
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
          <button
            onClick={() => {
              uiConsole(userInfo);
            }}
            className="card"
          >
            Get User Info
          </button>
        </div>
        <div>
          <button
            onClick={async () => {
              const { idToken } = await authenticateUser();
              uiConsole(idToken);
            }}
            className="card"
          >
            Get ID Token
          </button>
        </div>
        <div>
          <button onClick={showWalletUi} className="card">
            Show Wallet UI
          </button>
        </div>
        <div>
          <button onClick={showWCM} className="card">
            Show Wallet Connect
          </button>
        </div>
        <div>
          <button onClick={showCheckout} className="card">
            Show Checkout
          </button>
        </div>
        <div>
          <button onClick={getChainId} className="card">
            Get Chain ID
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              addChain(newChain);
            }}
            className="card"
          >
            Add Chain
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              switchChain({ chainId: newChain.chainId });
            }}
            className="card"
          >
            Switch Chain
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
          <button onClick={readContract} className="card">
            Read Contract
          </button>
        </div>
        <div>
          <button onClick={writeContract} className="card">
            Write Contract
          </button>
        </div>
        <div>
          <button onClick={getPrivateKey} className="card">
            Get Private Key
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              logout();
            }}
            className="card"
          >
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
    <button
      onClick={async () => {
        console.log(web3auth.status);
        if (web3auth.status === "ready") {
          setProvider(await connect());
        }
      }}
      className="card"
    >
      Login
    </button>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/modal" rel="noreferrer">
          Web3Auth{" "}
        </a>
        & ReactJS Ethereum Example
      </h1>
      <div className="container" style={{ textAlign: "center" }}>
        {isConnected && <h2>{`isMFAEnabled: ${isMFAEnabled}`}</h2>}
      </div>

      <div className="grid">{isConnected ? loggedInView : unloggedInView}</div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-modal-sdk/blockchain-connection-examples/evm-modal-example"
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
