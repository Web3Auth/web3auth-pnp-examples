import { Component } from '@angular/core';
import { Web3Auth } from '@web3auth/modal';
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from '@web3auth/base';
import RPC from './solanaRPC';
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
        chainNamespace: CHAIN_NAMESPACES.SOLANA,
        chainId: '0x1', // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
        rpcTarget: 'https://rpc.ankr.com/solana', // This is the public RPC we have added, please pass on your own endpoint while creating an app
      },
    });
    const web3auth = this.web3auth;

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

  getAccounts = async () => {
    if (!this.provider) {
      console.log('provider not initialized yet');
      return;
    }
    const rpc = new RPC(this.provider);
    const address = await rpc.getAccounts();
    console.log(address);
  };

  getBalance = async () => {
    if (!this.provider) {
      console.log('provider not initialized yet');
      return;
    }
    const rpc = new RPC(this.provider);
    const balance = await rpc.getBalance();
    console.log(balance);
  };

  sendTransaction = async () => {
    if (!this.provider) {
      console.log('provider not initialized yet');
      return;
    }
    const rpc = new RPC(this.provider);
    const receipt = await rpc.sendTransaction();
    console.log(receipt);
  };

  signMessage = async () => {
    if (!this.provider) {
      console.log('provider not initialized yet');
      return;
    }
    const rpc = new RPC(this.provider);
    const signedMessage = await rpc.signMessage();
    console.log(signedMessage);
  };

  getPrivateKey = async () => {
    if (!this.provider) {
      console.log('provider not initialized yet');
      return;
    }
    const rpc = new RPC(this.provider);
    const privateKey = await rpc.getPrivateKey();
    console.log(privateKey);
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
