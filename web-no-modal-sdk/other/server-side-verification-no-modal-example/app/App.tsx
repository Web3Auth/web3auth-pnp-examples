import "react-toastify/dist/ReactToastify.css";

import { toast } from "react-toastify";
import { useWeb3AuthConnect, useWeb3AuthDisconnect, useWeb3AuthUser, useIdentityToken, useWeb3Auth} from "@web3auth/no-modal/react";
import { WALLET_CONNECTORS } from "@web3auth/no-modal";
import { useAccount } from "wagmi";
import { SendTransaction } from "../components/sendTransaction";
import { Balance } from "../components/getBalance";
import { SwitchChain } from "../components/switchNetwork";
import { useEffect } from "react";

function App() {
  const { connect, isConnected, loading: connectLoading, error: connectError } = useWeb3AuthConnect();
  const { disconnect, loading: disconnectLoading, error: disconnectError } = useWeb3AuthDisconnect();
  const { userInfo } = useWeb3AuthUser();
  const { token, authenticateUser, loading: idTokenLoading, error: idTokenError } = useIdentityToken();
  const { web3Auth } = useWeb3Auth();
  const { address, connector } = useAccount();

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
      console.log(...args);
    }
  }

  const validateIdToken = async () => {
    await authenticateUser();
    const pubKey = await web3Auth!.provider!.request({ method: "public_key" });

    // Validate idToken with server
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ appPubKey: pubKey }),
    });
    if (res.status === 200) {
      toast.success("JWT Verification Successful");
      uiConsole(`Logged in Successfully!`, userInfo);
    } else {
      toast.error("JWT Verification Failed");
      console.log("JWT Verification Failed");
      await disconnect();
    }
    return res.status;
  };

  useEffect(() => {
    const init = async () => {
      try {
        if (isConnected) {
          await validateIdToken();
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, [isConnected]);

  const loggedInView = (
    <div className="grid">
      <h2>Connected to {connector?.name}</h2>
      <div>{address}</div>
      <div className="flex-container"> 
        <div>
          <button onClick={() => uiConsole(userInfo)} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={() => authenticateUser().then(() => uiConsole(token))} className="card">
            Get ID Token
          </button>
          {idTokenLoading && <div className="loading">Getting ID Token...</div>}
          {idTokenError && <div className="error">{idTokenError.message}</div>}
        </div>
        <div>
          <button onClick={validateIdToken} className="card">
            Validate ID Token
          </button>
        </div>
        <div>
          <button onClick={() => disconnect()} className="card">
            Log Out
          </button>
          {disconnectLoading && <div className="loading">Disconnecting...</div>}
          {disconnectError && <div className="error">{disconnectError.message}</div>}
        </div>
      </div>
      <SendTransaction />
      <Balance />
      <SwitchChain />
    </div>
  );

  const unloggedInView = (
    <div className="grid">
      <button onClick={() => connect(WALLET_CONNECTORS.AUTH, {
        authConnection: "google",
      })} className="card">
        Login
      </button>
      {connectLoading && <div className="loading">Connecting...</div>}
      {connectError && <div className="error">{connectError.message}</div>}
    </div>
  );

  return (
    <div className="container">
          <h1 className="title">
            <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/no-modal" rel="noreferrer">
              Web3Auth{" "}
            </a>
            & Next.js No Modal Server Side Verification Example
          </h1>

          <div className="grid">{isConnected ? loggedInView : unloggedInView}</div>
          <div id="console" style={{ whiteSpace: "pre-line" }}>
            <p style={{ whiteSpace: "pre-line" }}></p>
          </div>

          <footer className="footer">
            <a
              href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-no-modal-sdk/other/server-side-verification-no-modal-example"
              target="_blank"
              rel="noopener noreferrer"
            >
              Source code
            </a>
            <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FWeb3Auth%2Fweb3auth-pnp-examples%2Ftree%2Fmain%2Fweb-no-modal-sdk%2Fother%2Fserver-side-verification-no-modal-example&project-name=w3a-ssv-no-modal&repository-name=w3a-ssv-no-modal">
              <img src="https://vercel.com/button" alt="Deploy with Vercel" />
            </a>
          </footer>
    </div>
  );
}

export default App;
