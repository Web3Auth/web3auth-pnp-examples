import {useEffect, useState} from 'react'
import {Web3AuthCore} from '@web3auth/core'
import {
  WALLET_ADAPTERS,
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
} from '@web3auth/base'
import {OpenloginAdapter} from '@web3auth/openlogin-adapter'
import RPC from './web3RPC'
// import RPC from './ethersRPC' for using ethers.js
import './App.css'

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
            chainId: '0x1',
          },
        })

        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: {
            clientId,
            network: 'testnet',
            uxMode: 'popup',
            loginConfig: {
              jwt: {
                name: 'Web3Auth-Auth0-JWT',
                verifier: 'web3auth-auth0-alam',
                typeOfLogin: 'jwt',
                clientId: '294QRkchfq2YaXUbPri7D6PH7xzHgQMT',
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
          domain: 'https://shahbaz-torus.us.auth0.com',
          verifierIdField: 'sub',
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

  const loggedInView = (
    <>
      <button onClick={getUserInfo} className="card">
        Get User Info
      </button>
      <button onClick={getAccounts} className="card">
        Get Accounts
      </button>
      <button onClick={getBalance} className="card">
        Get Balance
      </button>
      <button onClick={signMessage} className="card">
        Sign Message
      </button>
      <button onClick={sendTransaction} className="card">
        Send Transaction
      </button>

      <button onClick={logout} className="card">
        Log Out
      </button>

      <div id="console" style={{whiteSpace: 'pre-line'}}>
        <p style={{whiteSpace: 'pre-line'}}></p>
      </div>
    </>
  )

  const unloggedInView = (
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
        & ReactJS Example using Auth0
      </h1>

      <div className="grid">{provider ? loggedInView : unloggedInView}</div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/examples/tree/master/auth0-react-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
      </footer>
    </div>
  )
}

export default App
