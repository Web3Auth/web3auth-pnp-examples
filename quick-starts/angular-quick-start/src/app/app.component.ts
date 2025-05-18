import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Web3Auth, CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/modal";
import { environment } from '../environments/environment';

// IMP START - Quick Start
import { IProvider } from "@web3auth/modal";

// IMP END - Quick Start

// IMP START - Blockchain Calls
import RPC from "./ethersRPC";
// import RPC from "./viemRPC";
// IMP END - Blockchain Calls

// IMP START - Dashboard Registration
const clientId = environment.web3AuthClientId || ""; // get from https://dashboard.web3auth.io
// IMP END - Dashboard Registration

const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  authBuildEnv: "testing",
});
// IMP END - SDK Initialization


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})

export class AppComponent implements OnInit {
  title = "angular-app";

  provider: IProvider | null = null;

  isModalLoaded = false;

  loggedIn = false;

  async ngOnInit() {
    const init = async () => {
      try {
        // IMP START - SDK Initialization
        await web3auth.init();
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
  // Check the RPC file for the implementation
  getAccounts = async () => {
    if (!this.provider) {
      this.uiConsole("provider not initialized yet");
      return;
    }
    const address = await RPC.getAccounts(this.provider);
    this.uiConsole(address);
  };

  getBalance = async () => {
    if (!this.provider) {
      this.uiConsole("provider not initialized yet");
      return;
    }
    const balance = await RPC.getBalance(this.provider);
    this.uiConsole(balance);
  };

  signMessage = async () => {
    if (!this.provider) {
      this.uiConsole("provider not initialized yet");
      return;
    }
    const signedMessage = await RPC.signMessage(this.provider);
    this.uiConsole(signedMessage);
  };


  sendTransaction = async () => {
    if (!this.provider) {
      this.uiConsole("provider not initialized yet");
      return;
    }
    this.uiConsole("Sending Transaction...");
    const transactionReceipt = await RPC.sendTransaction(this.provider);
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
