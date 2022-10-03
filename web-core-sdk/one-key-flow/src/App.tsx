import { useEffect, useState } from "react";
import {
  SafeEventEmitterProvider,
} from "@web3auth/base";
import "./App.css";
// import RPC from "./evm.web3";
import RPC from "./evm.ethers";

import { UserLoginInterface } from "./interface";
import LoginWithMfa from "./loginWithMfa";
import LoginWithoutMfa from "./loginWithoutMfa";
import { isMfaEnabled } from "./utils";
import { verifier } from "./config";



function App() {
  const [mfaLoginInterface, setMfaLoginInterface] = useState<UserLoginInterface | null>(null);
  const [nonMfaLoginInterface, setNonMfaLoginInterface] = useState<UserLoginInterface | null>(null);
  const [hasMfaEnabled, setHasMfaEnabled] = useState<boolean>(false);

  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );

  useEffect(() => {
    const init = async () => {
      const loginWithMfa = new LoginWithMfa();
      const loginWithoutMfa = new LoginWithoutMfa();
      await Promise.all([loginWithMfa.init(), loginWithoutMfa.init()])
      setMfaLoginInterface(loginWithMfa);
      setNonMfaLoginInterface(loginWithoutMfa);
      // user is logged in with mfa, set the web3 provider.
      if (loginWithMfa.provider) {
        setProvider(loginWithMfa.provider);
        setHasMfaEnabled(true);
      } else if (loginWithoutMfa.provider) {
        // user is logged in without mfa, set the web3 provider.
        setProvider(loginWithoutMfa.provider);
        setHasMfaEnabled(false);
      } 
    };

    init();
  }, []);

  const getLoggedInUserInterface = (): UserLoginInterface | null => {
     if (hasMfaEnabled && mfaLoginInterface?.provider) {
      return mfaLoginInterface;
    } else if (!hasMfaEnabled &&  nonMfaLoginInterface?.provider) {
      return nonMfaLoginInterface
    } 
    return null
  }


  const login = async () => {
    try {
      if (!mfaLoginInterface) {
        throw new Error("Please wait for page to load");
      }
      
      const loginRes = await mfaLoginInterface.loginWithFirebase()
      const hadEnabledMfa = await isMfaEnabled(loginRes.user.uid, verifier);
      let blockchainProvider;
      if (hadEnabledMfa) {
        // if mfa is enabled by user previously then use web3auth flow for mfa
        // it will redirect user to  mfa screens (app.openlogin.com).
        const idToken = await loginRes.user.getIdToken(true);

        blockchainProvider = await mfaLoginInterface.loginWithWeb3Auth(idToken, loginRes.user.uid);
        setHasMfaEnabled(true);
      } else {
        if (!nonMfaLoginInterface) {
          throw new Error("Please wait for page to load");
        }
        const idToken = await loginRes.user.getIdToken(true);
        // if mfa is not enabled by user previously then it won't redirect.
        // it will fetch the shares from web3auth network nodes and reconstruct
        // the key inside dapp's frontend context.
        blockchainProvider = await nonMfaLoginInterface.loginWithWeb3Auth(idToken, loginRes.user.uid);
        setHasMfaEnabled(false);
      }

      if (!blockchainProvider) {
        throw new Error("Error while login, check console logs for more details");
       }
       setProvider(blockchainProvider);
    } catch (error) {
      uiConsole("error while login", error);
      console.error(error)
    }
  };

  const enableMfa = async () => {
    try {
      if (hasMfaEnabled) {
        throw new Error("Mfa already enabled");
      }
      const userLoginInterface = getLoggedInUserInterface();
      if (!userLoginInterface) {
        throw new Error("Please login first")
      }
      if (!mfaLoginInterface) {
        throw new Error("Please login first")
      }
      const user = await userLoginInterface.getCurrentFirebaseUser();
      if (!user) {
        throw new Error("Please login first")
      }

      const idToken = await user.getIdToken(true);
      // login with mfa interface to enable mfa.
      const userInfo = await mfaLoginInterface.loginWithWeb3Auth(idToken);
      uiConsole(userInfo)

    } catch (error) {
      uiConsole("error while getting enabling mfa", error);
      console.error(error)
    }
  }
  const getUserInfo = async () => {
    try {
      const userLoginInterface = getLoggedInUserInterface();
      if (!userLoginInterface) {
        throw new Error("Please login first")
      }
      const userInfo = await userLoginInterface.getUserInfo();
      uiConsole(userInfo)

    } catch (error) {
      uiConsole("error while getting user info", error);
      console.error(error)
    }
  };

  const logout = async () => {
    try {
      const userLoginInterface = getLoggedInUserInterface();
      if (!userLoginInterface) {
        throw new Error("Please login first")
      }
      await userLoginInterface.logout();
      setProvider(null);
      setHasMfaEnabled(false);
    } catch (error) {
      uiConsole("error while logout");
      console.error(error)
    }
  };

  /**
   *
   * Blockchain functions works same for both mfa and non mfa login
   */
  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const userAccount = await rpc.getAccounts();
    uiConsole(userAccount);
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

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const result = await rpc.signMessage();
    uiConsole(result);
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const result = await rpc.signAndSendTransaction();
    uiConsole(result);
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

  const loginView = (
    <>
      <h1> { hasMfaEnabled ? "Logged in with mfa" : "Logged in without mfa" }</h1>
      <div className="flex-container">
        <div>
          <button disabled={hasMfaEnabled} onClick={enableMfa} className="card">
          { hasMfaEnabled ? "Mfa Already Enabled" : "Enable Mfa" }
          </button>
        </div>
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

      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
    </>
  );

  const logoutView = (
    <button onClick={login} className="card">
      Login
    </button>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="http://web3auth.io/" rel="noreferrer">
          Web3Auth
        </a>{" "}
        One Key Login Flow (without Openlogin Redirect)
      </h1>

      <div className="grid">{provider ? loginView : logoutView}</div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/examples/tree/master/one-key-flow-core-react-example"
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
  );
}

export default App;
