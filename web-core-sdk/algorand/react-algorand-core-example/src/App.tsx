import { useEffect, useState } from 'react';
import { Web3AuthCore } from '@web3auth/core';
import {
	CHAIN_NAMESPACES,
	SafeEventEmitterProvider,
	WALLET_ADAPTERS,
} from '@web3auth/base';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import RPC from './algorandRPC';
import './App.css';

const clientId =
	'BEglQSgt4cUWcj6SKRdu5QkOXTsePmMcusG5EAoyjyOYKlVRjIF1iCNnMOTfpzCiunHRrMui8TIwQPXdkQ8Yxuk'; // get from https://dashboard.web3auth.io

function App() {
	const [web3auth, setWeb3auth] = useState<Web3AuthCore | null>(null);
	const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
		null,
	);

	useEffect(() => {
		const init = async () => {
			try {
				const web3auth = new Web3AuthCore({
					clientId,
					chainConfig: {
						chainNamespace: CHAIN_NAMESPACES.OTHER,
					},
				});

				const openloginAdapter = new OpenloginAdapter({
					adapterSettings: {
						network: 'cyan',
					},
				});
				web3auth.configureAdapter(openloginAdapter);
				setWeb3auth(web3auth);

				await web3auth.init();
				if (web3auth.provider) {
					setProvider(web3auth.provider);
				}
			} catch (error) {
				console.error(error);
			}
		};

		init();
	}, []);

	const login = async () => {
		if (!web3auth) {
			uiConsole('web3auth not initialized yet');
			return;
		}
		const web3authProvider = await web3auth.connectTo(
			WALLET_ADAPTERS.OPENLOGIN,
			{
				loginProvider: 'google',
			},
		);
		setProvider(web3authProvider);
		uiConsole('Logged in Successfully!');
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
		console.log(user);
		uiConsole(user);
	};

	const logout = async () => {
		if (!web3auth) {
			uiConsole('web3auth not initialized yet');
			return;
		}
		await web3auth.logout();
		setProvider(null);
	};

	const onGetAlgorandKeypair = async () => {
		if (!provider) {
			uiConsole('provider not initialized yet');
			return;
		}
		const rpc = new RPC(provider as SafeEventEmitterProvider);
		const algorandKeypair = await rpc.getAlgorandKeyPair();
		uiConsole('Keypair', algorandKeypair);
	};

	const getAccounts = async () => {
		if (!provider) {
			uiConsole('provider not initialized yet');
			return;
		}
		const rpc = new RPC(provider);
		const userAccount = await rpc.getAccounts();
		uiConsole('Address', userAccount);
	};

	const getBalance = async () => {
		if (!provider) {
			uiConsole('provider not initialized yet');
			return;
		}
		const rpc = new RPC(provider);
		const balance = await rpc.getBalance();
		uiConsole(
			'Balance',
			balance,
			'You can get testnet funds from https://bank.testnet.algorand.network/',
		);
	};

	const signMessage = async () => {
		if (!provider) {
			uiConsole('provider not initialized yet');
			return;
		}
		const rpc = new RPC(provider);
		const result = await rpc.signMessage();
		uiConsole('Hash', result);
	};

	const signAndSendTransaction = async () => {
		if (!provider) {
			uiConsole('provider not initialized yet');
			return;
		}
		const rpc = new RPC(provider);
		const result = await rpc.signAndSendTransaction();
		uiConsole('Transaction ID: ', result);
	};

	function uiConsole(...args: any[]): void {
		const el = document.querySelector('#console>p');
		if (el) {
			el.innerHTML = JSON.stringify(args || {}, null, 2);
		}
	}

	const loggedInView = (
		<>
			<div className='flex-container'>
				<div>
					<button onClick={getUserInfo} className='card'>
						Get User Info
					</button>
				</div>
				<div>
					<button onClick={authenticateUser} className='card'>
						Get ID Token
					</button>
				</div>
				<div>
					<button onClick={onGetAlgorandKeypair} className='card'>
						Get Algorand Keypair
					</button>
				</div>
				<div>
					<button onClick={getAccounts} className='card'>
						Get Accounts
					</button>
				</div>
				<div>
					<button onClick={getBalance} className='card'>
						Get Balance
					</button>
				</div>
				<div>
					<button onClick={signAndSendTransaction} className='card'>
						Send Transaction
					</button>
				</div>
				<div>
					<button onClick={signMessage} className='card'>
						Sign Message
					</button>
				</div>
				<div>
					<button onClick={logout} className='card'>
						Log Out
					</button>
				</div>
			</div>
			<div id='console' style={{ whiteSpace: 'pre-line' }}>
				<p style={{ whiteSpace: 'pre-line' }}></p>
			</div>
		</>
	);

	const unloggedInView = (
		<button onClick={login} className='card'>
			Login
		</button>
	);

	return (
		<div className='container'>
			<h1 className='title'>
				<a target='_blank' href='http://web3auth.io/' rel='noreferrer'>
					Web3Auth{' '}
				</a>
				& Algorand Example
			</h1>

			<div className='grid'>{provider ? loggedInView : unloggedInView}</div>

			<footer className='footer'>
				<a
					href='https://github.com/Web3Auth/examples/tree/main/web-core-sdk/algorand/react-algorand-core-example'
					target='_blank'
					rel='noopener noreferrer'
				>
					Source code
				</a>
			</footer>
		</div>
	);
}

export default App;
