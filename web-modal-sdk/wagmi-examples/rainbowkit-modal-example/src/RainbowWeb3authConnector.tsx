// Web3Auth Libraries
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { Wallet } from '@rainbow-me/rainbowkit';
import { Web3Auth } from "@web3auth/modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { mainnet } from "wagmi/chains";

export const RainbowWeb3authConnector = (): Wallet => {
  // Create Web3Auth Instance
  const name = "My App Name";
  const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x" + mainnet.id.toString(16),
    rpcTarget: mainnet.rpcUrls.default.http[0], // This is the public RPC we have added, please pass on your own endpoint while creating an app
    displayName: mainnet.name,
    tickerName: mainnet.nativeCurrency?.name,
    ticker: mainnet.nativeCurrency?.symbol,
    blockExplorerUrl: mainnet.blockExplorers?.default.url[0] as string,
  };

  const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

  const web3AuthInstance = new Web3Auth({
    clientId: "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ",
    chainConfig,
    privateKeyProvider,
    uiConfig: {
      appName: name,
      loginMethodsOrder: ["github", "google"],
      defaultLanguage: "en",
      modalZIndex: "2147483647",
      logoLight: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
      logoDark: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
      uxMode: "redirect",
      mode: "light",
    },
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
    enableLogging: true,
  });

  return {
    id: "web3auth",
    name,
    iconUrl: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
    iconBackground: "#fff",
    createConnector: () => Web3AuthConnector({
      web3AuthInstance,
  })};
}