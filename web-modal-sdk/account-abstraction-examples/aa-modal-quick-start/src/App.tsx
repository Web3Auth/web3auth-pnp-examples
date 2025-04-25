import "./App.css";

import { useWeb3Auth, useWeb3AuthConnect, useWeb3AuthDisconnect, useWeb3AuthUser } from "@web3auth/modal/react";
import { useAccount, useBalance, useSendTransaction, useSignMessage } from 'wagmi'

import { parseEther } from "viem";

function App() {
  const { isConnected } = useWeb3Auth();
  const { userInfo } = useWeb3AuthUser();
  const { connect } = useWeb3AuthConnect();
  const { disconnect } = useWeb3AuthDisconnect();
  const { address } = useAccount();
  const { data: balance } = useBalance({ address: address });
  const { signMessageAsync } = useSignMessage();
  const { sendTransactionAsync } = useSendTransaction();

  function uiConsole(...args: unknown[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
      console.log(...args);
    }
  }

  const loggedInView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={() => {
            uiConsole(userInfo);
          }} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={() => {
            uiConsole(address);
          }} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={() => {
            uiConsole(balance?.value.toString());
          }} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={async () => {
            const signature = await signMessageAsync({ message: "Hello, world!" });
            uiConsole(signature);
          }} className="card">
            Sign Message
          </button>
        </div>
        {/* <div>
          <button onClick={signTransaction} className="card">
            Sign Transaction
          </button>
        </div> */}
        <div>
          <button onClick={async () => {
            const destination = "0x40e1c367Eca34250cAF1bc8330E9EddfD403fC56";
            const amount = parseEther("0.00001");
            const transactionReceipt = await sendTransactionAsync({ to: destination, value: amount, });
            uiConsole(transactionReceipt);
          }} className="card">
            Send Transaction
          </button>
        </div>
        <div>
          <button onClick={() => {
            disconnect();
          }} className="card">
            Log Out
          </button>
        </div>
      </div>
    </>
  );

  const unloggedInView = (
    <button onClick={() => {
      connect();
    }} className="card">
      Login
    </button>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/modal" rel="noreferrer">
          Web3Auth{" "}
        </a>
        & AA React Quick Start
      </h1>

      <div className="grid">{isConnected ? loggedInView : unloggedInView}</div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-modal-sdk/account-abstraction/aa-modal-quick-start"
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
