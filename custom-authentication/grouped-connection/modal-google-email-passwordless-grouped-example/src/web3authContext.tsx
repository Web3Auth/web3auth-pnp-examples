// IMP START - Quick Start
import { AUTH_CONNECTION, WALLET_CONNECTORS, WEB3AUTH_NETWORK } from "@web3auth/modal";
import { type Web3AuthContextConfig } from "@web3auth/modal/react";
// IMP END - Quick Start

// IMP START - Dashboard Registration
const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // get from https://dashboard.web3auth.io
// IMP END - Dashboard Registration

// IMP START - Instantiate SDK
const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
    modalConfig: {
      connectors: {
        [WALLET_CONNECTORS.AUTH]: {
          label: "auth",
          loginMethods: {
            google: {
              name: "google login",
              authConnectionId: "w3a-google",
              groupedAuthConnectionId: "aggregate-sapphire",
            },
            facebook: {
              name: "facebook login",
              authConnectionId: "w3a-facebook",
              groupedAuthConnectionId: "aggregate-sapphire"
            },
            email_passwordless: {
              name: "email passwordless login",
              authConnectionId: "w3a-email-passwordless",
              groupedAuthConnectionId: "aggregate-sapphire"
            },
          },
        }
      },
    },
  }
};
// IMP END - Instantiate SDK

export default web3AuthContextConfig;
