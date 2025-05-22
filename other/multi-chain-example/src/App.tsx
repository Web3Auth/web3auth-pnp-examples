import "./App.css";
import {
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
  useWeb3AuthUser,
  useWeb3Auth
} from "@web3auth/modal/react";

// Import RPC classes
import {getEthereumAccounts, getEthereumBalance, signEthereumMessage, sendEthereumTransaction} from "./RPC/ethersRPC";
import {getSolanaAccount, getSolanaBalance, signSolanaMessage, sendSolanaTransaction} from "./RPC/solanaRPC";
import { getTezosAccount, getTezosBalance, signTezosMessage, signAndSendTezosTransaction } from "./RPC/tezosRPC";
import {getPolkadotAccounts, getPolkadotBalance, signAndSendPolkadotTransaction} from "./RPC/polkadotRPC";

function App() {
  const { connect, isConnected, loading: connectLoading, error: connectError } = useWeb3AuthConnect();
  const { disconnect, loading: disconnectLoading, error: disconnectError } = useWeb3AuthDisconnect();
  const { userInfo } = useWeb3AuthUser();
  const { provider } = useWeb3Auth();

  const getAllAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const eth_address = await getEthereumAccounts(provider);
    const solana_address = await getSolanaAccount(provider);
    const tezos_address = await getTezosAccount(provider);
    const polkadot_address = await getPolkadotAccounts(provider);

    uiConsole(
      "Ethereum Address: " + eth_address,
      "Solana Address: " + solana_address,
      "Tezos Address: " + tezos_address,
      "Polkadot Address: " + polkadot_address
    );
  };

  const getAllBalances = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }

    const eth_balance = await getEthereumBalance(provider);
    const solana_balance = await getSolanaBalance(provider);
    const tezos_balance = await getTezosBalance(provider);
    const polkadot_balance = await getPolkadotBalance(provider);

    uiConsole(
      "Ethereum Balance: " + eth_balance,
      "Solana Balance: " + solana_balance,
      "Tezos Balance: " + tezos_balance,
      "Polkadot Balance: " + polkadot_balance
    );
  };

  const OnSendEthereumTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const receipt = await sendEthereumTransaction(provider);
    uiConsole(receipt);
  };

  const OnSendPolkadotTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const receipt = await signAndSendPolkadotTransaction(provider);
    uiConsole(receipt);
  };

  const OnSignTezosMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const signedMessage = await signTezosMessage(provider);
    uiConsole(signedMessage);
  };

  const OnSignEthereumMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const signedMessage = await signEthereumMessage(provider);
    uiConsole(signedMessage);
  };

  const OnSignSolanaMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const signedMessage = await signSolanaMessage(provider);
    uiConsole(signedMessage);
  };

  const OnSendTezosTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const receipt = await signAndSendTezosTransaction(provider);
    uiConsole(receipt);
  };

  const OnSendSolanaTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const receipt = await sendSolanaTransaction(provider);
    uiConsole(receipt);
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

  const loggedInView = (
    <div className="grid">
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
          {disconnectLoading && <div className="loading">Disconnecting...</div>}
          {disconnectError && <div className="error">{disconnectError.message}</div>}
        </div>
        <div>
          <h3>Account Operations</h3>
        </div>
        <div>
          <button onClick={getAllAccounts} className="card">
            Get All Accounts
          </button>
        </div>
        <div>
          <button onClick={getAllBalances} className="card">
            Get All Balances
          </button>
        </div>
        <div>
          <h3>Message Signing Operations</h3>
        </div>
        <div>
          <button onClick={OnSignEthereumMessage} className="card">
            Sign Ethereum Message
          </button>
        </div>
        <div>
          <button onClick={OnSignSolanaMessage} className="card">
            Sign Solana Message
          </button>
        </div>
        <div>
          <button onClick={OnSignTezosMessage} className="card">
            Sign Tezos Message
          </button>
        </div>
        <div>
          <h3>Transaction Operations</h3>
        </div>
        <div>
          <button onClick={OnSendEthereumTransaction} className="card">
            Send ETH Transaction
          </button>
        </div>
        <div>
          <button onClick={OnSendSolanaTransaction} className="card">
            Send Solana Transaction
          </button>
        </div>
        <div>
          <button onClick={OnSendTezosTransaction} className="card">
            Send Tezos Transaction
          </button>
        </div>
        <div>
          <button onClick={OnSendPolkadotTransaction} className="card">
            Send Polkadot Transaction
          </button>
        </div>
      </div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
    </div>
  );

  const unloggedInView = (
    // IMP START - Login  
    <div className="grid">
      <button onClick={() => connect()} className="card">
        Login
      </button>
      {connectLoading && <div className="loading">Connecting...</div>}
      {connectError && <div className="error">{connectError.message}</div>}
    </div>
    // IMP END - Login
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/no-modal" rel="noreferrer">
          Web3Auth{" "}
        </a>
        & React Multi-chain Example
      </h1>

      <div className="grid">{isConnected ? loggedInView : unloggedInView}</div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-no-modal-sdk/other/multi-chain-no-modal-example"
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
