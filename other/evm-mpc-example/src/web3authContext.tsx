// IMP START - Quick Start
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK, type Web3AuthOptions } from "@web3auth/modal";
import { EthereumSigningProvider } from "@web3auth/modal/providers/ethereum-mpc-provider";
// IMP END - Quick Start

// IMP START - Dashboard Registration
const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // get from https://dashboard.web3auth.io
// IMP END - Dashboard Registration

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x11155111",
  rpcTarget: "https://sepolia.infura.io/v3/b566e55d-4dc3-480d-841e-08c643c88839",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  displayName: "Ethereum Sepolia",
  logo: "https://web3auth.io/images/w3a-logo.svg",
};

// Create MPC provider
const privateKeyProvider = new EthereumSigningProvider({
  config: {
    chain: chainConfig,
    chains: [chainConfig],
  }
});

// IMP START - Instantiate SDK
const web3AuthOptions: Web3AuthOptions = {
  clientId,
  privateKeyProvider,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  
};
// IMP END - Instantiate SDK

// IMP START - Instantiate SDK
const web3AuthContextConfig = {
  web3AuthOptions
};
// IMP END - Instantiate SDK

export default web3AuthContextConfig; 