// IMP START - Quick Start
import { WEB3AUTH_NETWORK, getEvmChainConfig } from "@web3auth/base";
import { getDefaultExternalAdapters } from "@web3auth/default-evm-adapter";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3AuthOptions } from "@web3auth/modal";
// IMP END - Quick Start

// IMP START - Dashboard Registration
const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // get from https://dashboard.web3auth.io
// IMP END - Dashboard Registration

// IMP START - Chain Config
const chainId = 11155367; // Sepolia testnet
const chainConfig = getEvmChainConfig(chainId, clientId)!;
// IMP END - Chain Config

// IMP START - Instantiate SDK
const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: {
    chainConfig,
  },
});

const web3AuthOptions: Web3AuthOptions = {
  chainConfig,
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  privateKeyProvider,
};
// IMP END - Instantiate SDK

// IMP START - Configuring External Wallets
const adapters = getDefaultExternalAdapters({ options: web3AuthOptions });
// IMP END - Configuring External Wallets

// IMP START - Instantiate SDK
const web3AuthContextConfig = {
  web3AuthOptions,
  // IMP START - Configuring External Wallets
  adapters: [...adapters],
  // IMP END - Configuring External Wallets
};
// IMP END - Instantiate SDK

export default web3AuthContextConfig;
