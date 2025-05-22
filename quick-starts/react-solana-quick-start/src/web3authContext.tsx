// IMP START - Quick Start
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/modal";
import { type Web3AuthContextConfig } from "@web3auth/modal/react";
// IMP END - Quick Start

// IMP START - Dashboard Registration
const clientId = "BNKBiPHOyRfDrxW9Or1KhHuQocTz78Oo55AOeKipI0x2J8TalrpNvNKVmBi_DNprZnVvNsyckuuoovEOYQqYX_I"; // get from https://dashboard.web3auth.io
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
