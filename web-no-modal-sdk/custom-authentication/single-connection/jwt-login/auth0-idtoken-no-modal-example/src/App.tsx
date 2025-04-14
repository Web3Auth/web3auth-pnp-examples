import { useEffect, useState } from "react";

// Import Single Factor Auth SDK for no redirect flow
import { Web3Auth, decodeToken } from "@web3auth/single-factor-auth";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

// RPC libraries for blockchain calls
// import RPC from "./evm.web3";
// import RPC from "./evm.viem";
import RPC from "./evm.ethers";

import { useAuth0 } from "@auth0/auth0-react";

import Loading from "./Loading";
import "./App.css";

const verifier = "w3a-auth0-github";

const clientId = "BEglQSgt4cUWcj6SKRdu5QkOXTsePmMcusG5EAoyjyOYKlVRjIF1iCNnMOTfpzCiunHRrMui8TIwQPXdkQ8Yxuk"; // get from https://dashboard.web3auth.io

const chainConfig = {
  chainId: "0x1",
  displayName: "Ethereum Mainnet",
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  tickerName: "Ethereum",
  ticker: "ETH",
  decimals: 18,
  rpcTarget: "https://rpc.ankr.com/eth",
  blockExplorerUrl: "https://etherscan.io",
};

const ethereumPrivateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

// Initialising Web3Auth Single Factor Auth SDK
const web3authSfa = new Web3Auth({
  clientId, // Get your Client ID from Web3Auth Dashboard
  web3AuthNetwork: WEB3AUTH_NETWORK.CYAN, // ["cyan", "testnet"]
  usePnPKey: false, // Setting this to true returns the same key as PnP Web SDK, By default, this SDK returns CoreKitKey.
  privateKeyProvider: ethereumPrivateKeyProvider,
});

function App() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const { getIdTokenClaims, loginWithPopup } = useAuth0();

  useEffect(() => {
    const init = async () => {
      try {
        web3authSfa.init();
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    // trying logging in with the Single Factor Auth SDK
    try {
      if (!web3authSfa) {
        uiConsole("Web3Auth Single Factor Auth SDK not initialized yet");
        return;
      }
      setIsLoggingIn(true);
      await loginWithPopup();
      const idToken = (await getIdTokenClaims())?.__raw.toString();
      if (!idToken) {
        console.error("No id token found");
        return;
      }
      const { payload } = decodeToken(idToken);
      await web3authSfa.connect({
        verifier,
        verifierId: (payload as any).sub,
        idToken: idToken!,
      });
      setIsLoggingIn(false);
      setLoggedIn(true);
    } catch (err) {
      // Single Factor Auth SDK throws an error if the user has already enabled MFA
      // One can use the Web3AuthNoModal SDK to handle this case
      setIsLoggingIn(false);
      console.error(err);
    }
  };

  const getUserInfo = async () => {
    if (!web3authSfa) {
      uiConsole("Web3Auth Single Factor Auth SDK not initialized yet");
      return;
    }
    const userInfo = await web3authSfa.getUserInfo();
    uiConsole(userInfo);
  };

  const logout = () => {
    if (!web3authSfa) {
      uiConsole("Web3Auth Single Factor Auth SDK not initialized yet");
      return;
    }
    web3authSfa.logout();
    setLoggedIn(false);
    return;
  };

  const getAccounts = async () => {
    if (!web3authSfa.provider) {
      uiConsole("No provider found");
      return;
    }
    const rpc = new RPC(web3authSfa.provider);
    const userAccount = await rpc.getAccounts();
    uiConsole(userAccount);
  };

  const getBalance = async () => {
    if (!web3authSfa.provider) {
      uiConsole("No provider found");
      return;
    }
    const rpc = new RPC(web3authSfa.provider);
    const balance = await rpc.getBalance();
    uiConsole(balance);
  };

  const signMessage = async () => {
    if (!web3authSfa.provider) {
      uiConsole("No provider found");
      return;
    }
    const rpc = new RPC(web3authSfa.provider);
    const result = await rpc.signMessage();
    uiConsole(result);
  };

  const sendTransaction = async () => {
    if (!web3authSfa.provider) {
      uiConsole("No provider found");
      return;
    }
    const rpc = new RPC(web3authSfa.provider);
    const result = await rpc.signAndSendTransaction();
    uiConsole(result);
  };

  const authenticateUser = async () => {
    try {
      const userCredential = await web3authSfa.authenticateUser();
      uiConsole(userCredential);
    } catch (err) {
      uiConsole(err);
    }
  };

  const addChain = async () => {
    try {
      const newChain = {
        chainId: "0xaa36a7",
        displayName: "Sepolia Testnet ETH",
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        tickerName: "Sepolia Testnet ETH",
        ticker: "ETH",
        decimals: 18,
        rpcTarget: "https://rpc.ankr.com/eth_sepolia",
        blockExplorerUrl: "https://sepolia.etherscan.io",
      };
      await web3authSfa.addChain(newChain);
      uiConsole("Chain added successfully");
    } catch (err) {
      uiConsole(err);
    }
  };

  const switchChain = async () => {
    try {
      await web3authSfa.switchChain({ chainId: "0xaa36a7" });
      uiConsole("Chain switched successfully");
    } catch (err) {
      uiConsole(err);
    }
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
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
          <button onClick={authenticateUser} className="card">
            Authenticate User
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={addChain} className="card">
            Add Chain
          </button>
        </div>
        <div>
          <button onClick={switchChain} className="card">
            Switch Chain
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
        <a target="_blank" href="https://web3auth.io/docs/sdk/core-kit/sfa-web" rel="noreferrer">
          Web3Auth
        </a>{" "}
        SFA React Auth0 GitHub Example
      </h1>

      {isLoggingIn ? <Loading /> : <div className="grid">{web3authSfa ? (loggedIn ? loginView : logoutView) : null}</div>}

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-core-kit-examples/tree/main/single-factor-auth-web/sfa-web-auth0-example"
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
