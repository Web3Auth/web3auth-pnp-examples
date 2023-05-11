import { useEffect, useState } from "react";
import { SafeAuthKit,
  SafeAuthSignInData,
  SafeGetUserInfoResponse,
  Web3AuthModalPack,
  Web3AuthEventListener } from "@safe-global/auth-kit";
import Safe, { EthersAdapter, SafeFactory } from '@safe-global/protocol-kit'
import { ethers } from 'ethers'
import { Web3AuthOptions } from "@web3auth/modal";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CHAIN_NAMESPACES, SafeEventEmitterProvider, WALLET_ADAPTERS, ADAPTER_EVENTS } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import "./App.css";
import RPC from "./web3RPC"; // for using web3.js
//import RPC from "./ethersRPC"; // for using ethers.js

const clientId =
  "BEglQSgt4cUWcj6SKRdu5QkOXTsePmMcusG5EAoyjyOYKlVRjIF1iCNnMOTfpzCiunHRrMui8TIwQPXdkQ8Yxuk"; // get from https://dashboard.web3auth.io

const connectedHandler: Web3AuthEventListener = (data) => console.log('CONNECTED', data)
const disconnectedHandler: Web3AuthEventListener = (data) => console.log('DISCONNECTED', data)

function App() {
  const [safeAuth, setSafeAuth] = useState<SafeAuthKit<Web3AuthModalPack>>()
  const [safeAuthSignInResponse, setSafeAuthSignInResponse] = useState<SafeAuthSignInData | null>(
    null
  )
  const [userInfo, setUserInfo] = useState<SafeGetUserInfoResponse<Web3AuthModalPack>>()
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null)  

  useEffect(() => {

    const options : Web3AuthOptions = {
      clientId,
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0x5",
        rpcTarget: "https://rpc.ankr.com/eth_goerli", // This is the public RPC we have added, please pass on your own endpoint while creating an app
      },
      uiConfig: {
        theme: "dark",
        loginMethodsOrder: ["github", "google"],
        defaultLanguage: "en",
        appLogo: "https://web3auth.io/images/w3a-L-Favicon-1.svg", // Your App Logo Here
      },
      web3AuthNetwork: "cyan",
    }
  
    const modalConfig = {
      [WALLET_ADAPTERS.TORUS_EVM]: {
        label: 'torus',
        showOnModal: false
      },
      [WALLET_ADAPTERS.METAMASK]: {
        label: 'metamask',
        showOnDesktop: true,
        showOnMobile: false
      }
    }
  
    const openloginAdapter = new OpenloginAdapter({
      loginSettings: {
        mfaLevel: 'default'
      },
      adapterSettings: {
        uxMode: 'popup',
        whiteLabel: {
          name: 'Safe'
        }
      }
    })

    const init = async () => {
      try {
        const web3AuthModalPack = new Web3AuthModalPack(options, [openloginAdapter], modalConfig)

        const safeAuthKit = await SafeAuthKit.init(web3AuthModalPack, {
          txServiceUrl: 'https://safe-transaction-goerli.safe.global'
        })       

        safeAuthKit.subscribe(ADAPTER_EVENTS.CONNECTED, connectedHandler)

        safeAuthKit.subscribe(ADAPTER_EVENTS.DISCONNECTED, disconnectedHandler)

        setSafeAuth(safeAuthKit)
      
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!safeAuth) {
      uiConsole("safeAuth not initialized yet");
      return;
    }
    const signInInfo = await safeAuth.signIn()
    console.log('SIGN IN RESPONSE: ', signInInfo)

    const userInfo = await safeAuth.getUserInfo()
    console.log('USER INFO: ', userInfo)

    setSafeAuthSignInResponse(signInInfo)
    setUserInfo(userInfo || undefined)
    setProvider(safeAuth.getProvider() as SafeEventEmitterProvider)
  };

  const logout = async () => {
    if (!safeAuth) {
      uiConsole("safeAuth not initialized yet");
      return;
    }
    await safeAuth.signOut();
    setProvider(null)
    setSafeAuthSignInResponse(null)
  };

  const createSafe = async() => {
    // Currently, createSafe is not supported by SafeAuthKit.
    const provider = new ethers.providers.Web3Provider(safeAuth?.getProvider() as SafeEventEmitterProvider);
    const signer = provider.getSigner();
    const ethAdapter = new EthersAdapter({ethers, signerOrProvider: signer || provider});
    const safeFactory = await SafeFactory.create({ ethAdapter });
    const safe: Safe = await safeFactory.deploySafe({ safeAccountConfig: { threshold: 1, owners: [safeAuthSignInResponse?.eoa as string] }})
    console.log('SAFE Created!', await safe.getAddress())
    uiConsole('SAFE Created!', await safe.getAddress())
  }

  const getChainId = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const chainId = await rpc.getChainId();
    uiConsole(chainId);
  };

  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const address = await rpc.getAccounts();
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    uiConsole(balance);
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const receipt = await rpc.sendTransaction();
    uiConsole(receipt);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const signedMessage = await rpc.signMessage();
    uiConsole(signedMessage);
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

  const loggedInView = (
    <>
      <div className="flex-container">
        {!safeAuthSignInResponse?.safes?.length ? (
          <div>
            <button onClick={createSafe} className="card">
              Create Safe
            </button>
          </div>
        ) : (
          <>
            <div>
              <button onClick={getChainId} className="card">
                Get Chain ID
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
          </>
        )}
      </div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
    </>
  );

  const unloggedInView = (
    <button onClick={login} className="card">
      Login
    </button>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="http://web3auth.io/" rel="noreferrer">
          Web3Auth{" "}
        </a>
        & <a target="_blank" href="https://docs.safe.global/learn/safe-core/safe-core-account-abstraction-sdk/auth-kit" rel="noreferrer">Safe Auth Kit</a> Example
      </h1>

      <div className="grid">{provider ? loggedInView : unloggedInView}</div>

      <div className="grid">{provider? userInfo?.name ? <p>Welcome {userInfo?.name}!</p> : null  : null} </div>
      <div className="grid">{provider? safeAuthSignInResponse?.eoa ? <p>Your EOA: {safeAuthSignInResponse?.eoa}</p> : null  : null} </div>
      <div className="grid">{provider ? safeAuthSignInResponse?.safes?.length ? (
        <>
          <p>Your Safe Accounts</p>
          {safeAuthSignInResponse?.safes?.map((safe, index) => (
            <p key={index}>Safe[{index}]: {safe}</p>
          ))}
        </>
        ) : (
          <>
            <p>No Available Safes, Please create one by clicking the above button. </p>
            <p> Note: You should have some goerli ETH in your account.</p>
            <p>Please be patient, it takes time to create the SAFE!, depending upon network congestion.</p>
          </>
        ) : null
      }</div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/examples/tree/main/account-abstraction/web3auth-safe-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
      </footer>
    </div>
  );
}

export default App;
