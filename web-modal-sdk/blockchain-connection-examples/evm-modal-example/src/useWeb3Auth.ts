import { useContext, useState } from 'react';
import { Web3AuthContext } from './Web3AuthProvider';
import { BrowserProvider, JsonRpcSigner } from 'ethers'
import { OpenloginAdapter, type OpenloginUserInfo } from '@web3auth/openlogin-adapter'
import { WALLET_ADAPTERS } from '@web3auth/base'

const WAIT_FOR_INIT_MSG = "Wait for web3auth to be inited first"

const useWeb3Auth = () => {
  const web3auth = useContext(Web3AuthContext)
  
  const [connected, setConnected] = useState<boolean>(false)
  const [provider, setProvider] = useState<BrowserProvider | null>(null)
  const [accounts, setAccounts] = useState<JsonRpcSigner[]>([])
  const [userInfo, setUserInfo] = useState<Partial<OpenloginUserInfo> | null>(null)

  const initModal = async () => {
    if(!web3auth) throw new Error(WAIT_FOR_INIT_MSG)

    await web3auth.initModal()
    if(web3auth.connected) {
      setConnected(true)
      setProvider(new BrowserProvider(web3auth.provider!))
      setAccounts(provider ? await provider.listAccounts() : [])
      setUserInfo(await web3auth.getUserInfo())
    }
  }

  async function enableMFA() {
    if(!web3auth) throw new Error(WAIT_FOR_INIT_MSG)

    if (web3auth.connectedAdapterName === WALLET_ADAPTERS.OPENLOGIN) {
      return (
        web3auth.walletAdapters[WALLET_ADAPTERS.OPENLOGIN] as OpenloginAdapter
      ).openloginInstance?.enableMFA({})
    }
  }

  async function connect() {
    if(!web3auth) throw new Error(WAIT_FOR_INIT_MSG)

    const web3authProvider = await web3auth.connect();
    setConnected(true)
    setProvider(new BrowserProvider(web3authProvider!))
    setAccounts(provider ? await provider.listAccounts() : [])
    setUserInfo(await web3auth.getUserInfo())
  }

  return {
    web3auth,
    initModal,
    connect,
    connected, 
    provider, 
    accounts, 
    userInfo, 
    addChain: web3auth?.addChain, 
    switchChain: web3auth?.switchChain, 
    enableMFA, 
    logout: web3auth?.logout,
    isMFAEnabled: Boolean(userInfo?.isMfaEnabled)
  }
}

export default useWeb3Auth