import { WEB3AUTH_NETWORK, type Web3AuthOptions } from "@web3auth/modal";

// Dashboard Registration
const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID;

// Instantiate SDK
const web3AuthOptions: Web3AuthOptions = {
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  
};

const web3AuthContextConfig = {
  web3AuthOptions
};

export default web3AuthContextConfig; 
