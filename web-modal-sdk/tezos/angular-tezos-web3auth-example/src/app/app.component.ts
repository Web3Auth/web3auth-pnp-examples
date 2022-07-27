import { Component } from "@angular/core";
import { Web3Auth } from "@web3auth/web3auth";
import { WALLET_ADAPTERS, CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import RPC from "./tezosRPC";
const clientId = "YOUR_CLIENT_ID"; // get from https://dashboard.web3auth.io

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
          chainNamespace: CHAIN_NAMESPACES.OTHER
        },
      });
      const web3auth = this.web3auth

      const openloginAdapter = new OpenloginAdapter({
        adapterSettings: {
          clientId,
          network: "testnet",
          uxMode: "popup",  
        },
      });
      web3auth.configureAdapter(openloginAdapter);

      await web3auth.initModal();
      if (web3auth.provider) {
        this.provider = web3auth.provider;
      }
      this.isModalLoaded = true;
    }

    login = async () => {
    if (!this.web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3auth = this.web3auth;
    this.provider = await web3auth.connect();
    console.log("logged in");
    };

    getUserInfo = async () => {
      if (!this.web3auth) {
        console.log("web3auth not initialized yet");
        return;
      }
      const user = await this.web3auth.getUserInfo();
      console.log(user);
    };

    onGetTezosKeyPair = async () => {
      if (!this.provider) {
        console.log("provider not initialized yet");
        return;
      }
      const rpc = new RPC(this.provider as SafeEventEmitterProvider);
      const tezosKey = await rpc.getTezosKeyPair();
      console.log(tezosKey);
    };

    getAccounts = async () => {
      if (!this.provider) {
        console.log("provider not initialized yet");
        return;
      }
      const rpc = new RPC(this.provider);
      const userAccount = await rpc.getAccounts();
      console.log(userAccount);
    };

    getBalance = async () => {
      if (!this.provider) {
        console.log("provider not initialized yet");
        return;
      }
      const rpc = new RPC(this.provider);
      const balance = await rpc.getBalance();
      console.log(balance);
    };

    signMessage = async () => {
      if (!this.provider) {
        console.log("provider not initialized yet");
        return;
      }
      const rpc = new RPC(this.provider);
      const result = await rpc.signMessage();
      console.log(result);
    };

    signAndSendTransaction = async () => {
      if (!this.provider) {
        console.log("provider not initialized yet");
        return;
      }
      const rpc = new RPC(this.provider);
      const result = await rpc.signAndSendTransaction();
      console.log(result);
    };

    logout = async () => {
      if (!this.web3auth) {
        console.log("web3auth not initialized yet");
        return;
      }
      await this.web3auth.logout();
      this.provider = null;
      console.log("logged out");
    };
}