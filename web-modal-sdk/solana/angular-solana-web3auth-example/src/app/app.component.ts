import { Component } from '@angular/core';
import { Web3Auth } from '@web3auth/modal';
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from '@web3auth/base';
import RPC from './solanaRPC';
const clientId =
	'BHr_dKcxC0ecKn_2dZQmQeNdjPgWykMkcodEHkVvPMo71qzOV6SgtoN8KCvFdLN7bf34JOm89vWQMLFmSfIo84A'; // get from https://dashboard.web3auth.io

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
			this.uiConsole('web3auth not initialized yet');
			return;
		}
		const web3auth = this.web3auth;
		this.provider = await web3auth.connect();
		this.uiConsole('Logged in Successfully!');
	};

	authenticateUser = async () => {
		if (!this.web3auth) {
			this.uiConsole('web3auth not initialized yet');
			return;
		}
		const id_token = await this.web3auth.authenticateUser();
		this.uiConsole(id_token);
	};

	getUserInfo = async () => {
		if (!this.web3auth) {
			this.uiConsole('web3auth not initialized yet');
			return;
		}
		const user = await this.web3auth.getUserInfo();
		this.uiConsole(user);
	};

	getAccounts = async () => {
		if (!this.provider) {
			this.uiConsole('provider not initialized yet');
			return;
		}
		const rpc = new RPC(this.provider);
		const address = await rpc.getAccounts();
		this.uiConsole(address);
	};

	getBalance = async () => {
		if (!this.provider) {
			this.uiConsole('provider not initialized yet');
			return;
		}
		const rpc = new RPC(this.provider);
		const balance = await rpc.getBalance();
		this.uiConsole(balance);
	};

	sendTransaction = async () => {
		if (!this.provider) {
			this.uiConsole('provider not initialized yet');
			return;
		}
		const rpc = new RPC(this.provider);
		const receipt = await rpc.sendTransaction();
		this.uiConsole(receipt);
	};

	signMessage = async () => {
		if (!this.provider) {
			this.uiConsole('provider not initialized yet');
			return;
		}
		const rpc = new RPC(this.provider);
		const signedMessage = await rpc.signMessage();
		this.uiConsole(signedMessage);
	};

	getPrivateKey = async () => {
		if (!this.provider) {
			this.uiConsole('provider not initialized yet');
			return;
		}
		const rpc = new RPC(this.provider);
		const privateKey = await rpc.getPrivateKey();
		this.uiConsole(privateKey);
	};

	logout = async () => {
		if (!this.web3auth) {
			this.uiConsole('web3auth not initialized yet');
			return;
		}
		await this.web3auth.logout();
		this.provider = null;
		this.uiConsole('logged out');
	};

	uiConsole(...args: any[]) {
		const el = document.querySelector('#console-ui>p');
		if (el) {
			el.innerHTML = JSON.stringify(args || {}, null, 2);
		}
	}
}
