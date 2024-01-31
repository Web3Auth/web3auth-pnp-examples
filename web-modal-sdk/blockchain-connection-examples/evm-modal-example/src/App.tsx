import { useEffect, useState } from "react";
import { Web3Auth, Web3AuthOptions } from "@web3auth/modal";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CHAIN_NAMESPACES, IProvider, WALLET_ADAPTERS, WEB3AUTH_NETWORK, getEvmChainConfig, CustomChainConfig } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import "./App.css";
import RPC from "./web3RPC"; // for using web3.js
// import RPC from "./ethersRPC"; // for using ethers.js

import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
// import { getDefaultExternalAdapters } from "@web3auth/default-evm-adapter";

// Wallet Services
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";

// Adapters
// import { WalletConnectV2Adapter, getWalletConnectV2Settings } from "@web3auth/wallet-connect-v2-adapter";
// import { MetamaskAdapter } from "@web3auth/metamask-adapter";
// import { TorusWalletAdapter } from "@web3auth/torus-evm-adapter";

const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // get from https://dashboard.web3auth.io

const chainConfig = {
  chainId: "0x1", // Please use 0x1 for Mainnet
  rpcTarget: "https://rpc.ankr.com/eth",
  displayName: "Ethereum Mainnet",
  blockExplorerUrl: "https://etherscan.io/",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://web3auth.io/images/web3auth-logo.svg",
};

// Using Default ChainConfig
let defaultChainConfig: CustomChainConfig | null = getEvmChainConfig(11155111); // 1 for Ethereum Mainnet
let chainConfigPrivateKeyProvider;
// Remove chainNamespace from defaultChainConfig
if (defaultChainConfig && "chainNamespace" in defaultChainConfig) {
  const { chainNamespace, ...newConfig } = defaultChainConfig;
  chainConfigPrivateKeyProvider = { ...newConfig };
}

const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig: chainConfigPrivateKeyProvider as any } });

const web3AuthOptions: Web3AuthOptions = {
  clientId,
  chainConfig: { ...chainConfig, chainNamespace: CHAIN_NAMESPACES.EIP155 },
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  uiConfig: {
    uxMode: "redirect",
    appName: "W3A Heroes",
    appUrl: "https://web3auth.io/",
    theme: {
      primary: "#768729",
    },
    logoLight: "https://web3auth.io/images/web3auth-logo.svg",
    logoDark: "https://web3auth.io/images/web3auth-logo---Dark.svg",
    defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
    mode: "auto", // whether to enable dark mode. defaultValue: false
    useLogoLoader: true,
  },
  privateKeyProvider: privateKeyProvider,
};

