// IMP START - Quick Start
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK, type Web3AuthOptions } from "@web3auth/modal";
import { XrplPrivateKeyProvider } from "@web3auth/modal/providers/xrpl-provider";
// IMP END - Quick Start

// IMP START - Dashboard Registration
const clientId = "BHgArYmWwSeq21czpcarYh0EVq2WWOzflX-NTK-tY1-1pauPzHKRRLgpABkmYiIV_og9jAvoIxQ8L3Smrwe04Lw"; // get from https://dashboard.web3auth.io
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
const web3AuthOptions: Web3AuthOptions = {
  clientId,
  privateKeyProvider,
  chains: [chain],
  defaultChainId: "0x6",
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
};
// IMP END - Instantiate SDK

// IMP START - Instantiate SDK
const web3AuthContextConfig = {
  web3AuthOptions
};
// IMP END - Instantiate SDK

export default web3AuthContextConfig; 