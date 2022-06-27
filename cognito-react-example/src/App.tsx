import {useEffect, useState} from 'react'
import {Web3AuthCore} from '@web3auth/core'
import {
  WALLET_ADAPTERS,
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
} from '@web3auth/base'
import {OpenloginAdapter} from '@web3auth/openlogin-adapter'
import './App.css'
// import RPC from './evm.web3'
import RPC from './evm.ethers'

const clientId =
  'BBWLCT1dIp57_-rJQwfMTTWqZgncOKu56b1TSqyLptpwSKrEndkCerKzgJ7aZ87_jviI5oLUJVCt-_mTqBJUSyQ' // get from https://dashboard.web3auth.io

function App() {
  const [web3auth, setWeb3auth] = useState<Web3AuthCore | null>(null)
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null,
  )

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3AuthCore({
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: '0x3',
          },
        })

        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: {
            clientId,
            network: 'testnet',
            uxMode: 'popup',
            loginConfig: {
              jwt: {
                name: 'Custom AWS Cognito Login via Google',
                verifier: 'web3auth-cognito-google-testnet',
                typeOfLogin: 'jwt',
                clientId: '2upuksfh6n0n5c0nciirc1bdrv', //use your app client id you will get from aws cognito app
              },
            },
          },
        })
        web3auth.configureAdapter(openloginAdapter)
        setWeb3auth(web3auth)

        await web3auth.init()
      } catch (error) {
        console.error(error)
      }
    }

    init()
  }, [])

  const login = async () => {
    if (!web3auth) {
      uiConsole('web3auth not initialized yet')
      return
    }
    const web3authProvider = await web3auth.connectTo(
      WALLET_ADAPTERS.OPENLOGIN,
      {
        relogin: true,
        loginProvider: 'jwt',
        extraLoginOptions: {
          domain:
            'https://shahbaz-web3auth.auth.ap-south-1.amazoncognito.com/oauth2',
          verifierIdField: 'email',
          response_type: 'token',
          scope: 'email profile openid',
        },
      },
    )
    setProvider(web3authProvider)
  }

  const getUserInfo = async () => {
    if (!web3auth) {
      uiConsole('web3auth not initialized yet')
      return
    }
    const user = await web3auth.getUserInfo()
    uiConsole(user)
  }

  const logout = async () => {
    if (!web3auth) {
      uiConsole('web3auth not initialized yet')
      return
    }
    await web3auth.logout()
    setProvider(null)
    window.open(
      'https://shahbaz-web3auth.auth.ap-south-1.amazoncognito.com/logout?client_id=2upuksfh6n0n5c0nciirc1bdrv&logout_uri=http://localhost:3000&redirect_uri=http://localhost:3000',
    )
  }

  const getAccounts = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet')
      return
    }
    const rpc = new RPC(provider)
    const userAccount = await rpc.getAccounts()
    uiConsole(userAccount)
  }

  const getBalance = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet')
      return
    }
    const rpc = new RPC(provider)
    const balance = await rpc.getBalance()
    uiConsole(balance)
  }

  const signMessage = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet')
      return
    }
    const rpc = new RPC(provider)
    const result = await rpc.signMessage()
    uiConsole(result)
  }

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet')
      return
    }
    const rpc = new RPC(provider)
    const result = await rpc.signAndSendTransaction()
    uiConsole(result)
  }

  function uiConsole(...args: any[]): void {
    const el = document.querySelector('#console>p')
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2)
    }
  }

  const loginView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={getUserInfo} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={getBalance} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={sendTransaction} className="card">
            Send Transaction
          </button>
        </div>
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>

      <div id="console" style={{whiteSpace: 'pre-line'}}>
        <p style={{whiteSpace: 'pre-line'}}></p>
      </div>
    </>
  )

  const logoutView = (
    <button onClick={login} className="card">
      Login
    </button>
  )

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="http://web3auth.io/" rel="noreferrer">
          Web3Auth
        </a>{' '}
        & ReactJS Example using AWS Cognito
      </h1>

      <div className="grid">{provider ? loginView : logoutView}</div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/examples/tree/master/cognito-react-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
        <a
          href="https://faucet.egorfine.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ropsten Faucet
        </a>
      </footer>
    </div>
  )
}

export default App
