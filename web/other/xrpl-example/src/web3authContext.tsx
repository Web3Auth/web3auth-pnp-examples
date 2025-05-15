// IMP START - Quick Start
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK, type Web3AuthNoModalOptions } from "@web3auth/no-modal";
import { XrplPrivateKeyProvider } from "@web3auth/no-modal/providers/xrpl-provider";
// IMP END - Quick Start

// IMP START - Dashboard Registration
const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // get from https://dashboard.web3auth.io
// IMP END - Dashboard Registration

// Chain configuration for XRPL
const chain = {
  chainNamespace: CHAIN_NAMESPACES.XRPL,
  chainId: "0x6",
  rpcTarget: "https://testnet-ripple-node.tor.us",
  wsTarget: "wss://s.altnet.rippletest.net",
  ticker: "XRP",
  tickerName: "XRPL",
  displayName: "xrpl testnet",
  blockExplorerUrl: "https://testnet.xrpl.org",
  logo: "",
};

// Create XRPL private key provider
const privateKeyProvider = new XrplPrivateKeyProvider({ 
  config: { chain, chains: [chain] } 
});

// IMP START - Instantiate SDK
const web3AuthOptions: Web3AuthNoModalOptions = {
  clientId,
  privateKeyProvider,
  chains: [chain],
  defaultChainId: "0x6",
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  authBuildEnv: "testing",
};
// IMP END - Instantiate SDK

// IMP START - Instantiate SDK
const web3AuthContextConfig = {
  web3AuthOptions
};
// IMP END - Instantiate SDK

export default web3AuthContextConfig; 