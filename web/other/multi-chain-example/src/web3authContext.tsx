// IMP START - Quick Start
import { WEB3AUTH_NETWORK, type Web3AuthNoModalOptions } from "@web3auth/no-modal";

// IMP END - Quick Start

// IMP START - Dashboard Registration
const clientId = "BEPiu8uKOHUemeiehDF7pLspv9MR3b03cCJmba5JutbHllBVA9bGRUeeunf27JNkZreW6gBObdW3tX8AHz6BoUk"; // get from https://dashboard.web3auth.io
// IMP END - Dashboard Registration

// IMP START - Instantiate SDK
const web3AuthOptions: Web3AuthNoModalOptions = {
  clientId,
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
