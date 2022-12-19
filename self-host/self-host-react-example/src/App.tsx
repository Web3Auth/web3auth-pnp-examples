import React, { useEffect, useState } from 'react';
import './App.css';
import SecurityQuestionsModule from '@tkey/security-questions';
import swal from 'sweetalert';
import { tKey } from './lib/web3auth';

function App() {
	const [user, setUser] = useState(null);

	// Init Service Provider inside the useEffect Method
	useEffect(() => {
		const init = async () => {
			// Initialization of Service Provider
			await (tKey.serviceProvider as any).init();
			try {
			} catch (error) {
				console.error(error);
			}
		};
		init();
	}, []);

	const triggerLogin = async () => {
		try {
			// Triggering Login using Service Provider ==> opens the popup
			const loginResponse = await (tKey.serviceProvider as any).triggerLogin({
				typeOfLogin: 'google',
				verifier: 'google-tkey-w3a',
				clientId:
					'774338308167-q463s7kpvja16l4l0kko3nb925ikds2p.apps.googleusercontent.com',
			});
			setUser(loginResponse);
			console.log('Public Key : ' + loginResponse.publicAddress);
			console.log('Email : ' + loginResponse.userInfo.email);
		} catch (error) {
			console.log(error);
		}
	};

	const initializeNewKey = async () => {
		try {
			await triggerLogin(); // Calls the triggerLogin() function above
			// Initialization of tKey
			await tKey.initialize(); // 1/2 flow
			// Gets the deviceShare
			try {
				await (tKey.modules.webStorage as any).inputShareFromWebStorage(); // 2/2 flow
			} catch (error) {
				console.error(error);
				await recoverShare();
			}

			// Checks the requiredShares to reconstruct the tKey,
			// starts from 2 by default and each of the above share reduce it by one.
			const { requiredShares } = tKey.getKeyDetails();
			if (requiredShares === 0) {
				const reconstructedKey = await tKey.reconstructKey();
				// setIsLoggingIn(true);
				uiConsole(
					'Reconstructed tKey: ' + reconstructedKey.privKey.toString('hex'),
				);
			}
		} catch (error) {
			console.error(error, 'caught');
		}
	};

	const changeSecurityQuestionAndAnswer = async () => {
		// swal is just a pretty dialog box
			swal('Enter password (>10 characters)', {
				content: 'input' as any,
			}).then(async value => {
				if (value.length > 10) {
					await (
						tKey.modules.securityQuestions as SecurityQuestionsModule
					).changeSecurityQuestionAndAnswer(value, 'whats your password?');
					swal('Success', 'Successfully changed new share with password.', 'success');
					console.log('Successfully changed new share with password.');
				} else {
					swal('Error', 'Password must be >= 11 characters', 'error');
				}
			});
		const keyDetails = await tKey.getKeyDetails();
		uiConsole(keyDetails);
	};

	const generateNewShareWithPassword = async () => {
		// swal is just a pretty dialog box
		swal('Enter password (>10 characters)', {
			content: 'input' as any,
		}).then(async value => {
			if (value.length > 10) {
				try {
					await (
						tKey.modules.securityQuestions as SecurityQuestionsModule
					).generateNewShareWithSecurityQuestions(
						value,
						'whats your password?',
					);
					swal('Success', 'Successfully generated new share with password.', 'success');
					console.log('Successfully generated new share with password.');
				} catch (error) {
					swal('Error', (error as any)?.message.toString(), 'error');
				}
			} else {
				swal('Error', 'Password must be >= 11 characters', 'error');
			}
		});
	}

	const recoverShare = async () => {
		// swal is just a pretty dialog box
		swal('Enter password (>10 characters)', {
			content: 'input' as any,
		}).then(async value => {
			if (value.length > 10) {
				try {
					await (tKey.modules.securityQuestions as SecurityQuestionsModule).inputShareFromSecurityQuestions(value); // 2/2 flow
					tKey.reconstructKey();
					const sharestore = await tKey.generateNewShare();
					console.log(sharestore);
					await (tKey.modules.webStorage as any).storeDeviceShare(sharestore.newShareStores[1]);
					swal('Success', 'Successfully logged you in with the recovery password.', 'success');
					console.log('Successfully logged you in with the recovery password.');
				} catch (error) {
					swal('Error', (error as any)?.message.toString(), 'error');
					console.log(error);
					logout();
				}
			} else {
				swal('Error', 'Password must be >= 11 characters', 'error');
				logout();
			}
		});
	}

	const keyDetails = async () => {
		const keyDetails = await tKey.getKeyDetails();
		uiConsole(keyDetails);
	};

	const logout = (): void => {
		console.log('Log out');
		setUser(null);
	};

	const getUserInfo = (): void => {
		uiConsole(user);
	};

	const uiConsole = (...args: any[]): void => {
		const el = document.querySelector('#console>p');
		if (el) {
			el.innerHTML = JSON.stringify(args || {}, null, 2);
		}
	};

	const loggedInView = (
		<>
			<div className='flex-container'>
				<div>
					<button onClick={getUserInfo} className='card'>
						Get User Info
					</button>
				</div>
				<div>
					<button onClick={generateNewShareWithPassword} className='card'>
						Generate Password Share
					</button>
				</div>
				<div>
					<button onClick={changeSecurityQuestionAndAnswer} className='card'>
						Change Password Share
					</button>
				</div>
				<div>
					<button onClick={keyDetails} className='card'>
						Key Details
					</button>
				</div>
				{/* <div>
					<button onClick={getChainId} className='card'>
						Get Chain ID
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
					<button onClick={signMessage} className='card'>
						Sign Message
					</button>
				</div>
				<div>
					<button onClick={sendTransaction} className='card'>
						Send Transaction
					</button>
				</div> */}

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
		<button onClick={initializeNewKey} className='card'>
			Login
		</button>
	);

	return (
		<div className='container'>
			<h1 className='title'>
				<a target='_blank' href='http://web3auth.io/' rel='noreferrer'>
					Web3Auth (tKey)
				</a>
				& ReactJS Ethereum Example
			</h1>

			<div className='grid'>{user ? loggedInView : unloggedInView}</div>

			<footer className='footer'>
				<a
					href='https://github.com/Web3Auth/examples/tree/main/self-host/self-host-react-example'
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
