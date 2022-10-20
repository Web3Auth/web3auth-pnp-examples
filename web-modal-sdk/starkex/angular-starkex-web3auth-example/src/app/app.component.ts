import { Component } from '@angular/core';
import { Web3Auth } from '@web3auth/modal';
import {
  WALLET_ADAPTERS,
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
} from '@web3auth/base';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import RPC from './starkexRPC';
const clientId = 'YOUR_CLIENT_ID'; // get from https://dashboard.web3auth.io

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-app';
  web3auth: Web3Auth | null = null;
  provider: SafeEventEmitterProvider | null = null;
  isModalLoaded = false;

  async ngOnInit() {
    this.web3auth = new Web3Auth({
      clientId,
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.OTHER,
      },
    });
    const web3auth = this.web3auth;

    const openloginAdapter = new OpenloginAdapter({
      adapterSettings: {
        clientId,
        network: 'testnet',
        uxMode: 'popup',
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
      console.log('web3auth not initialized yet');
      return;
    }
    const web3auth = this.web3auth;
    this.provider = await web3auth.connect();
    console.log('logged in');
  };

  getUserInfo = async () => {
    if (!this.web3auth) {
      console.log('web3auth not initialized yet');
      return;
    }
    const user = await this.web3auth.getUserInfo();
    console.log(user);
  };

  onGetStarkAccount = async () => {
    if (!this.provider) {
      console.log('provider not initialized yet');
      return;
    }
    const rpc = new RPC(this.provider as SafeEventEmitterProvider);
    const starkaccounts = await rpc.getStarkAccount();
    console.log(starkaccounts);
  };

  getStarkKey = async () => {
    if (!this.provider) {
      console.log('provider not initialized yet');
      return;
    }
    const rpc = new RPC(this.provider as SafeEventEmitterProvider);
    const starkKey = await rpc.getStarkKey();
    console.log(starkKey);
  };

  onMintRequest = async () => {
    if (!this.provider) {
      console.log('provider not initialized yet');
      return;
    }
    const rpc = new RPC(this.provider as SafeEventEmitterProvider);
    const request = await rpc.onMintRequest();
    console.log(request);
  };

  onDepositRequest = async () => {
    if (!this.provider) {
      console.log('provider not initialized yet');
      return;
    }
    const rpc = new RPC(this.provider as SafeEventEmitterProvider);
    const request = await rpc.onDepositRequest();
    console.log(request);
  };

  onWithdrawalRequest = async () => {
    if (!this.provider) {
      console.log('provider not initialized yet');
      return;
    }
    const rpc = new RPC(this.provider as SafeEventEmitterProvider);
    const request = await rpc.onWithdrawalRequest();
    console.log(request);
  };

  logout = async () => {
    if (!this.web3auth) {
      console.log('web3auth not initialized yet');
      return;
    }
    await this.web3auth.logout();
    this.provider = null;
    console.log('logged out');
  };
}
