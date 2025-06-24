import { useState } from "react";
import { useWeb3AuthConnect, useWeb3AuthDisconnect, useWeb3AuthUser, useWeb3Auth } from "@web3auth/modal/react";
import {
  getBitcoinPrivateKey,
  getBitcoinAddressAndKeys,
  getBitcoinBalance,
  sendTaprootTransaction
} from "./bitcoinRPC";
import "./App.css";

function App() {
  const [currentBitcoinAddress, setCurrentBitcoinAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { connect, isConnected, connectorName, loading: connectLoading, error: connectError } = useWeb3AuthConnect();
  const { disconnect, loading: disconnectLoading, error: disconnectError } = useWeb3AuthDisconnect();
  const { userInfo } = useWeb3AuthUser();
  const { provider } = useWeb3Auth();

  const login = async () => {
    await connect();
    if (connectError) {
      console.error(connectError);
      setError(connectError.message);
    }
  };

  const logout = async () => {
    await disconnect();
    setCurrentBitcoinAddress(null);
    if (disconnectError) {
      console.error(disconnectError);
      setError(disconnectError.message);
    }
  };

  const uiConsole = (...args: any[]): void => {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  };

  const deriveAndSetAddress = async () => {
    if (!provider) {
      uiConsole("Provider not available");
      setError("Provider not available");
      return;
    }
    try {
      setError(null);
      const pk = await getBitcoinPrivateKey(provider);
      const { address } = getBitcoinAddressAndKeys(pk);
      if (address) {
        setCurrentBitcoinAddress(address);
        console.log("Bitcoin Taproot Address Derived: ", address);
        uiConsole("Bitcoin Taproot Address: ", address);
      } else {
        setError("Could not derive Bitcoin address.");
        uiConsole("Could not derive Bitcoin address.");
      }
    } catch (err) {
      console.error("Error deriving address:", err);
      setError(err instanceof Error ? err.message : "Error deriving address");
      uiConsole("Error deriving address:", err);
      setCurrentBitcoinAddress(null);
    }
  };

  const onGetBitcoinBalance = async () => {
    if (!currentBitcoinAddress) {
      uiConsole("Derive address first.");
      setError("Derive address first.");
      return;
    }
    try {
      setError(null);
      const balance = await getBitcoinBalance(currentBitcoinAddress);
      console.log("Bitcoin Balance: ", balance);
      uiConsole("Bitcoin Balance (sats): ", balance);
    } catch (err) {
      console.error("Error fetching balance:", err);
      setError(err instanceof Error ? err.message : "Error fetching balance");
      uiConsole("Error fetching balance:", err);
    }
  };

  const onSendTaprootTransaction = async () => {
    if (!provider) {
      uiConsole("Provider not available");
      setError("Provider not available");
      return;
    }
    const destinationAddress = "tb1ph9cxmts2r8z56mfzyhem74pep0kfz2k0pc56uhujzx0c3v2rrgssx8zc5q";
    try {
      setError(null);
      uiConsole("Sending transaction...");
      const pk = await getBitcoinPrivateKey(provider);
      const txid = await sendTaprootTransaction(pk, destinationAddress);
      console.log("Transaction sent successfully:", txid);
      uiConsole("Transaction sent successfully! TXID:", txid);
      if (currentBitcoinAddress) await getBitcoinBalance(currentBitcoinAddress);
    } catch (err) {
      console.error("Error sending transaction:", err);
      setError(err instanceof Error ? err.message : "Error sending transaction");
      uiConsole("Error sending transaction:", err);
    }
  };

  const loggedInView = (
    <div className="flex-container">
      <div>Connected with {connectorName}</div>
      <button onClick={() => uiConsole("User Info:", userInfo)} className="card">Get User Info</button>
      <button onClick={deriveAndSetAddress} className="card">Derive Bitcoin Address</button>
      {currentBitcoinAddress && (
        <>
          <div className="card address-display">Address: {currentBitcoinAddress}</div>
          <button onClick={onGetBitcoinBalance} className="card">Get Bitcoin Balance</button>
          <button onClick={onSendTaprootTransaction} className="card">Send Test Transaction</button>
        </>
      )}
      <button onClick={logout} className="card">Log Out</button>
      {disconnectLoading && <div className="loading">Disconnecting...</div>}
      {disconnectError && <div className="error">{disconnectError.message}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );

  const unloggedInView = (
    <div className="grid">
      <button onClick={login} className="card">
        Login with Google
      </button>
      {connectLoading && <div className="loading">Connecting...</div>}
      {connectError && <div className="error">{connectError.message}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/no-modal" rel="noreferrer">
          Web3Auth
        </a>{" "}
        & Bitcoin No Modal Example
      </h1>
      <div className="grid">{isConnected ? loggedInView : unloggedInView}</div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}>{/* Console Output */}</p>
      </div>
      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-examples/tree/main/other/bitcoin-example"
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
