import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import { WEB3AUTH_NETWORK, Web3AuthNoModalOptions, UX_MODE, getSolanaChainConfig } from "@web3auth/base";
import { AuthAdapter, AuthAdapterOptions } from "@web3auth/auth-adapter";
import { getDefaultExternalAdapters } from "@web3auth/default-solana-adapter";
// Get custom chain configs for your chain from https://web3auth.io/docs/connect-blockchain
const chainConfig = getSolanaChainConfig(0x3)!;

const privateKeyProvider = new SolanaPrivateKeyProvider({
  config: {
    chainConfig,
  },
});

const web3AuthOptions: Web3AuthNoModalOptions = {
  chainConfig,
  clientId: "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ",
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
} as AuthAdapterOptions);

export const defaultSolanaAdapters = await getDefaultExternalAdapters({ options: web3AuthOptions });

export const web3AuthContextConfig = {
  web3AuthOptions,
  adapters: [authAdapter, ...defaultSolanaAdapters],
  plugins: [],
};
