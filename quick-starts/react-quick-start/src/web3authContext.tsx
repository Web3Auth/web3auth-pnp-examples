// IMP START - Quick Start
import { AUTH_CONNECTION, MFA_LEVELS, WALLET_CONNECTORS, WEB3AUTH_NETWORK } from "@web3auth/modal";
import { type Web3AuthContextConfig } from "@web3auth/modal/react";
// IMP END - Quick Start

// IMP START - Dashboard Registration
const clientId = "BLQifFrG2BK7I719MiqtKAgTC38zPZbxPnsDrcYVJ0mrJQG9K-ev6r8Z4c83n46fRLpCwEgsqbZS5lFWyJW-eCY"; // get from https://dashboard.web3auth.io
// IMP END - Dashboard Registration

// IMP START - Config
const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.MAINNET,
    mfaLevel: MFA_LEVELS.NONE,
    modalConfig: {
      connectors: {
        [WALLET_CONNECTORS.AUTH]: {
          label: "auth",
          loginMethods: {
            google: {
              name: "google login",
              authConnectionId: "tlnt-google",
            },
          },
        },
      },
    },
  }
};
// IMP END - Config

export default web3AuthContextConfig;
