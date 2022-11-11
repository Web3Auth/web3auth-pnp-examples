<template>
	<div id="app">
		<h2>Web3Auth Vue.js Tezos Example</h2>
		<button
			v-if="!loggedin"
			class="card"
			@click="login"
			style="cursor: pointer"
		>
			Login
		</button>
		<div v-if="loggedin">
			<div class="flex-container">
				<div>
					<button class="card" @click="getUserInfo" style="cursor: pointer">
						Get User Info
					</button>
				</div>
				<div>
					<button
						class="card"
						@click="authenticateUser"
						style="cursor: pointer"
					>
						Get ID Token
					</button>
				</div>
				<div>
					<button
						class="card"
						@click="onGetTezosKeyPair"
						style="cursor: pointer"
					>
						Get Tezos Key
					</button>
				</div>
				<div>
					<button class="card" @click="getAccounts" style="cursor: pointer">
						Get Accounts
					</button>
				</div>
				<div>
					<button class="card" @click="getBalance" style="cursor: pointer">
						Get Balance
					</button>
				</div>
				<div>
					<button class="card" @click="signMessage" style="cursor: pointer">
						Sign Message
					</button>
				</div>
				<div>
					<button
						class="card"
						@click="signAndSendTransaction"
						style="cursor: pointer"
					>
						Sign and Send Transaction
					</button>
				</div>
				<div>
					<button class="card" @click="logout" style="cursor: pointer">
						Logout
					</button>
				</div>
			</div>
			<div id="console" style="white-space: pre-line">
				<p style="white-space: pre-line"></p>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { Web3Auth } from '@web3auth/modal';
import {
	WALLET_ADAPTERS,
	CHAIN_NAMESPACES,
	SafeEventEmitterProvider,
} from '@web3auth/base';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import RPC from './tezosRPC';

export default {
	name: 'Home',
	props: {
		msg: String,
	},
	setup() {
		const loggedin = ref<boolean>(false);
		const loading = ref<boolean>(false);
		const loginButtonStatus = ref<string>('');
		const connecting = ref<boolean>(false);
		let provider = ref<SafeEventEmitterProvider | any>(null);
		const clientId =
			'BHr_dKcxC0ecKn_2dZQmQeNdjPgWykMkcodEHkVvPMo71qzOV6SgtoN8KCvFdLN7bf34JOm89vWQMLFmSfIo84A'; // get from https://dashboard.web3auth.io

		const web3auth = new Web3Auth({
			clientId,
			chainConfig: {
				chainNamespace: CHAIN_NAMESPACES.OTHER,
			},
		});

		onMounted(async () => {
			try {
				loading.value = true;
				loggedin.value = false;

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
					provider = web3auth.provider;
					loggedin.value = true;
				}
			} catch (error) {
				uiConsole('error', error);
			} finally {
				loading.value = false;
			}
		});

		const login = async () => {
			if (!web3auth) {
				uiConsole('web3auth not initialized yet');
				return;
			}
			provider = await web3auth.connect();
			loggedin.value = true;
		};

		const authenticateUser = async () => {
			if (!web3auth) {
				uiConsole('web3auth not initialized yet');
				return;
			}
			const idToken = await web3auth.authenticateUser();
			uiConsole(idToken);
		};

		const getUserInfo = async () => {
			if (!web3auth) {
				uiConsole('web3auth not initialized yet');
				return;
			}
			const user = await web3auth.getUserInfo();
			uiConsole(user);
		};

		const logout = async () => {
			if (!web3auth) {
				uiConsole('web3auth not initialized yet');
				return;
			}
			await web3auth.logout();
			provider = null;
			loggedin.value = false;
		};

		const onGetTezosKeyPair = async () => {
			if (!provider) {
				uiConsole('provider not initialized yet');
				return;
			}
			const rpc = new RPC(provider as SafeEventEmitterProvider);
			const tezosKey = await rpc.getTezosKeyPair();
			uiConsole(tezosKey);
		};

		const getAccounts = async () => {
			if (!provider) {
				uiConsole('provider not initialized yet');
				return;
			}
			const rpc = new RPC(provider);
			const userAccount = await rpc.getAccounts();
			uiConsole(userAccount);
		};

		const getBalance = async () => {
			if (!provider) {
				uiConsole('provider not initialized yet');
				return;
			}
			const rpc = new RPC(provider);
			const balance = await rpc.getBalance();
			uiConsole(balance);
		};

		const signMessage = async () => {
			if (!provider) {
				uiConsole('provider not initialized yet');
				return;
			}
			const rpc = new RPC(provider);
			const result = await rpc.signMessage();
			uiConsole(result);
		};

		const signAndSendTransaction = async () => {
			if (!provider) {
				uiConsole('provider not initialized yet');
				return;
			}
			const rpc = new RPC(provider);
			const result = await rpc.signAndSendTransaction();
			uiConsole(result);
		};

		function uiConsole(...args: any[]): void {
			const el = document.querySelector('#console>p');
			if (el) {
				el.innerHTML = JSON.stringify(args || {}, null, 2);
			}
		}

		return {
			loggedin,
			loading,
			loginButtonStatus,
			connecting,
			provider,
			web3auth,
			login,
			authenticateUser,
			logout,
			getUserInfo,
			onGetTezosKeyPair,
			getAccounts,
			getBalance,
			signMessage,
			signAndSendTransaction,
		};
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#app {
	width: 60%;
	margin: auto;
	padding: 0 2rem;
}
h3 {
	margin: 40px 0 0;
}
ul {
	list-style-type: none;
	padding: 0;
}
li {
	display: inline-block;
	margin: 0 10px;
}
a {
	color: #42b983;
}
.card {
	margin: 0.5rem;
	padding: 0.7rem;
	text-align: center;
	color: #0070f3;
	background-color: #fafafa;
	text-decoration: none;
	border: 1px solid #0070f3;
	border-radius: 10px;
	transition: color 0.15s ease, border-color 0.15s ease;
	width: 100%;
}

.card:hover,
.card:focus,
.card:active {
	cursor: pointer;
	background-color: #f1f1f1;
}

.flex-container {
	display: flex;
	flex-flow: row wrap;
}

.flex-container > div {
	width: 100px;
	margin: 10px;
	text-align: center;
	line-height: 75px;
	font-size: 30px;
}

#console {
	width: 100%;
	height: 100%;
	overflow: auto;
	word-wrap: break-word;
	font-size: 16px;
	font-family: monospace;
	text-align: left;
}
</style>
