import { Component } from "@angular/core";
import { CHAIN_NAMESPACES, IProvider } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";

import RPC from "./tezosRPC";
const clientId = "BEglQSgt4cUWcj6SKRdu5QkOXTsePmMcusG5EAoyjyOYKlVRjIF1iCNnMOTfpzCiunHRrMui8TIwQPXdkQ8Yxuk"; // get from https://dashboard.web3auth.io

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "angular-app";

  web3auth: Web3Auth | null = null;

  provider: IProvider | null = null;

  loggedIn = false;

  isModalLoaded = false;

  async ngOnInit() {
    this.web3auth = new Web3Auth({
      clientId,
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.OTHER,
        chainId: "1",
        rpcTarget: "https://rpc.tzbeta.net/", // This is the public RPC we have added, please pass on your own endpoint while creating an app
      },
      uiConfig: {
        theme: "dark",
        loginMethodsOrder: ["google", "github"],
        defaultLanguage: "en",
        appLogo: "https://web3auth.io/images/w3a-L-Favicon-1.svg", // Your App Logo Here
      },
      web3AuthNetwork: "cyan",
    });
    const { web3auth } = this;

    await web3auth.initModal();
    this.provider = web3auth.provider;

    if (web3auth.connected) {
      this.loggedIn = true;
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
    this.loggedIn = true;
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

  onGetTezosKeyPair = async () => {
    if (!this.provider) {
      this.uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(this.provider as IProvider);
    const tezosKey = await rpc.getTezosKeyPair();
    this.uiConsole(tezosKey);
  };

  getAccounts = async () => {
    if (!this.provider) {
      this.uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(this.provider);
    const userAccount = await rpc.getAccounts();
    this.uiConsole(userAccount);
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

  signMessage = async () => {
    if (!this.provider) {
      this.uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(this.provider);
    const result = await rpc.signMessage();
    this.uiConsole(result);
  };

  signAndSendTransaction = async () => {
    if (!this.provider) {
      this.uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(this.provider);
    const result = await rpc.signAndSendTransaction();
    this.uiConsole(result);
  };

  logout = async () => {
    if (!this.web3auth) {
      this.uiConsole("web3auth not initialized yet");
      return;
    }
    await this.web3auth.logout();
    this.provider = null;
    this.loggedIn = false;
    this.uiConsole("logged out");
  };

  uiConsole(...args: any[]) {
    const el = document.querySelector("#console-ui>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }
}
