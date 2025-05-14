// IMP START - Quick Start
import { WALLET_CONNECTORS, WEB3AUTH_NETWORK } from "@web3auth/modal";
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
    authBuildEnv: "testing",
    modalConfig: {
      connectors: {
        [WALLET_CONNECTORS.AUTH]: {
          label: "auth",
          loginMethods: {
            google: {
              name: "google login",
              // logoDark: "url to your custom logo which will shown in dark mode",
            },
            facebook: {
              // it will hide the facebook option from the Web3Auth modal.
              name: "facebook login",
              showOnModal: false,
            },
            email_passwordless: {
              name: "email passwordless login",
              showOnModal: true,
              authConnectionId: "w3a-email_passwordless-demo"
            },
            sms_passwordless: {
              name: "sms passwordless login",
              showOnModal: true,
              authConnectionId: "w3a-sms_passwordless-demo"
            }
          },
          // setting it to false will hide all social login methods from modal.
          showOnModal: true,
        }
      },
      // setting it to true will hide the external wallets discovery.
      hideWalletDiscovery: true,
    },
  }
};
// IMP END - Instantiate SDK

export default web3AuthContextConfig;
