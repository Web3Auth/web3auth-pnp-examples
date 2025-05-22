// IMP START - Quick Start
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/modal";
import { type Web3AuthContextConfig } from "@web3auth/modal/vue";
// IMP END - Quick Start

// IMP START - Dashboard Registration
const clientId = process.env.VUE_APP_WEB3AUTH_CLIENT_ID || ""; // get from https://dashboard.web3auth.io
// IMP END - Dashboard Registration

// IMP START - Instantiate SDK
const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
    defaultChainId: "0x66",
  }
};
// IMP END - Instantiate SDK

export default web3AuthContextConfig;
