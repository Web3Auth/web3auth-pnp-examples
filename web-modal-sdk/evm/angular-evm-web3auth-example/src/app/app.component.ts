import { Component } from "@angular/core";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";
import { Web3Auth } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { TorusWalletAdapter } from "@web3auth/torus-evm-adapter";
// import RPC from "./ethersRPC"; // for using ethers.js
// Plugins
import { TorusWalletConnectorPlugin } from "@web3auth/torus-wallet-connector-plugin";
// Adapters
import { WalletConnectV1Adapter } from "@web3auth/wallet-connect-v1-adapter";

import RPC from "./web3RPC"; // for using web3.js

const clientId = "BEglQSgt4cUWcj6SKRdu5QkOXTsePmMcusG5EAoyjyOYKlVRjIF1iCNnMOTfpzCiunHRrMui8TIwQPXdkQ8Yxuk"; // get from https://dashboard.web3auth.io

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "angular-app";

  web3auth: Web3Auth | null = null;

  provider: SafeEventEmitterProvider | null = null;

  isModalLoaded = false;

  async ngOnInit() {
    this.web3auth = new Web3Auth({
      clientId,
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0x1",
        rpcTarget: "https://rpc.ankr.com/eth", // This is the public RPC we have added, please pass on your own endpoint while creating an app
      },
      web3AuthNetwork: "cyan",
    });
    const { web3auth } = this;

    const openloginAdapter = new OpenloginAdapter({});
    web3auth.configureAdapter(openloginAdapter);

    // plugins and adapters are optional and can be added as per your requirement
    // read more about plugins here: https://web3auth.io/docs/sdk/web/plugins/

    // adding torus wallet connector plugin

    const torusPlugin = new TorusWalletConnectorPlugin({
      torusWalletOpts: {},
      walletInitOptions: {
        whiteLabel: {
          theme: { isDark: true, colors: { primary: "#00a8ff" } },
          logoDark: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
          logoLight: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
        },
        useWalletConnect: true,
        enableLogging: true,
      },
    });
    await web3auth.addPlugin(torusPlugin);

    // read more about adapters here: https://web3auth.io/docs/sdk/web/adapters/

    // adding wallet connect v1 adapter

    const walletConnectV1Adapter = new WalletConnectV1Adapter({
      adapterSettings: {
        bridge: "https://bridge.walletconnect.org",
      },
      clientId,
    });

    web3auth.configureAdapter(walletConnectV1Adapter);

    // adding metamask adapter

    const metamaskAdapter = new MetamaskAdapter({
      clientId,
      sessionTime: 3600, // 1 hour in seconds
      web3AuthNetwork: "cyan",
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0x1",
        rpcTarget: "https://rpc.ankr.com/eth", // This is the public RPC we have added, please pass on your own endpoint while creating an app
      },
    });
    // we can change the above settings using this function
    metamaskAdapter.setAdapterSettings({
      sessionTime: 86400, // 1 day in seconds
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0x89",
        rpcTarget: "https://rpc-mainnet.matic.network", // This is the public RPC we have added, please pass on your own endpoint while creating an app
      },
      web3AuthNetwork: "cyan",
    });

    // it will add/update  the metamask adapter in to web3auth class
    web3auth.configureAdapter(metamaskAdapter);

    const torusWalletAdapter = new TorusWalletAdapter({
      clientId,
    });

    // it will add/update  the torus-evm adapter in to web3auth class
    web3auth.configureAdapter(torusWalletAdapter);

    await web3auth.initModal();
    if (web3auth.provider) {
      this.provider = web3auth.provider;
    }
    this.isModalLoaded = true;
  }

  login = async () => {
    if (!this.web3auth) {
      this.uiConsole("web3auth not initialized yet");
      return;
    }
    const { web3auth } = this;
    this.provider = await web3auth.connect();
    this.uiConsole("Logged in successfully!");
  };

  authenticateUser = async () => {
    if (!this.web3auth) {
      this.uiConsole("web3auth not initialized yet");
      return;
    }
    const id_token = await this.web3auth.authenticateUser();
    this.uiConsole(id_token);
  };

  getUserInfo = async () => {
    if (!this.web3auth) {
      this.uiConsole("web3auth not initialized yet");
      return;
    }
    const user = await this.web3auth.getUserInfo();
    this.uiConsole(user);
  };

  getChainId = async () => {
    if (!this.provider) {
      this.uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(this.provider);
    const chainId = await rpc.getChainId();
    this.uiConsole(chainId);
  };

  getAccounts = async () => {
    if (!this.provider) {
      this.uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(this.provider);
    const address = await rpc.getAccounts();
    this.uiConsole(address);
  };

  getBalance = async () => {
    if (!this.provider) {
      this.uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(this.provider);
    const balance = await rpc.getBalance();
    this.uiConsole(balance);
  };

  sendTransaction = async () => {
    if (!this.provider) {
      this.uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(this.provider);
    const receipt = await rpc.sendTransaction();
    this.uiConsole(receipt);
  };

  signMessage = async () => {
    if (!this.provider) {
      this.uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(this.provider);
    const signedMessage = await rpc.signMessage();
    this.uiConsole(signedMessage);
  };

  getPrivateKey = async () => {
    if (!this.provider) {
      this.uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(this.provider);
    const privateKey = await rpc.getPrivateKey();
    this.uiConsole(privateKey);
  };

  logout = async () => {
    if (!this.web3auth) {
      this.uiConsole("web3auth not initialized yet");
      return;
    }
    await this.web3auth.logout();
    this.provider = null;
    this.uiConsole("logged out");
  };

  uiConsole(...args: any[]) {
    const el = document.querySelector("#console-ui>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }
}
