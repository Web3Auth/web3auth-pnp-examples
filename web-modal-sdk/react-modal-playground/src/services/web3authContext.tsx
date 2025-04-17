import { walletServicesPlugin, WEB3AUTH_NETWORK, Web3AuthOptions } from "@web3auth/modal";

const clientId = "BIpw3vwP0QqF_QecEtEFYxEac6pW7i478ouMUwg-qiWp8ipe-OkD6FUabv99lG0iVO02GWd591bJeiYiM1Sl_Nc";

const web3AuthOptions: Web3AuthOptions = {
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  authBuildEnv: "testing",
  plugins: [walletServicesPlugin()],
};

export default web3AuthOptions;
