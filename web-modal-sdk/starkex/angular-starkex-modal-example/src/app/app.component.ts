import { Component } from "@angular/core";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";

import RPC from "./starkexRPC";
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

  loggedIn = false;

  async ngOnInit() {
    this.web3auth = new Web3Auth({
      clientId,
      chainConfig: {
        chainId: "0x1",
        rpcTarget: "https://rpc.ankr.com/eth",
        chainNamespace: CHAIN_NAMESPACES.OTHER,
      },
      // uiConfig refers to the whitelabeling options, which is available only on Growth Plan and above
          // Please remove this parameter if you're on the Base Plan
          uiConfig: {
        appName: "W3A",
        // appLogo: "https://web3auth.io/images/w3a-L-Favicon-1.svg", // Your App Logo Here
        theme: {
          primary: "red",
        },
        mode: "dark",
        logoLight: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
        logoDark: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
        defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
        loginGridCol: 3,
        primaryButton: "externalLogin", // "externalLogin" | "socialLogin" | "emailLogin"
      },
      web3AuthNetwork: "cyan",
    });
    const { web3auth } = this;

    await web3auth.initModal();
    if (web3auth.connected) {
      this.provider = web3auth.provider;
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
    this.uiConsole("Logged in Successfully!");
  };

  authenticateUser = async () => {
    if (!this.web3auth) {
      this.uiConsole("web3auth not initialized yet");
      return;
    }
    const idToken = await this.web3auth.authenticateUser();
    this.uiConsole(idToken);
  };

  getUserInfo = async () => {
    if (!this.web3auth) {
      this.uiConsole("web3auth not initialized yet");
      return;
    }
    const user = await this.web3auth.getUserInfo();
    this.uiConsole(user);
  };

  onGetStarkAccount = async () => {
    if (!this.provider) {
      this.uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(this.provider as SafeEventEmitterProvider);
    const starkaccounts = await rpc.getStarkAccount();
    this.uiConsole(starkaccounts);
  };

  getStarkKey = async () => {
    if (!this.provider) {
      this.uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(this.provider as SafeEventEmitterProvider);
    const starkKey = await rpc.getStarkKey();
    this.uiConsole(starkKey);
  };

  onMintRequest = async () => {
    if (!this.provider) {
      this.uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(this.provider as SafeEventEmitterProvider);
    const request = await rpc.onMintRequest();
    this.uiConsole(request);
  };

  onDepositRequest = async () => {
    if (!this.provider) {
      this.uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(this.provider as SafeEventEmitterProvider);
    const request = await rpc.onDepositRequest();
    this.uiConsole(request);
  };

  onWithdrawalRequest = async () => {
    if (!this.provider) {
      this.uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(this.provider as SafeEventEmitterProvider);
    const request = await rpc.onWithdrawalRequest();
    this.uiConsole(request);
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
