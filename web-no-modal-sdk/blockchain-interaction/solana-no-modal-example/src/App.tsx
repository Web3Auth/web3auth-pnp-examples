import { useEffect, useState } from "react";
import { CHAIN_NAMESPACES, IProvider, UX_MODE, WEB3AUTH_NETWORK, IWeb3AuthCoreOptions, IAdapter, getSolanaChainConfig } from "@web3auth/base";
import { useWeb3AuthConnect, useWeb3AuthDisconnect, useWeb3AuthUser, useWeb3Auth } from "@web3auth/no-modal/react";
import { WALLET_CONNECTORS, AUTH_CONNECTION } from "@web3auth/no-modal";
import { WalletConnectV2Adapter, getWalletConnectV2Settings } from "@web3auth/wallet-connect-v2-adapter";
import { WalletConnectModal } from "@walletconnect/modal";
import { AuthAdapter } from "@web3auth/auth-adapter";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import { getInjectedAdapters } from "@web3auth/default-solana-adapter";
import {
  getAccounts, getBalance, getPrivateKey, sendTransaction, sendVersionTransaction, signAllTransaction,
  signAllVersionedTransaction, signMessage, signTransaction, signVersionedTransaction
} from "./solanaRPC";
import "./App.css";

function App() {
  const [error, setError] = useState<string | null>(null);

  const { connect, isConnected, connectorName, loading: connectLoading, error: connectError } = useWeb3AuthConnect();
  const { disconnect, loading: disconnectLoading, error: disconnectError } = useWeb3AuthDisconnect();
  const { userInfo } = useWeb3AuthUser();
  const { provider } = useWeb3Auth();

  const loginWithGoogle = async () => {
    try {
      setError(null);
      await connect(WALLET_CONNECTORS.AUTH, {
        loginProvider: AUTH_CONNECTION.GOOGLE,
      });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Google login failed");
    }
  };

  const loginWCModal = async () => {
    try {
      setError(null);
      await connect(WALLET_CONNECTORS.WALLET_CONNECT_V2);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Wallet Connect login failed");
    }
  };

  const loginWithAdapter = async (adapterName: string) => {
    try {
      setError(null);
      await connect(adapterName as WALLET_CONNECTORS);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : `Adapter login (${adapterName}) failed`);
    }
  };

  const authenticateUser = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    try {
      uiConsole("User Info (might contain auth details):", userInfo);
    } catch (err) {
      console.error("Error fetching user info for auth data:", err);
      uiConsole("Error fetching user info for auth data:", err);
    }
  };

  const getUserInfo = async () => {
    uiConsole("User Info:", userInfo);
  };

  const logout = async () => {
    try {
      setError(null);
      await disconnect();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Logout failed");
    }
  };

  const onGetAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    try {
      const accountsResult = await getAccounts(provider);
      uiConsole("Accounts:", accountsResult);
    } catch (err) {
      console.error("Error getting accounts:", err);
      uiConsole("Error getting accounts:", err);
    }
  };

  const onGetBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    try {
      const balanceResult = await getBalance(provider);
      uiConsole("Balance:", balanceResult);
    } catch (err) {
      console.error("Error getting balance:", err);
      uiConsole("Error getting balance:", err);
    }
  };

  const onSendTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    try {
      const receipt = await sendTransaction(provider);
      uiConsole("Transaction Receipt:", receipt);
    } catch (err) {
      console.error("Error sending transaction:", err);
      uiConsole("Error sending transaction:", err);
    }
  };

  const onSendVersionTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    try {
      const receipt = await sendVersionTransaction(provider);
      uiConsole("Versioned Transaction Receipt:", receipt);
    } catch (err) {
      console.error("Error sending versioned transaction:", err);
      uiConsole("Error sending versioned transaction:", err);
    }
  };

  const onSignVersionedTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    try {
      const receipt = await signVersionedTransaction(provider);
      uiConsole("Signed Versioned Transaction:", receipt);
    } catch (err) {
      console.error("Error signing versioned transaction:", err);
      uiConsole("Error signing versioned transaction:", err);
    }
  };

  const onSignAllVersionedTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    try {
      const receipt = await signAllVersionedTransaction(provider);
      uiConsole("Signed All Versioned Transactions:", receipt);
    } catch (err) {
      console.error("Error signing all versioned transactions:", err);
      uiConsole("Error signing all versioned transactions:", err);
    }
  };

  const onSignAllTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    try {
      const receipt = await signAllTransaction(provider);
      uiConsole("Signed All Transactions:", receipt);
    } catch (err) {
      console.error("Error signing all transactions:", err);
      uiConsole("Error signing all transactions:", err);
    }
  };

  const onSignMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    try {
      const signedMessageResult = await signMessage(provider);
      uiConsole("Signed Message:", signedMessageResult);
    } catch (err) {
      console.error("Error signing message:", err);
      uiConsole("Error signing message:", err);
    }
  };

  const onGetPrivateKey = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    try {
      const privateKeyResult = await getPrivateKey(provider);
      uiConsole("Private Key:", privateKeyResult);
    } catch (err) {
      console.error("Error getting private key:", err);
      uiConsole("Error getting private key:", err);
    }
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
        <div> Connected with {connectorName} </div>
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
          <button onClick={onGetAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={onGetBalance} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={onSignMessage} className="card">
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={onSendTransaction} className="card">
            Send Transaction
          </button>
        </div>
        <div>
          <button onClick={onSendVersionTransaction} className="card">
            Send Version Transaction
          </button>
        </div>
        <div>
          <button onClick={onSignVersionedTransaction} className="card">
            Sign Versioned Transaction
          </button>
        </div>
        <div>
          <button onClick={onSignAllVersionedTransaction} className="card">
            Sign All Versioned Transaction
          </button>
        </div>
        <div>
          <button onClick={onSignAllTransaction} className="card">
            Sign All Transaction
          </button>
        </div>
        <div>
          <button onClick={onGetPrivateKey} className="card">
            Get Private Key
          </button>
        </div>
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
          {disconnectLoading && <div className="loading">Disconnecting...</div>}
          {disconnectError && <div className="error">{disconnectError.message}</div>}
        </div>
      </div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
    </>
  );

  const unloggedInView = (
    <div className="grid">
      <div className="flex-container">
        <button onClick={loginWithGoogle} className="card">
          Login with Google
        </button>
        <button onClick={loginWCModal} className="card">
          Login with WalletConnect
        </button>
        <button onClick={() => loginWithAdapter("phantom")} className="card">
          Login with Phantom
        </button>
        {connectLoading && <div className="loading">Connecting...</div>}
        {connectError && <div className="error">{connectError.message}</div>}
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/no-modal" rel="noreferrer">
          Web3Auth{" "}
        </a>
        & Solana No Modal Example
      </h1>

      <div className="grid">{isConnected ? loggedInView : unloggedInView}</div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-no-modal-sdk/blockchain-connection-examples/solana-no-modal-example"
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
