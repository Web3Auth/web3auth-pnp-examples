import { useEffect, useState } from "react";
import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import { CHAIN_NAMESPACES, PLUGIN_STATUS, IProvider } from "@web3auth/base";
import "./App.css";
import RPC from "./web3RPC"; // for using web3.js
// import RPC from "./viemRPC"; // for using viem
// import RPC from "./ethersRPC"; // for using ethers.js
import { useWalletServicesPlugin } from "@web3auth/wallet-services-plugin-react-hooks";

const nftCheckoutHost = "https://develop-nft-checkout.web3auth.io"
const nftCheckoutApiKey = "pk_test_4ca499b1f017c2a96bac63493dca4ac2eb08d1e91de0a796d87137dc7278e0af"

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
  const {
    initModal,
    provider,
    web3Auth,
    isConnected,
    connect,
    authenticateUser,
    logout,
    addChain,
    switchChain,
    userInfo,
    isMFAEnabled,
    enableMFA,
    status,
    addAndSwitchChain,
  } = useWeb3Auth();
  const { showCheckout, showWalletConnectScanner, showWalletUI, isPluginConnected } = useWalletServicesPlugin();
  const [showNftModal, setShowNftModal] = useState<boolean>(false);
  const [nftIFrameURL, setNFTIFrameURL] = useState<string>('');
  const [unloggedInView, setUnloggedInView] = useState<JSX.Element | null>(null);
  const [MFAHeader, setMFAHeader] = useState<JSX.Element | null>(
    <div>
      <h2>MFA is disabled</h2>
    </div>
  );


  useEffect(() => {
    const init = async () => {
      try {
        if (web3Auth) {
          await initModal();
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, [initModal, web3Auth]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === nftCheckoutHost && event.data === 'close-nft-checkout') {
        setShowNftModal(false);
      }
      console.log('event', event);
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [setShowNftModal]);

  const getChainId = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider as IProvider);
    const chainId = await rpc.getChainId();
    uiConsole(chainId);
  };

  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider as IProvider);
    const address = await rpc.getAccounts();
    uiConsole(address);
    return address;
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider as IProvider);
    const balance = await rpc.getBalance();
    uiConsole(balance);
    return balance;
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider as IProvider);
    const receipt = await rpc.sendTransaction();
    uiConsole(receipt);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider as IProvider);
    const signedMessage = await rpc.signMessage();
    uiConsole(signedMessage);
  };

  const readContract = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider as IProvider);
    const message = await rpc.readContract();
    uiConsole(message);
  };

  const writeContract = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider as IProvider);
    const receipt = await rpc.writeContract();
    uiConsole(receipt);
    if (receipt) {
      setTimeout(async () => {
        await readContract();
      }, 2000);
    }
  };

  const getPrivateKey = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider as IProvider);
    const privateKey = await rpc.getPrivateKey();
    uiConsole(privateKey);
  };

  const nftMinting = async () => {
    const FREE_MINT_CONTRACT_ID = 'b5b4de3f-0212-11ef-a08f-0242ac190003'

    const receiverAddress = await getAccounts();

    const demoNftMintingUrl = `${nftCheckoutHost}/?contract_id=${FREE_MINT_CONTRACT_ID}&receiver_address=${receiverAddress}&api_key=${nftCheckoutApiKey}`

    setNFTIFrameURL(demoNftMintingUrl);
    setShowNftModal(true);
  };

  const nftCheckout = async () => {
    const PAID_MINT_CONTRACT_ID = 'd1145a8b-98ae-44e0-ab63-2c9c8371caff'

    const receiverAddress = await getAccounts();

    const demoNftPurchaseUrl = `${nftCheckoutHost}/?contract_id=${PAID_MINT_CONTRACT_ID}&receiver_address=${receiverAddress}&api_key=${nftCheckoutApiKey}`

    setNFTIFrameURL(demoNftPurchaseUrl);
    setShowNftModal(true);
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
          <button
            disabled={isMFAEnabled}
            onClick={() => {
              enableMFA();
            }}
            className="card"
          >
            Enable MFA
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              if (isPluginConnected) {
                showWalletUI();
              }
            }}
            className="card"
          >
            Show Wallet UI
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              if (isPluginConnected) {
                showWalletConnectScanner();
              }
            }}
            className="card"
          >
            Show Wallet Connect
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              if (isPluginConnected) {
                showCheckout();
              }
            }}
            className="card"
          >
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
            onClick={async () => {
              try {
                await addAndSwitchChain(newChain);
                uiConsole("New Chain Added and Switched");
              } catch (error) {
                uiConsole(error);
              }
            }}
            className="card"
          >
            Add and Switch Chain
          </button>
        </div>
        <div>
          <button
            onClick={async () => {
              try {
                await addChain(newChain);
                uiConsole("New Chain Added");
              } catch (error) {
                uiConsole(error);
              }
            }}
            className="card"
          >
            Add Chain
          </button>
        </div>
        <div>
          <button
            onClick={async () => {
              try {
                await switchChain({ chainId: newChain.chainId });
                uiConsole("Switched to new Chain");
              } catch (error) {
                uiConsole(error);
              }
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
          <button
            onClick={() => {
              const message = readContract();
              uiConsole(message);
            }}
            className="card"
          >
            Read Contract
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              const message = writeContract();
              uiConsole(message);
            }}
            className="card"
          >
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

        <div>
          <button
            onClick={() => {
              nftCheckout();
            }}
            className="card"
          >
            NFT Checkout
          </button>
        </div>

        <div>
          <button
            onClick={() => {
              nftMinting();
            }}
            className="card"
          >
            NFT Minting
          </button>
        </div>
      </div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
    </>
  );

  useEffect(() => {
    setUnloggedInView(
      <div>
        <h2>Web3Auth hook status: {status}</h2>
        <h2>Web3Auth status: {web3Auth?.status}</h2>
        <button onClick={connect} className="card">
          Login
        </button>
      </div>
    );
  }, [connect, status, web3Auth]);

  useEffect(() => {
    if (isMFAEnabled) {
      setMFAHeader(
        <div>
          <h2>MFA is enabled</h2>
        </div>
      );
    }
  }, [isMFAEnabled]);

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/modal" rel="noreferrer">
          Web3Auth{" "}
        </a>
        & ReactJS Ethereum Example
      </h1>
      <div className="container" style={{ textAlign: "center" }}>
        {isConnected && MFAHeader}
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
        <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FWeb3Auth%2Fweb3auth-pnp-examples%2Ftree%2Fmain%2Fweb-modal-sdk%2Fblockchain-connection-examples%2Fevm-modal-example&project-name=w3a-evm-modal&repository-name=w3a-evm-modal">
          <img src="https://vercel.com/button" alt="Deploy with Vercel" />
        </a>
      </footer>
      {(showNftModal) && (
          <iframe
            src={nftIFrameURL}
            height="100%"
            width="100%"
            title="NFT Checkout"
            loading="eager"
            seamless={true}
            allow="clipboard-write"
            className="iframeContainer"
          />
      )}
    </div>
  );
}

export default App;
