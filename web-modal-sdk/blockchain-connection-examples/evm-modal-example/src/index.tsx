import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Web3AuthProvider from "./Web3AuthProvider";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK,  } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3AuthOptions } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";

// Adapters
import { getDefaultExternalAdapters } from "@web3auth/default-evm-adapter";
// import { WalletConnectV2Adapter, getWalletConnectV2Settings } from "@web3auth/wallet-connect-v2-adapter";
// import { MetamaskAdapter } from "@web3auth/metamask-adapter";
// import { TorusWalletAdapter, TorusWalletOptions } from "@web3auth/torus-evm-adapter";
// import { CoinbaseAdapter, CoinbaseAdapterOptions } from "@web3auth/coinbase-adapter";

const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // get from https://dashboard.web3auth.io

const chainConfig = {
  chainId: "0x1", // Please use 0x1 for Mainnet
  rpcTarget: "https://rpc.ankr.com/eth",
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  displayName: "Ethereum Mainnet",
  blockExplorerUrl: "https://etherscan.io/",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://images.toruswallet.io/eth.svg",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

const web3AuthOptions: Web3AuthOptions = {
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  uiConfig: {
    uxMode: "redirect",
    appName: "W3A Heroes",
    appUrl: "https://web3auth.io/",
    theme: {
      primary: "#7ed6df",
    },
    logoLight: "https://web3auth.io/images/web3authlog.png",
    logoDark: "https://web3auth.io/images/web3authlogodark.png",
    defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl, tr
    mode: "auto", // whether to enable dark mode. defaultValue: auto
    useLogoLoader: true,
  },
  privateKeyProvider: privateKeyProvider,
  chainConfig,
  sessionTime: 86400, // 1 day
  // useCoreKitKey: true,
};

const openloginAdapter = new OpenloginAdapter({
  loginSettings: {
    mfaLevel: "optional",
  },
  adapterSettings: {
    uxMode: "redirect", // "redirect" | "popup"
    whiteLabel: {
      logoLight: "https://web3auth.io/images/web3authlog.png",
      logoDark: "https://web3auth.io/images/web3authlogodark.png",
      defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl, tr
      mode: "dark", // whether to enable dark, light or auto mode. defaultValue: auto [ system theme]
    },
    mfaSettings: {
      deviceShareFactor: {
        enable: true,
        priority: 1,
        mandatory: true,
      },
      backUpShareFactor: {
        enable: true,
        priority: 2,
        mandatory: false,
      },
      socialBackupFactor: {
        enable: true,
        priority: 3,
        mandatory: false,
      },
      passwordFactor: {
        enable: true,
        priority: 4,
        mandatory: false,
      },
    },
  },
});

// read more about adapters here: https://web3auth.io/docs/sdk/pnp/web/adapters/

// TODO: for some reason chainConfig is missing here
// Only when you want to add External default adapters, which includes WalletConnect, Metamask, Torus EVM Wallet
const defaultExternalAdapters = await getDefaultExternalAdapters({ options: web3AuthOptions });

// adding wallet connect v2 adapter
// const defaultWcSettings = await getWalletConnectV2Settings("eip155", ["1"], "04309ed1007e77d1f119b85205bb779d");
// const walletConnectV2Adapter = new WalletConnectV2Adapter({
//   ...(web3AuthOptions as BaseAdapterSettings),
//   adapterSettings: { ...defaultWcSettings.adapterSettings },
//   loginSettings: { ...defaultWcSettings.loginSettings },
// });
// web3auth.configureAdapter(walletConnectV2Adapter);

// // adding metamask adapter
// const metamaskAdapter = new MetamaskAdapter(web3AuthOptions as BaseAdapterSettings);
// web3auth.configureAdapter(metamaskAdapter);

// // adding torus evm adapter
// const torusWalletAdapter = new TorusWalletAdapter(web3AuthOptions as TorusWalletOptions);
// web3auth.configureAdapter(torusWalletAdapter);

// // adding coinbase adapter
// const coinbaseAdapter = new CoinbaseAdapter(web3AuthOptions as CoinbaseAdapterOptions);
// web3auth.configureAdapter(coinbaseAdapter);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <Web3AuthProvider web3AuthOptions={web3AuthOptions} adapters={[openloginAdapter, ...defaultExternalAdapters]}>
    <App />
  </Web3AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
