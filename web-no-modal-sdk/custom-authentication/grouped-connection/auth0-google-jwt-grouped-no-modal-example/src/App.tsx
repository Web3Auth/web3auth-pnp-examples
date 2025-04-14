import { useEffect, useState } from "react";

// Import Single Factor Auth SDK for no redirect flow
import { Web3Auth, decodeToken } from "@web3auth/single-factor-auth";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { GoogleLogin, CredentialResponse, googleLogout } from "@react-oauth/google";

// RPC libraries for blockchain calls
import RPC from "./evm.web3";
// import RPC from "./evm.ethers";
// import RPC from "./evm.viem";

import { useAuth0 } from "@auth0/auth0-react";

import "./App.css";

import Loading from "./Loading";

const verifier = "w3a-agg-google-auth0";

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
  web3AuthNetwork: WEB3AUTH_NETWORK.TESTNET, // ["cyan", "testnet"]
  usePnPKey: false, // Setting this to true returns the same key as PnP Web SDK, By default, this SDK returns CoreKitKey.
  privateKeyProvider: ethereumPrivateKeyProvider,
});

function App() {
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  const loginAuth0GitHub = async () => {
    // trying logging in with the Single Factor Auth SDK
    try {
      if (!web3authSfa) {
        uiConsole("Web3Auth Single Factor Auth SDK not initialized yet");
        return;
      }
      setLoading(true);
      await loginWithPopup();
      const idToken = (await getIdTokenClaims())?.__raw.toString();
      if (!idToken) {
        throw new Error("No id token found");
      }
      const { payload } = decodeToken(idToken);
      const subVerifierInfoArray = [
        {
          verifier: "w3a-auth0-github",
          idToken: idToken!,
        },
      ];
      await web3authSfa.connect({
        verifier,
        verifierId: (payload as any).email,
        idToken: idToken!,
        subVerifierInfoArray,
      });
      setLoading(false);
      setIsLoggedIn(true);
    } catch (err) {
      // Single Factor Auth SDK throws an error if the user has already enabled MFA
      // One can use the Web3AuthNoModal SDK to handle this case
      setLoading(false);
      console.error(err);
    }
  };

  const onSuccess = async (response: CredentialResponse) => {
    try {
      if (!web3authSfa) {
        uiConsole("Web3Auth Single Factor Auth SDK not initialized yet");
        return;
      }
      setLoading(true);
      const idToken = response.credential;
      if (!idToken) {
        throw new Error("No id token found");
      }
      const { payload } = decodeToken(idToken);

      const subVerifierInfoArray = [
        {
          verifier: "w3a-google",
          idToken: idToken!,
        },
      ];
      await web3authSfa.connect({
        verifier,
        verifierId: (payload as any).email,
        idToken: idToken!,
        subVerifierInfoArray,
      });
      setLoading(false);
      setIsLoggedIn(true);
    } catch (err) {
      // Single Factor Auth SDK throws an error if the user has already enabled MFA
      // One can use the Web3AuthNoModal SDK to handle this case
      setLoading(false);
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

  const logout = async () => {
    if (!web3authSfa) {
      uiConsole("Web3Auth Single Factor Auth SDK not initialized yet");
      return;
    }
    web3authSfa?.logout();
    googleLogout();
    setIsLoggedIn(false);
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

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

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
      await web3authSfa.switchChain({ chainId: "0xaa36a7" }); // sepolia chain id
      uiConsole("Chain switched successfully");
    } catch (err) {
      uiConsole(err);
    }
  };

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
    <>
      <button onClick={loginAuth0GitHub} className="card">
        Login using <b>Github</b> [ via Auth0 ]
      </button>
      <GoogleLogin onSuccess={onSuccess} />
    </>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/core-kit/sfa-web" rel="noreferrer">
          Web3Auth
        </a>{" "}
        SFA (Auth0 GitHub)-(Google) Aggregate React Example
      </h1>

      {loading ? <Loading /> : <div className="grid">{isLoggedIn ? loginView : logoutView}</div>}

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-core-kit-examples/tree/main/single-factor-auth-web/sfa-react-agg-verifier-example "
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
