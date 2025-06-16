// IMP START - Quick Start
import { WEB3AUTH_NETWORK, type Web3AuthOptions } from "@web3auth/modal";

// IMP END - Quick Start

// IMP START - Dashboard Registration
const clientId = "BHgArYmWwSeq21czpcarYh0EVq2WWOzflX-NTK-tY1-1pauPzHKRRLgpABkmYiIV_og9jAvoIxQ8L3Smrwe04Lw"; // get from https://dashboard.web3auth.io
// IMP END - Dashboard Registration

// IMP START - Instantiate SDK
const web3AuthOptions: Web3AuthOptions = {
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  
};
// IMP END - Instantiate SDK

// IMP START - Instantiate SDK
const web3AuthContextConfig = {
  web3AuthOptions
};
// IMP END - Instantiate SDK

export default web3AuthContextConfig;
