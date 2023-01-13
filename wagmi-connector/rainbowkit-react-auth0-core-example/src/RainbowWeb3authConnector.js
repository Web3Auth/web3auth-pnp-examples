import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { Web3AuthCore } from "@web3auth/core";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { CHAIN_NAMESPACES } from "@web3auth/base";

const name = "Login with Auth0";
const iconUrl = "https://avatars.githubusercontent.com/u/2824157?s=280&v=4";

export const rainbowWeb3AuthConnector = ({ chains }) => {
  // Create Web3Auth Instance
  const web3AuthInstance = new Web3AuthCore({
    clientId: "YOUR_CLIENT_ID",
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: "0x"+chains[0].id.toString(16),
      rpcTarget: chains[0].rpcUrls.default.http[0], // This is the public RPC we have added, please pass on your own endpoint while creating an app
      displayName: chains[0].name,
      tickerName: chains[0].nativeCurrency?.name,
      ticker: chains[0].nativeCurrency?.symbol,
      blockExplorer: chains[0]?.blockExplorers.default?.url,
    },
  });

  // Add openlogin adapter for customisations
  const openloginAdapter = new OpenloginAdapter({
    adapterSettings: {
      network: "cyan",
      uxMode: "popup",
      loginConfig: {
        jwt: {
          name: "Web3Auth-Auth0-JWT",
          verifier: "web3auth-auth0-demo",
          typeOfLogin: "jwt",
          clientId: "294QRkchfq2YaXUbPri7D6PH7xzHgQMT",
        },
      },
    },
  });
  web3AuthInstance.configureAdapter(openloginAdapter);

  return ({
    id: "web3auth",
    name,
    iconUrl,
    iconBackground: "#fff",
    createConnector: () => {
      const connector = new Web3AuthConnector({
        chains: chains,
        options: { 
          web3AuthInstance,
          loginParams: {
            relogin: true,
            loginProvider: "jwt",
            extraLoginOptions: {
              domain: "https://shahbaz-torus.us.auth0.com",
              verifierIdField: "sub",
            },
          },
        },
      });
      return {
        connector,
      };
    },
  })
};
