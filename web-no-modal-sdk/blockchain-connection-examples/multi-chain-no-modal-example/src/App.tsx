import { useEffect, useState } from "react";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { AuthAdapter } from "@web3auth/auth-adapter";
import { CHAIN_NAMESPACES, IProvider, WALLET_ADAPTERS } from "@web3auth/base";
import "./App.css";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { web3AuthConfig, authAdapterConfig } from "./config/web3auth";

// EVM
import Web3 from "web3";

import StartkNetRPC from "./RPC/startkNetRPC"; // for using starkex
import EthereumRPC from "./RPC/ethRPC-web3"; // for using web3.js
import SolanaRPC from "./RPC/solanaRPC"; // for using solana
import TezosRPC from "./RPC/tezosRPC"; // for using tezos
import PolkadotRPC from "./RPC/polkadotRPC"; // for using polkadot
import NearRPC from "./RPC/nearRPC";

function App() {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(false);
  const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3AuthNoModal(web3AuthConfig);
        setWeb3auth(web3auth);

        const authAdapter = new AuthAdapter(authAdapterConfig);
        web3auth.configureAdapter(authAdapter);

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

  const getAllAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    // EVM chains
    const polygon_address = await getPolygonAddress();
    const bnb_address = await getBnbAddress();

    const rpcETH = new EthereumRPC(provider!);
    const privateKey = await rpcETH.getPrivateKey();

    const tezosRPC = new TezosRPC(privateKey);
    const solanaRPC = new SolanaRPC(privateKey);
    const polkadotRPC = new PolkadotRPC(privateKey);
    const starkNetRPC = new StartkNetRPC(privateKey);
    const nearRPC = new NearRPC(provider!);

    const solana_address = await solanaRPC.getAccounts();
    const tezos_address = await tezosRPC.getAccounts();
    const starknet_address = await starkNetRPC.getAccounts();
    const polkadot_address = await polkadotRPC.getAccounts();
    const near_address = await nearRPC.getAccounts();

    uiConsole(
      "Polygon Address: " + polygon_address,
      "BNB Address: " + bnb_address,
      "Solana Address: " + solana_address,
      "Near Address: " + near_address?.["Account ID"],
      "Tezos Address: " + tezos_address,
      "StarkNet Address: " + starknet_address,
      "Polkadot Address: " + polkadot_address
    );
  };

  const getAllBalances = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }

    const ethRPC = new EthereumRPC(provider!);
    const privateKey = await ethRPC.getPrivateKey();

    const tezosRPC = new TezosRPC(privateKey);
    const solanaRPC = new SolanaRPC(privateKey);
    const polkadotRPC = new PolkadotRPC(privateKey);

    const eth_balance = await ethRPC.getBalance();
    const solana_balance = await solanaRPC.getBalance();
    const tezos_balance = await tezosRPC.getBalance();
    const polkadot_balance = await polkadotRPC.getBalance();

    uiConsole(
      "Ethereum Balance: " + eth_balance,
      "Solana Balance: " + solana_balance,
      "Tezos Balance: " + tezos_balance,
      "Polkadot Balance: " + polkadot_balance
    );
  };

  const login = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.AUTH, {
      loginProvider: "google",
    });
    setProvider(web3authProvider);
    setLoggedIn(true);
    uiConsole("Logged in Successfully!");
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
    setProvider(null);
    setLoggedIn(false);
  };

  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new EthereumRPC(provider);
    const address = await rpc.getAccounts();
    uiConsole("ETH Address: " + address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }

    const rpc = new EthereumRPC(provider);
    const balance = await rpc.getBalance();
    const finalString = "ETH Balance: " + balance;
    uiConsole(finalString);
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new EthereumRPC(provider);
    const receipt = await rpc.sendTransaction();
    uiConsole(receipt);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new EthereumRPC(provider);
    const signedMessage = await rpc.signMessage();
    uiConsole(signedMessage);
  };

  const getPolygonAddress = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new EthereumRPC(provider);
    const privateKey = await rpc.getPrivateKey();

    const polygonPrivateKeyProvider = new EthereumPrivateKeyProvider({
      config: {
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: "0x13882",
          rpcTarget: "https://rpc.ankr.com/polygon_amoy",
          displayName: "Polygon Amoy Testnet",
          blockExplorerUrl: "https://amoy.polygonscan.com",
          ticker: "POL",
          tickerName: "Polygon Ecosystem token",
          logo: "https://cryptologos.cc/logos/polygon-matic-logo.png",
        },
      },
    });
    await polygonPrivateKeyProvider.setupProvider(privateKey);
    const web3 = new Web3(polygonPrivateKeyProvider);
    const address = (await web3.eth.getAccounts())[0];
    return address;
  };

  const getBnbAddress = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new EthereumRPC(provider);
    const privateKey = await rpc.getPrivateKey();

    const bnbPrivateKeyProvider = new EthereumPrivateKeyProvider({
      config: {
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: "0x38",
          rpcTarget: "https://rpc.ankr.com/bsc",
          displayName: "Binance SmartChain Mainnet",
          blockExplorerUrl: "https://bscscan.com/",
          ticker: "BNB",
          tickerName: "BNB",
          logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
        },
      },
    });
    await bnbPrivateKeyProvider.setupProvider(privateKey);
    const web3 = new Web3(bnbPrivateKeyProvider);
    const address = (await web3.eth.getAccounts())[0];
    return address;
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
          <button onClick={getAccounts} className="card">
            Get ETH Account
          </button>
        </div>

        <div>
          <button onClick={getBalance} className="card">
            Get ETH Balance
          </button>
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
          <button onClick={sendTransaction} className="card">
            Send Transaction
          </button>
        </div>
        <div>
          <button onClick={signMessage} className="card">
            Sign Message
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
        & React Multi-chain Example
      </h1>

      <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-no-modal-sdk/blockchain-connection-examples/multi-chain-no-modal-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
        <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FWeb3Auth%2Fweb3auth-pnp-examples%2Ftree%2Fmain%2Fweb-no-modal-sdk%2Fblockchain-connection-examples%2Fmulti-chain-no-modal-example&project-name=w3a-multi-chain-no-modal&repository-name=w3a-multi-chain-no-modal">
          <img src="https://vercel.com/button" alt="Deploy with Vercel" />
        </a>
      </footer>
    </div>
  );
}

export default App;
