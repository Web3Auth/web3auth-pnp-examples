import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
// IMP START - Quick Start
import { Web3Auth, WEB3AUTH_NETWORK } from "@web3auth/modal";
// IMP END - Quick Start

// IMP START - Blockchain Calls
// import RPC from "./ethersRPC";
import RPC from "./viemRPC";
// IMP END - Blockchain Calls

// IMP START - Dashboard Registration
const clientId = environment.WEB3AUTH_CLIENT_ID || ""; // get from https://dashboard.web3auth.io
// IMP END - Dashboard Registration

// IMP END - Config
const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  authBuildEnv: "testing",
});
// IMP END - Config


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})

export class AppComponent implements OnInit {
  title = "web3auth-angular-quick-start";

  loggedIn = false;

  async ngOnInit() {
    const init = async () => {
      try {
        // IMP START - SDK Initialization
        await web3auth.init();
        // IMP END - SDK Initialization

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
    await web3auth.connect();
    // IMP END - Login
    if (web3auth.connected) {
      this.loggedIn = true;
    }
  };

  getUserInfo = async () => {
    const user = await web3auth.getUserInfo();
    this.uiConsole(user);
  };

  logout = async () => {
    // IMP START - Logout
    await web3auth.logout();
    // IMP END - Logout
    this.loggedIn = false;
    this.uiConsole("logged out");
  };


  // IMP START - Blockchain Calls
  // Check the RPC file for the implementation
  getAccounts = async () => {
    const address = await RPC.getAccounts(web3auth.provider!);
    this.uiConsole(address);
  };

  getBalance = async () => {

    const balance = await RPC.getBalance(web3auth.provider!);
    this.uiConsole(balance);
  };

  signMessage = async () => {
    const signedMessage = await RPC.signMessage(web3auth.provider!);
    this.uiConsole(signedMessage);
  };


  sendTransaction = async () => {
    this.uiConsole("Sending Transaction...");
    const transactionReceipt = await RPC.sendTransaction(web3auth.provider!);
    this.uiConsole(transactionReceipt);
  };
  // IMP END - Blockchain Calls

  uiConsole(...args: unknown[]) {
    const el = document.querySelector("#console-ui>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }
}
