import { useEffect, useState } from "react";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { WALLET_ADAPTERS, IProvider, WEB3AUTH_NETWORK, UX_MODE, getEvmChainConfig } from "@web3auth/base";
import { AuthAdapter } from "@web3auth/auth-adapter";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import "./App.css";

//import RPC from "./web3RPC"; // for using web3.js
// import RPC from './ethersRPC' // for using ethers.js
import RPC from "./viemRPC"; // for using viem

const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // get from https://dashboard.web3auth.io

function App() {
  const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Get custom chain configs for your chain from https://web3auth.io/docs/connect-blockchain
        const chainConfig = getEvmChainConfig(0x13882, clientId)!;

        const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

        const web3auth = new Web3AuthNoModal({
          clientId,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
          privateKeyProvider,
        });

        const authAdapter = new AuthAdapter({
          loginSettings: {
            mfaLevel: "default",
          },
          adapterSettings: {
            uxMode: UX_MODE.REDIRECT,
            loginConfig: {
              jwt: {
                verifier: "w3a-worldcoin-demo",
                typeOfLogin: "jwt",
                clientId: "7u5jfJ3bakrfLBJYhyTquohpOth0Tmt7",
              },
            },
            mfaSettings: {
              deviceShareFactor: {
                enable: true,
                priority: 1,
                mandatory: true,
              },
              backUpShareFactor: {
                enable: true,
                priority: 2,
                mandatory: false,
              },
              socialBackupFactor: {
                enable: true,
                priority: 3,
                mandatory: false,
              },
              passwordFactor: {
                enable: true,
                priority: 4,
                mandatory: true,
              },
            },
          },
        });
        web3auth.configureAdapter(authAdapter);
        setWeb3auth(web3auth);

        await web3auth.init();
        setProvider(web3auth.provider);

        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  // TODO: Calls your implemented server route
  const verifyProof = async (proof: any) => {
    console.log("proof", proof);
    const response = await fetch("https://worldcoin-verify-proof-server.vercel.app/api/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(proof),
    });
    if (response.ok) {
      const { verified } = await response.json();
      return verified;
    } else {
      const { code, detail } = await response.json();
      throw new Error(`Error Code ${code}: ${detail}`);
    }
  };

  // TODO: Functionality after verifying
  const onSuccess = async () => {
    console.log("Success");
    await getUserInfo();
  };

  const login = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.AUTH, {
      loginProvider: "jwt",
      extraLoginOptions: {
        domain: "https://web3auth.jp.auth0.com",
        verifierIdField: "sub",
        connection: "worldcoin",
      },
    });
    setProvider(web3authProvider);
  };

  const authenticateUser = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const idToken = await web3auth.authenticateUser();
    uiConsole(idToken);
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setLoggedIn(false);
    setProvider(null);
  };

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
        <div>
          <button onClick={getUserInfo} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={authenticateUser} className="card">
            Get ID Token
          </button>
        </div>
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
        <div>
          <IDKitWidget
            app_id="app_staging_f3a97c0c7a87ffad90737c4cd149a763"
            action="verify-for-bigger-transaction"
            verification_level={VerificationLevel.Device}
            handleVerify={verifyProof}
            onSuccess={onSuccess}
          >
            {({ open }) => (
              <button onClick={open} className="card">
                Verify with World ID
              </button>
            )}
          </IDKitWidget>
        </div>
      </div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}>Logged in Successfully!</p>
      </div>
    </>
  );

  const unloggedInView = (
    <button onClick={login} className="card">
      Sign in with World ID
    </button>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/no-modal" rel="noreferrer">
          Web3Auth
        </a>{" "}
        & ReactJS Example using Auth0
      </h1>

      <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>

      <p className="grid">Use the Worldcoin Simulator linked below to test the login flow.</p>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-no-modal-sdk/custom-authentication/single-verifier-examples/auth0-no-modal-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
        <a href="https://simulator.worldcoin.org/id/0x18310f83" target="_blank" rel="noopener noreferrer">
          Worldcoin Simulator
        </a>
        <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FWeb3Auth%2Fweb3auth-pnp-examples%2Ftree%2Fmain%2Fweb-no-modal-sdk%2Fcustom-authentication%2Fsingle-verifier-examples%2Fauth0-no-modal-example&project-name=w3a-auth0-no-modal&repository-name=w3a-auth0-no-modal">
          <img src="https://vercel.com/button" alt="Deploy with Vercel" />
        </a>
      </footer>
    </div>
  );
}

export default App;
