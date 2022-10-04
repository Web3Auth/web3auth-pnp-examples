import NodeDetailManager from "@toruslabs/fetch-node-details";
import Torus from "@toruslabs/torus.js";

const TORUS_NETWORK = {
    TESTNET: "testnet",
    MAINNET: "mainnet",
    CYAN: "cyan",
  } 
  
  export const CONTRACT_MAP = {
    [TORUS_NETWORK.MAINNET]: NodeDetailManager.PROXY_ADDRESS_MAINNET,
    [TORUS_NETWORK.TESTNET]: NodeDetailManager.PROXY_ADDRESS_ROPSTEN,
    [TORUS_NETWORK.CYAN]: NodeDetailManager.PROXY_ADDRESS_POLYGON,
  };
  
  export const NETWORK_MAP = {
    [TORUS_NETWORK.MAINNET]: "https://rpc.ankr.com/eth",
    [TORUS_NETWORK.TESTNET]: "https://rpc.ankr.com/eth_ropsten",
    [TORUS_NETWORK.CYAN]: "https://rpc.ankr.com/polygon",
  };
  
  export const network = NETWORK_MAP[TORUS_NETWORK.TESTNET];
  export const verifier = "web3auth-core-firebase";
  
  export const clientId =
    "BKjpD5DNAFDbX9Ty9RSBAXdQP8YDY1rldKqKCgbxxa8JZODZ8zxVRzlT74qRIHsor5aIwZ55dQVlcmrwJu37PI8"; // get from https://dashboard.web3auth.io
  
export const chainConfig = {
    chainId: "0x3",
    rpcTarget: "https://rpc.ankr.com/eth_ropsten",
    displayName: "Ropsten Testnet",
    blockExplorer: "https://ropsten.etherscan.io/",
    ticker: "ETH",
    tickerName: "Ethereum",
  };
  
  // Your web app's Firebase configuration
  export const firebaseConfig = {
    apiKey: "AIzaSyB0nd9YsPLu-tpdCrsXn8wgsWVAiYEpQ_E",
    authDomain: "web3auth-oauth-logins.firebaseapp.com",
    projectId: "web3auth-oauth-logins",
    storageBucket: "web3auth-oauth-logins.appspot.com",
    messagingSenderId: "461819774167",
    appId: "1:461819774167:web:e74addfb6cc88f3b5b9c92",
  };
  
  
  export const torus = new Torus({
    enableOneKey: true,
    network,
  });
  
  export const nodeDetailManager = new NodeDetailManager({ network, proxyAddress: CONTRACT_MAP[TORUS_NETWORK.TESTNET] });
  