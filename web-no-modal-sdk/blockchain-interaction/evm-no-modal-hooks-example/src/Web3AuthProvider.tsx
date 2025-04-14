import { Web3AuthContextConfig } from "@web3auth/no-modal-react-hooks";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { WEB3AUTH_NETWORK, Web3AuthNoModalOptions, UX_MODE, getEvmChainConfig } from "@web3auth/base";
import { AuthAdapter } from "@web3auth/auth-adapter";
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";
import { getDefaultExternalAdapters } from "@web3auth/default-evm-adapter";

const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ";
// Get custom chain configs for your chain from https://web3auth.io/docs/connect-blockchain
const chainConfig = getEvmChainConfig(0xaa36a7, clientId)!;

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: {
    chainConfig,
  },
});

const web3AuthOptions: Web3AuthNoModalOptions = {
  chainConfig,
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  uiConfig: {
    appName: "W3A Heroes",
    appUrl: "https://web3auth.io/",
    theme: {
      primary: "#7ed6df",
    },
  },
  privateKeyProvider: privateKeyProvider,
  sessionTime: 86400, // 1 day
  // useCoreKitKey: true,
};

const authAdapter = new AuthAdapter({
  adapterSettings: {
    uxMode: UX_MODE.REDIRECT,
    mfaSettings: {
      deviceShareFactor: {
        enable: true,
        priority: 1,
        mandatory: true,
      },
    },
  },
  loginSettings: {
    mfaLevel: "optional",
  },
});

const walletServicesPlugin = new WalletServicesPlugin({
  wsEmbedOpts: {},
  walletInitOptions: { whiteLabel: { showWidgetButton: true }, confirmationStrategy: "modal" },
});

export const adapters = await getDefaultExternalAdapters({ options: web3AuthOptions });

export const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions,
  adapters: [authAdapter, ...adapters],
  plugins: [walletServicesPlugin],
};
