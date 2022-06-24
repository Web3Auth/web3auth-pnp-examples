import {useEffect, useState} from 'react'
import {Web3AuthCore} from '@web3auth/core'
import {
  WALLET_ADAPTERS,
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
} from '@web3auth/base'
import {OpenloginAdapter} from '@web3auth/openlogin-adapter'
import Web3 from 'web3'
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
          domain: 'https://shahbaz-web3auth.auth.ap-south-1.amazoncognito.com',
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
  }

  const getAccounts = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet')
      return
    }
    const web3 = new Web3(provider as any)
    const userAccounts = await web3.eth.getAccounts()
    uiConsole(userAccounts)
  }

  const getBalance = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet')
      return
    }
    const web3 = new Web3(provider as any)
    const accounts = await web3.eth.getAccounts()
    const balance = await web3.eth.getBalance(accounts[0])
    uiConsole(web3.utils.fromWei(balance) + ' ETH')
  }

  const signMessage = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet')
      return
    }
    const web3 = new Web3(provider as any)
    // Get user's Ethereum public address
    const fromAddress = (await web3.eth.getAccounts())[0]

    const message =
      '0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad'

    ;(web3.currentProvider as any)?.send(
      {
        method: 'eth_sign',
        params: [fromAddress, message],
        from: fromAddress,
      },
      (err: Error, result: any) => {
        if (err) {
          return console.error(err)
        }
        uiConsole(result)
      },
    )
  }

  const signTransaction = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet')
      return
    }
    const web3 = new Web3(provider as any)
    const accounts = await web3.eth.getAccounts()
    const txRes = await web3.eth.signTransaction({
      from: accounts[0],
      to: accounts[0],
      value: web3.utils.toWei('0.01'),
    })
    uiConsole(txRes.raw)
  }

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet')
      return
    }
    const web3 = new Web3(provider as any)
    const accounts = await web3.eth.getAccounts()

    const txRes = await web3.eth.sendTransaction({
      from: accounts[0],
      to: accounts[0],
      value: web3.utils.toWei('0.0001'),
    })
    uiConsole(txRes.transactionHash)
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
          <button onClick={signTransaction} className="card">
            Sign Transaction
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