function App() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [walletServicesPlugin, setWalletServicesPlugin] = useState<WalletServicesPlugin | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth(web3AuthOptions);

        // const openloginAdapter = new OpenloginAdapter({
        //   loginSettings: {
        //     mfaLevel: "optional",
        //   },
        //   adapterSettings: {
        //     uxMode: "redirect", // "redirect" | "popup"
        //     whiteLabel: {
        //       logoLight: "https://web3auth.io/images/web3auth-logo.svg",
        //       logoDark: "https://web3auth.io/images/web3auth-logo---Dark.svg",
        //       defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
        //       mode: "dark", // whether to enable dark, light or auto mode. defaultValue: auto [ system theme]
        //     },
        //     mfaSettings: {
        //       deviceShareFactor: {
        //         enable: true,
        //         priority: 1,
        //         mandatory: true,
        //       },
        //       backUpShareFactor: {
        //         enable: true,
        //         priority: 2,
        //         mandatory: false,
        //       },
        //       socialBackupFactor: {
        //         enable: true,
        //         priority: 3,
        //         mandatory: false,
        //       },
        //       passwordFactor: {
        //         enable: true,
        //         priority: 4,
        //         mandatory: false,
        //       },
        //     },
        //   },
        // });
        // web3auth.configureAdapter(openloginAdapter);

        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: { buildEnv: "testing" },
        });
        web3auth.configureAdapter(openloginAdapter);

        // Only when you want to add External default adapters.
        // const adapters = await getDefaultExternalAdapters({ options: web3AuthOptions });

        // adapters.forEach((adapter) => {
        //   web3auth.configureAdapter(adapter);
        // });

        const walletServicesPlugin = new WalletServicesPlugin({
          wsEmbedOpts: {},
          walletInitOptions: { whiteLabel: { showWidgetButton: true } },
        });

        setWalletServicesPlugin(walletServicesPlugin);

        await web3auth.addPlugin(walletServicesPlugin);

        // read more about adapters here: https://web3auth.io/docs/sdk/pnp/web/adapters/

        // adding wallet connect v2 adapter
        // const defaultWcSettings = await getWalletConnectV2Settings("eip155", [1], "04309ed1007e77d1f119b85205bb779d");
        // const walletConnectV2Adapter = new WalletConnectV2Adapter({
        //   adapterSettings: { ...defaultWcSettings.adapterSettings },
        //   loginSettings: { ...defaultWcSettings.loginSettings },
        // });

        // web3auth.configureAdapter(walletConnectV2Adapter);

        // adding metamask adapter
        // const metamaskAdapter = new MetamaskAdapter({
        //   clientId,
        //   sessionTime: 3600, // 1 hour in seconds
        //   web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
        //   chainConfig: {
        //     chainNamespace: CHAIN_NAMESPACES.EIP155,
        //     chainId: "0x1",
        //     rpcTarget: "https://rpc.ankr.com/eth", // This is the public RPC we have added, please pass on your own endpoint while creating an app
        //   },
        // });
        // we can change the above settings using this function
        // metamaskAdapter.setAdapterSettings({
        //   sessionTime: 86400, // 1 day in seconds
        //   chainConfig: {
        //     chainNamespace: CHAIN_NAMESPACES.EIP155,
        //     chainId: "0x1",
        //     rpcTarget: "https://rpc.ankr.com/eth", // This is the public RPC we have added, please pass on your own endpoint while creating an app
        //   },
        //   web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
        // });

        // // it will add/update  the metamask adapter in to web3auth class
        // web3auth.configureAdapter(metamaskAdapter);

        // const torusWalletAdapter = new TorusWalletAdapter({
        //   clientId,
        // });

        // // it will add/update  the torus-evm adapter in to web3auth class
        // web3auth.configureAdapter(torusWalletAdapter);

        setWeb3auth(web3auth);

        await web3auth.initModal();

        // await web3auth.initModal({
        //   modalConfig: {
        //     [WALLET_ADAPTERS.OPENLOGIN]: {
        //       label: "openlogin",
        //       loginMethods: {
        //         // Disable facebook and reddit
        //         facebook: {
        //           name: "facebook",
        //           showOnModal: false
        //         },
        //         reddit: {
        //           name: "reddit",
        //           showOnModal: false
        //         },
        //         // Disable email_passwordless and sms_passwordless
        //         email_passwordless: {
        //           name: "email_passwordless",
        //           showOnModal: false
        //         },
        //         sms_passwordless: {
        //           name: "sms_passwordless",
        //           showOnModal: false
        //         }
        //       }
        //     }
        //   }
        // });
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
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    await web3auth.connect();
    // setLoggedIn(true);
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
    setLoggedIn(false);
  };

  const showWCM = async () => {
    if (!walletServicesPlugin) {
      uiConsole("torus plugin not initialized yet");
      return;
    }
    walletServicesPlugin.showWalletConnectScanner();
    uiConsole();
  };

  const showCheckout = async () => {
    if (!walletServicesPlugin) {
      uiConsole("torus plugin not initialized yet");
      return;
    }
    walletServicesPlugin.showCheckout();
  };

  const getChainId = async () => {
    if (!web3auth?.provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(web3auth.provider as IProvider);
    const chainId = await rpc.getChainId();
    uiConsole(chainId);
  };

  const addChain = async () => {
    if (!web3auth?.provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const newChain = {
      chainId: "0xaa36a7",
      displayName: "Ethereum Sepolia",
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      tickerName: "Ethereum",
      ticker: "ETH",
      decimals: 18,
      rpcTarget: "https://rpc.ankr.com/eth_sepolia",
      blockExplorerUrl: "https://sepolia.etherscan.io",
      logo: "",
    };
    await web3auth?.addChain(newChain);
    uiConsole("New Chain Added");
  };

  const switchChain = async () => {
    if (!web3auth?.provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    await web3auth?.switchChain({ chainId: "0xaa36a7" });
    uiConsole("Chain Switched");
  };

  const getAccounts = async () => {
    if (!web3auth?.provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(web3auth.provider as IProvider);
    const address = await rpc.getAccounts();
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!web3auth?.provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(web3auth.provider as IProvider);
    const balance = await rpc.getBalance();
    uiConsole(balance);
  };

  const sendTransaction = async () => {
    if (!web3auth?.provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(web3auth.provider as IProvider);
    const receipt = await rpc.sendTransaction();
    uiConsole(receipt);
  };

  const signMessage = async () => {
    if (!web3auth?.provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(web3auth.provider as IProvider);
    const signedMessage = await rpc.signMessage();
    uiConsole(signedMessage);
  };

  const readContract = async () => {
    if (!web3auth?.provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(web3auth.provider as IProvider);
    const message = await rpc.readContract();
    uiConsole(message);
  };

  const writeContract = async () => {
    if (!web3auth?.provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(web3auth.provider as IProvider);
    const receipt = await rpc.writeContract();
    uiConsole(receipt);
    if (receipt) {
      setTimeout(async () => {
        await readContract();
      }, 2000);
    }
  };

  const getPrivateKey = async () => {
    if (!web3auth?.provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(web3auth.provider as IProvider);
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
          <button onClick={addChain} className="card">
            Add Chain
          </button>
        </div>
        <div>
          <button onClick={switchChain} className="card">
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
        <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/modal" rel="noreferrer">
          Web3Auth{" "}
        </a>
        & ReactJS Ethereum Example
      </h1>

      <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>

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
