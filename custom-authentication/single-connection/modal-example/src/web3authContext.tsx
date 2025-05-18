// IMP START - Quick Start
import { WALLET_CONNECTORS, WEB3AUTH_NETWORK } from "@web3auth/modal";
import { type Web3AuthContextConfig } from "@web3auth/modal/react";
// IMP END - Quick Start

// IMP START - Dashboard Registration
const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID; // get from https://dashboard.web3auth.io
// IMP END - Dashboard Registration

// IMP START - Instantiate SDK
const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
    authBuildEnv: "testing",
    multiInjectedProviderDiscovery: false,
    modalConfig: {
      connectors: {
        [WALLET_CONNECTORS.AUTH]: {
          label: "auth",
          loginMethods: {
            google: {
              name: "google login",
              authConnectionId: "w3a-google-demo",
            },
            facebook: {
              name: "facebook login",
              authConnectionId: "w3a-facebook-demo",
            },
            discord: {
              name: "discord login",
              authConnectionId: "w3a-discord-demo",  
            },
            twitch: {
              name: "twitch login",
              authConnectionId: "w3a-twitch-demo",
            },
            twitter: {
              name: "twitter login",
              // it will hide the twitter option from the Web3Auth modal.
              showOnModal: false,
            },
            email_passwordless: {
              name: "email passwordless login",
              authConnectionId: "w3a-email_passwordless-demo"
            },
            sms_passwordless: {
              name: "sms passwordless login",
              authConnectionId: "w3a-sms_passwordless-demo"
            }
          },
          // setting it to false will hide all social login methods from modal.
          showOnModal: true,
        }
      },
    },
  }
};
// IMP END - Instantiate SDK

export default web3AuthContextConfig;
