import { authConnector, walletServicesPlugin, WEB3AUTH_NETWORK, Web3AuthOptions } from "@web3auth/modal";

import { web3AuthChains } from "../config/chainConfig";

const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ";

const web3AuthOptions: Web3AuthOptions = {
  chains: web3AuthChains,
  defaultChainId: web3AuthChains[0].chainId,
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  connectors: [
    authConnector({
      loginSettings: {
        mfaLevel: "optional",
      },
    }),
  ],
  plugins: [walletServicesPlugin()],
};

export default web3AuthOptions;
