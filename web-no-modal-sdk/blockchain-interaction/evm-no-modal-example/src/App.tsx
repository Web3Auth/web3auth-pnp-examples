import { useState } from "react";
import { CHAIN_NAMESPACES, IProvider, UX_MODE, WALLET_ADAPTERS, WEB3AUTH_NETWORK, IWeb3AuthCoreOptions, IAdapter, getEvmChainConfig } from "@web3auth/base";
import { useWeb3AuthConnect, useWeb3AuthDisconnect, useWeb3AuthUser, useWeb3Auth } from "@web3auth/no-modal/react";
import { WALLET_CONNECTORS, AUTH_CONNECTION } from "@web3auth/no-modal";
import { AuthAdapter, AuthLoginParams } from "@web3auth/auth-adapter";
import { WalletConnectV2Adapter, getWalletConnectV2Settings } from "@web3auth/wallet-connect-v2-adapter";
import { WalletConnectModal } from "@walletconnect/modal";
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";
import { getInjectedAdapters } from "@web3auth/default-evm-adapter";
import "./App.css";
import {
  getAccounts, getBalance, getChainId, getPrivateKey, readFromContract, sendTransaction, signMessage, writeToContract
} from "./ethersRPC";

function App() {
  const [walletServicesPlugin, setWalletServicesPlugin] = useState<WalletServicesPlugin | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const { connect, isConnected, connectorName, loading: connectLoading, error: connectError } = useWeb3AuthConnect();
  const { disconnect, loading: disconnectLoading, error: disconnectError } = useWeb3AuthDisconnect();
  const { userInfo } = useWeb3AuthUser();
  const { provider, chainId: web3AuthChainId } = useWeb3Auth();

  const login = async () => {
    try {
      setError(null);
      await connect(WALLET_CONNECTORS.AUTH, {
        loginProvider: AUTH_CONNECTION.GOOGLE,
      });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  const loginWithSMS = async () => {
    try {
      setError(null);
      await connect(WALLET_CONNECTORS.AUTH, {
        loginProvider: AUTH_CONNECTION.SMS_PASSWORDLESS,
        extraLoginOptions: {
          login_hint: phoneNumber.trim(),
        },
      });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "SMS login failed");
    }
  };

  const loginWithEmail = async () => {
    try {
      setError(null);
      await connect(WALLET_CONNECTORS.AUTH, {
        loginProvider: AUTH_CONNECTION.EMAIL_PASSWORDLESS,
        extraLoginOptions: {
          login_hint: email.trim(),
        },
      });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Email login failed");
    }
  };

  const loginWCModal = async () => {
    try {
      setError(null);
      await connect(WALLET_ADAPTERS.WALLET_CONNECT_V2);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Wallet Connect login failed");
    }
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

  const authenticateUser = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    try {
      uiConsole("User Info:", userInfo);
    } catch (err) {
      console.error("Error authenticating user:", err);
      uiConsole("Error authenticating user:", err);
    }
  };

  const getUserInfo = async () => {
    uiConsole("User Info:", userInfo);
  };

  const onGetChainId = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    try {
      const chainIdResult = await getChainId(provider);
      uiConsole("Chain ID:", chainIdResult);
    } catch (err) {
      console.error("Error getting chain ID:", err);
      uiConsole("Error getting chain ID:", err);
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
      const txResult = await sendTransaction(provider);
      uiConsole("Transaction Receipt:", txResult);
    } catch (err) {
      console.error("Error sending transaction:", err);
      uiConsole("Error sending transaction:", err);
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

  const showWalletUi = async () => {
    if (!walletServicesPlugin) {
      uiConsole("walletServicesPlugin not initialized yet");
      return;
    }
    await walletServicesPlugin.showWalletUi();
  };

  const showWalletConnectScanner = async () => {
    if (!walletServicesPlugin) {
      uiConsole("walletServicesPlugin not initialized yet");
      return;
    }
    await walletServicesPlugin.showWalletConnectScanner();
  };

  const showCheckout = async () => {
    if (!walletServicesPlugin) {
      uiConsole("walletServicesPlugin not initialized yet");
      return;
    }
    await walletServicesPlugin.showCheckout();
  };

  const showSwap = async () => {
    if (!walletServicesPlugin) {
      uiConsole("walletServicesPlugin not initialized yet");
      return;
    }
    await walletServicesPlugin.showSwap();
  };

  const loginWithInjected = async (adapterName: string) => {
    try {
      setError(null);
      await connect(adapterName as WALLET_ADAPTERS);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : `Injected wallet (${adapterName}) login failed`);
    }
  };

  function uiConsole(...args: unknown[]): void {
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
          <button onClick={onGetChainId} className="card">
            Get Chain ID
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
          <button onClick={onGetPrivateKey} className="card">
            Get Private Key
          </button>
        </div>
        <div>
          <button onClick={showWalletUi} className="card">
            Show Wallet UI
          </button>
        </div>
        <div>
          <button onClick={showWalletConnectScanner} className="card">
            Show Wallet Connect Scanner
          </button>
        </div>
        <div>
          <button onClick={showCheckout} className="card">
            Show Checkout
          </button>
        </div>
        <div>
          <button onClick={showSwap} className="card">
            Show Swap
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
        <button onClick={login} className="card">
          Login with Google
        </button>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter Phone Number (+11234567890)"
          className="card input-field"
        />
        <button onClick={loginWithSMS} disabled={!phoneNumber} className="card">
          Login with SMS
        </button>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email"
          className="card input-field"
        />
        <button onClick={loginWithEmail} disabled={!email} className="card">
          Login with Email
        </button>
        <button onClick={loginWCModal} className="card">
          Login with Wallet Connect
        </button>
        <button onClick={() => loginWithInjected(WALLET_ADAPTERS.METAMASK)} className="card">
          Login with Metamask
        </button>
        <button onClick={() => loginWithInjected(WALLET_ADAPTERS.COINBASE)} className="card">
          Login with Coinbase Wallet
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
        & EVM No Modal Example
      </h1>

      <div className="grid">{isConnected ? loggedInView : unloggedInView}</div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-no-modal-sdk/blockchain-connection-examples/evm-no-modal-example"
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
