import "./App.css";
import { useWeb3AuthConnect, useWeb3AuthDisconnect, useWeb3AuthUser} from "@web3auth/modal/react";
import { useAccount } from "wagmi";
import { SendTransaction } from "./components/SendTransaction";
import { Balance } from "./components/Balance";

function App() {
  const { connect, isConnected, connectorName } = useWeb3AuthConnect();
  // IMP START - Logout
  const { disconnect } = useWeb3AuthDisconnect();
  // IMP END - Logout
  const { userInfo } = useWeb3AuthUser();
  const { address } = useAccount();

  const login = async () => {
    // IMP START - Login
    await connect();
    // IMP END - Login
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
      console.log(...args);
    }
  }

  const loggedInView = (
    <>
      <h2>Connected to {connectorName}</h2>
      <div>{address}</div>
      <div className="flex-container"> 
        <div>
          <button onClick={() => uiConsole(userInfo)} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={() => disconnect()} className="card">
            Log Out
          </button>
        </div>
      </div>
      <SendTransaction />
      <Balance />
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
            <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/no-modal" rel="noreferrer">
              Web3Auth{" "}
            </a>
            & React Account Abstraction Quick Start
          </h1>

          <div className="grid">{isConnected ? loggedInView : unloggedInView}</div>
          <div id="console" style={{ whiteSpace: "pre-line" }}>
            <p style={{ whiteSpace: "pre-line" }}></p>
          </div>

          <footer className="footer">
            <a
              href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-no-modal-sdk/quick-starts/react-hooks-no-modal-quick-start"
              target="_blank"
              rel="noopener noreferrer"
            >
              Source code
            </a>
            <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FWeb3Auth%2Fweb3auth-pnp-examples%2Ftree%2Fmain%2Fweb-no-modal-sdk%2Fquick-starts%2Freact-hooks-no-modal-quick-start&project-name=react-hooks-no-modal-quick-start&repository-name=react-hooks-no-modal-quick-start">
              <img src="https://vercel.com/button" alt="Deploy with Vercel" />
            </a>
          </footer>
    </div>
  );
}

export default App;
