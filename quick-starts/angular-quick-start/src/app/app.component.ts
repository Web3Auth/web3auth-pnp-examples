import { Component, OnInit } from '@angular/core';
// IMP START - Quick Start
import { EVM_PLUGINS, Web3Auth, WEB3AUTH_NETWORK } from "@web3auth/modal";
import { type WalletServicesPluginType } from "@web3auth/no-modal";
// IMP END - Quick Start

// IMP START - Blockchain Calls
// import RPC from "./ethersRPC";
import RPC from "./viemRPC";
// IMP END - Blockchain Calls

// IMP START - Dashboard Registration
const clientId = "BHgArYmWwSeq21czpcarYh0EVq2WWOzflX-NTK-tY1-1pauPzHKRRLgpABkmYiIV_og9jAvoIxQ8L3Smrwe04Lw"; // get from https://dashboard.web3auth.io
// IMP END - Dashboard Registration

// IMP START - Config
const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  // No need to manually add walletServicesPlugin! It's auto-added for EVM/Solana chains
});

let walletServicesPlugin: WalletServicesPluginType | null = null;
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
          // Get the plugin after web3auth is connected
          walletServicesPlugin = web3auth.getPlugin(EVM_PLUGINS.WALLET_SERVICES) as WalletServicesPluginType;
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
      // The wallet services plugin is automatically available!
      walletServicesPlugin = web3auth.getPlugin(EVM_PLUGINS.WALLET_SERVICES) as WalletServicesPluginType;
    }
  };

  getUserInfo = async () => {
    const user = await web3auth.getUserInfo();
    this.uiConsole(user);
  };

  // IMP START - Wallet Services Methods
  showWalletUI = async () => {
    if (!walletServicesPlugin) {
      this.uiConsole("Wallet services plugin not available. Please login first.");
      return;
    }

    try {
      // Check if web3auth is connected first
      if (!web3auth.connected) {
        this.uiConsole("Web3Auth is not connected. Please login first.");
        return;
      }

      // Check web3auth status - it should be 'connected'
      if (web3auth.status !== 'connected') {
        this.uiConsole("Web3Auth is not ready. Current status:", web3auth.status);
        return;
      }

      // For newer versions, check plugin status if available
      if (walletServicesPlugin.status && walletServicesPlugin.status !== 'connected') {
        this.uiConsole("Wallet plugin is not connected. Status:", walletServicesPlugin.status);
        return;
      }

      await walletServicesPlugin.showWalletUi({ show: true });
      this.uiConsole("Wallet UI opened successfully");
    } catch (error) {
      this.uiConsole("Error showing wallet UI:", error);
    }
  };

  showCheckout = async () => {
    if (!walletServicesPlugin) {
      this.uiConsole("Wallet services plugin not available. Please login first.");
      return;
    }

    try {
      // Check if web3auth is connected first
      if (!web3auth.connected) {
        this.uiConsole("Web3Auth is not connected. Please login first.");
        return;
      }

      // Check web3auth status - it should be 'connected'
      if (web3auth.status !== 'connected') {
        this.uiConsole("Web3Auth is not ready. Current status:", web3auth.status);
        return;
      }

      await walletServicesPlugin.showCheckout({ show: true });
      this.uiConsole("Checkout modal opened successfully");
    } catch (error) {
      this.uiConsole("Error showing checkout:", error);
    }
  };

  showWalletConnectScanner = async () => {
    if (!walletServicesPlugin) {
      this.uiConsole("Wallet services plugin not available. Please login first.");
      return;
    }

    try {
      // Check if web3auth is connected first
      if (!web3auth.connected) {
        this.uiConsole("Web3Auth is not connected. Please login first.");
        return;
      }

      // Check web3auth status - it should be 'connected'
      if (web3auth.status !== 'connected') {
        this.uiConsole("Web3Auth is not ready. Current status:", web3auth.status);
        return;
      }

      await walletServicesPlugin.showWalletConnectScanner({ show: true });
      this.uiConsole("WalletConnect scanner opened successfully");
    } catch (error) {
      this.uiConsole("Error showing WalletConnect scanner:", error);
    }
  };

  showSwap = async () => {
    if (!walletServicesPlugin) {
      this.uiConsole("Wallet services plugin not available. Please login first.");
      return;
    }

    try {
      // Check if web3auth is connected first
      if (!web3auth.connected) {
        this.uiConsole("Web3Auth is not connected. Please login first.");
        return;
      }

      // Check web3auth status - it should be 'connected'
      if (web3auth.status !== 'connected') {
        this.uiConsole("Web3Auth is not ready. Current status:", web3auth.status);
        return;
      }

      await walletServicesPlugin.showSwap({ show: true });
      this.uiConsole("Swap interface opened successfully");
    } catch (error) {
      this.uiConsole("Error showing swap interface:", error);
    }
  };

  logout = async () => {
    // IMP START - Logout
    await web3auth.logout();
    // IMP END - Logout
    this.loggedIn = false;
    walletServicesPlugin = null;
    this.uiConsole("logged out");
  };

  // IMP START - Blockchain Calls
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
