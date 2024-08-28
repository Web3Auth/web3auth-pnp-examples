import { Web3AuthContextConfig } from "@web3auth/modal-react-hooks";
import { Web3AuthOptions } from "@web3auth/modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";
import { getDefaultExternalAdapters } from "@web3auth/default-evm-adapter";

const chainConfig = {
  chainId: "0xaa36a7", // for wallet connect make sure to pass in this chain in the loginSettings of the adapter.
  displayName: "Ethereum Sepolia",
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  tickerName: "Ethereum Sepolia",
  ticker: "ETH",
  rpcTarget: "https://rpc.ankr.com/eth_sepolia",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: {
    chainConfig,
  },
});

const web3AuthOptions: Web3AuthOptions = {
  chainConfig,
  clientId: "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ",
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
        mandatory: true,
      },
    },
  },
});

const walletServicesPlugin = new WalletServicesPlugin({
  wsEmbedOpts: {},
  walletInitOptions: { whiteLabel: { showWidgetButton: true } },
});

const adapters = await getDefaultExternalAdapters({ options: web3AuthOptions });

export const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions,
  adapters: [openloginAdapter, ...adapters],
  plugins: [walletServicesPlugin],
};
