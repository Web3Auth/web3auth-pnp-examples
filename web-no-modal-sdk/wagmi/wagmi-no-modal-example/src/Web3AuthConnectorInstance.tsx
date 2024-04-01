// Web3Auth Libraries
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK, UX_MODE } from "@web3auth/base";
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";

// WAGMI Libraries
import { Chain } from "wagmi/chains";

// Create Web3AuthConnector Instance
export function Web3AuthConnectorInstance(web3AuthInstance: Web3AuthNoModal) {
  return Web3AuthConnector({
      web3AuthInstance,
      loginParams: {
        loginProvider: "google",
      },
  });
}

// Create Web3Auth Instance
export function Web3AuthInstance(chains: Chain[], appName: string) {
  const chainConfig = {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: "0x" + chains[0].id.toString(16),
      rpcTarget: chains[0].rpcUrls.default.http[0], // This is the public RPC we have added, please pass on your own endpoint while creating an app
      displayName: chains[0].name,
      tickerName: chains[0].nativeCurrency?.name,
      ticker: chains[0].nativeCurrency?.symbol,
      blockExplorerUrl: chains[0].blockExplorers?.default.url[0] as string,
  };

  const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

  const web3AuthInstance = new Web3AuthNoModal({
      clientId: "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ",
      chainConfig,
      privateKeyProvider,
      uiConfig: {
      appName: appName,
      defaultLanguage: "en",
      logoLight: "https://web3auth.io/images/web3authlog.png",
      logoDark: "https://web3auth.io/images/web3authlogodark.png",
      mode: "light",
      },
      web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
      enableLogging: true,
  });

  const openloginAdapter = new OpenloginAdapter({
      adapterSettings: {
      uxMode: UX_MODE.REDIRECT,
      }
  });

  web3AuthInstance.configureAdapter(openloginAdapter);

  const walletServicesPlugin = new WalletServicesPlugin({
      walletInitOptions: {
      whiteLabel: {
          showWidgetButton: true,
      }
      }
  });
  web3AuthInstance.addPlugin(walletServicesPlugin);

  return web3AuthInstance;
}