import { Component } from '@angular/core';
import { Web3Auth } from '@web3auth/modal';
import {
	WALLET_ADAPTERS,
	CHAIN_NAMESPACES,
	SafeEventEmitterProvider,
} from '@web3auth/base';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import RPC from './starknetRPC';
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

	onGetStarkAccount = async () => {
		if (!this.provider) {
			this.uiConsole('provider not initialized yet');
			return;
		}
		const rpc = new RPC(this.provider as SafeEventEmitterProvider);
		const starkaccounts = await rpc.getStarkAccount();
		this.uiConsole(starkaccounts);
	};

	getStarkKey = async () => {
		if (!this.provider) {
			this.uiConsole('provider not initialized yet');
			return;
		}
		const rpc = new RPC(this.provider as SafeEventEmitterProvider);
		const starkKey = await rpc.getStarkKey();
		this.uiConsole(starkKey);
	};

	onDeployAccount = async () => {
		if (!this.provider) {
			this.uiConsole('provider not initialized yet');
			return;
		}
		const rpc = new RPC(this.provider as SafeEventEmitterProvider);
		const deployaccount = await rpc.deployAccount();
		this.uiConsole(deployaccount);
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
