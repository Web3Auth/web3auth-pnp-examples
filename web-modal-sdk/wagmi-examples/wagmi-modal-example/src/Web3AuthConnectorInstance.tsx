// Web3Auth Libraries
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { authConnector, CustomChainConfig, Web3Auth, CHAIN_NAMESPACES, WEB3AUTH_NETWORK, walletServicesPlugin } from "@web3auth/modal";
import { Chain } from "wagmi/chains";
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";

export default function Web3AuthConnectorInstance(chains: Chain[]) {
  // Create Web3Auth Instance
  const clientId = "BKrfI3vHDt2VRU0sir2o_ZiCtTaDLPK9MKDv9fhu_EOf2K5IBOoVf3zCUDS-NDBVYwESXoADdeJ_8yN4pM-nDaU"; // get from https://dashboard.web3auth.io

  const name = "My App Name";

  const web3AuthInstance = new Web3Auth({
    clientId,
    uiConfig: {
      appName: name,
      loginMethodsOrder: ["github", "google"],
      defaultLanguage: "en",
      modalZIndex: "2147483647",
      logoLight: "https://web3auth.io/images/web3authlog.png",
      logoDark: "https://web3auth.io/images/web3authlogodark.png",
      uxMode: "redirect",
      mode: "light",
    },
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    enableLogging: true,
    connectors: [authConnector({ connectorSettings: { buildEnv: "testing" } })],
    plugins: [walletServicesPlugin()],
  });

  return Web3AuthConnector({
      web3AuthInstance,
  });
}