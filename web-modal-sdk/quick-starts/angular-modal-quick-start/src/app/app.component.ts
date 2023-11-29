// IMP START - Quick Start
import { Component } from "@angular/core";
// IMP END - Quick Start
import { CHAIN_NAMESPACES, IProvider } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import Web3 from "web3";

// IMP START - SDK Initialization
// IMP START - Dashboard Registration
const clientId = "BEglQSgt4cUWcj6SKRdu5QkOXTsePmMcusG5EAoyjyOYKlVRjIF1iCNnMOTfpzCiunHRrMui8TIwQPXdkQ8Yxuk"; // get from https://dashboard.web3auth.io
// IMP END - Dashboard Registration

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x1", // Please use 0x1 for Mainnet
  rpcTarget: "https://rpc.ankr.com/eth",
  displayName: "Ethereum Mainnet",
  blockExplorer: "https://etherscan.io/",
  ticker: "ETH",
  tickerName: "Ethereum",
};

const web3auth = new Web3Auth({
  clientId,
  chainConfig,
  web3AuthNetwork: "sapphire_mainnet",
});
// IMP END - SDK Initialization

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})

export class AppComponent {
  title = "angular-app";

  provider: IProvider | null = null;

  isModalLoaded = false;

  loggedIn = false;

  async ngOnInit() {
    const init = async () => {
      try {
        // IMP START - SDK Initialization
        await web3auth.initModal();
        // IMP END - SDK Initialization
        this.provider = web3auth.provider;

        if (web3auth.connected) {
          this.loggedIn = true;
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }

  login = async () => {
    // IMP START - Login
    const web3authProvider = await web3auth.connect();
    // IMP END - Login
    this.provider = web3authProvider;
    if (web3auth.connected) {
      this.loggedIn = true;
    }
  };

  getUserInfo = async () => {
    // IMP START - Get User Information
    const user = await web3auth.getUserInfo();
    // IMP END - Get User Information
    this.uiConsole(user);
  };

  logout = async () => {
    // IMP START - Logout
    await web3auth.logout();
    // IMP END - Logout
    this.provider = null;
    this.loggedIn = false;
    this.uiConsole("logged out");
  };

  // IMP START - Blockchain Calls
  getAccounts = async () => {
    if (!this.provider) {
      this.uiConsole("provider not initialized yet");
      return;
    }
    const web3 = new Web3(this.provider as any);

    // Get user's Ethereum public address
    const address = await web3.eth.getAccounts();
    this.uiConsole(address);
  };

  getBalance = async () => {
    if (!this.provider) {
      this.uiConsole("provider not initialized yet");
      return;
    }
    const web3 = new Web3(this.provider as any);

    // Get user's Ethereum public address
    const address = (await web3.eth.getAccounts())[0];

    // Get user's balance in ether
    const balance = web3.utils.fromWei(
      await web3.eth.getBalance(address), // Balance is in wei
      "ether"
    );
    this.uiConsole(balance);
  };

  signMessage = async () => {
    if (!this.provider) {
      this.uiConsole("provider not initialized yet");
      return;
    }
    const web3 = new Web3(this.provider as any);

    // Get user's Ethereum public address
    const fromAddress = (await web3.eth.getAccounts())[0];

    const originalMessage = "YOUR_MESSAGE";

    // Sign the message
    const signedMessage = await web3.eth.personal.sign(
      originalMessage,
      fromAddress,
      "test password!" // configure your own password here.
    );
    this.uiConsole(signedMessage);
  };
  // IMP END - Blockchain Calls

  uiConsole(...args: any[]) {
    const el = document.querySelector("#console-ui>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }
}
