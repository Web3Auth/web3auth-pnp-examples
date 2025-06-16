import { WALLET_CONNECTORS, WEB3AUTH_NETWORK } from "@web3auth/modal";
import { Web3AuthContextConfig } from "@web3auth/modal/react";

const clientId = "BHgArYmWwSeq21czpcarYh0EVq2WWOzflX-NTK-tY1-1pauPzHKRRLgpABkmYiIV_og9jAvoIxQ8L3Smrwe04Lw"; // get from https://dashboard.web3auth.io

const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    modalConfig: {
      connectors: {
        [WALLET_CONNECTORS.AUTH]: {
          label: "auth",
          loginMethods: {
            email_passwordless: {
              name: "email passwordless login",
              authConnectionId: "w3a-email-passwordless-demo"
            },
            sms_passwordless: {
              name: "sms passwordless login",
              authConnectionId: "w3a-sms-passwordless-dev-demo"
            }
          },
        }
      },
    },
  },
};

export default web3AuthContextConfig;
