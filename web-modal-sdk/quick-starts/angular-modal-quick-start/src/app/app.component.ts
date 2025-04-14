import { Component } from "@angular/core";
// IMP START - Quick Start
import { CONNECTOR_EVENTS, IProvider, Web3Auth, WEB3AUTH_NETWORK, Web3AuthOptions } from "@web3auth/modal";

// IMP END - Quick Start
// IMP START - Blockchain Calls
import RPC from "./ethersRPC";
// import RPC from "./viemRPC";
// import RPC from "./web3RPC";
// IMP END - Blockchain Calls

// IMP START - Dashboard Registration
const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // get from https://dashboard.web3auth.io
// IMP END - Dashboard Registration

// IMP START - SDK Initialization

const web3AuthOptions: Web3AuthOptions = {
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  authBuildEnv: "testing",
};
const web3auth = new Web3Auth(web3AuthOptions);
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

        web3auth.on(CONNECTOR_EVENTS.CONNECTED, () => {
          this.loggedIn = true;
        });
      } catch (error) {
        // Log the error using a custom logging service or handle it appropriately
        this.uiConsole("An error occurred:", error);
      }
    };

    init();
  }

  login = async () => {
    // IMP START - Login
    const web3authProvider = await web3auth.connect();
    // IMP END - Login
    this.provider = web3authProvider;
    web3auth.on(CONNECTOR_EVENTS.CONNECTED, () => {
      this.loggedIn = true;
    });
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
