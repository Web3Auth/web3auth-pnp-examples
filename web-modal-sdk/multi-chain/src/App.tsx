import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import "./App.css";
import RPC from "./web3RPC"; // for using web3.js
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
// EVM
import Web3 from "web3";
// Solana
import {
  SolanaPrivateKeyProvider,
  SolanaWallet,
} from "@web3auth/solana-provider";
// Tezos
//@ts-ignore
import * as tezosCrypto from "@tezos-core-tools/crypto-utils";
import { hex2buf } from "@taquito/utils";
// StarkEx and StarkNet
//@ts-ignore
import starkwareCrypto from "@starkware-industries/starkware-crypto-utils";
//@ts-ignore
import { ec as elliptic } from "elliptic";

const clientId =
  "BBP_6GOu3EJGGws9yd8wY_xFT0jZIWmiLMpqrEMx36jlM61K9XRnNLnnvEtGpF-RhXJDGMJjL-I-wTi13RcBBOo"; // get from https://dashboard.web3auth.io

function App() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );

  useEffect(() => {
    const init = async () => {
      try {
        // ETH_Ropsten
        const web3auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x3",
          },
        });

        setWeb3auth(web3auth);

        await web3auth.initModal();

        if (web3auth.provider) {
          setProvider(web3auth.provider);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const getAllAccounts = async () => {
    // EVM chains
    const polygon_address = await getPolygonAddress();
    const bnb_address = await getBnbAddress();

    // Solana
    const solana_address = await getSolanaAddress();

    // Others
    const tezos_address = await getTezosAddress();
    const starkex_address = await getStarkExAddress();
    const starknet_address = await getStarkNetAddress();

    uiConsole(
      "Polygon Address: " + polygon_address,
      "BNB Address: " + bnb_address,
      "Solana Address: " + solana_address,
      "Tezos Address: " + tezos_address,
      "StarkEx Address: " + starkex_address,
      "StarkNet Address: " + starknet_address
    );
  };

  const login = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
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
  };

  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const address = await rpc.getAccounts();
    uiConsole("ETH Address: " + address);
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

  const getPolygonAddress = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();

    const polygonPrivateKeyProvider = new EthereumPrivateKeyProvider({
      config: {
        chainConfig: {
          chainId: "0x13881",
          rpcTarget: "https://rpc.ankr.com/polygon_mumbai",
          displayName: "Polygon Mumbai",
          blockExplorer: "https://mumbai.polygonscan.com/",
          ticker: "MATIC",
          tickerName: "MATIC",
        },
      },
    });
    await polygonPrivateKeyProvider.setupProvider(privateKey);
    const web3 = new Web3(polygonPrivateKeyProvider.provider as any);
    const address = (await web3.eth.getAccounts())[0];
    return address;
  };

  const getBnbAddress = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();

    const bnbPrivateKeyProvider = new EthereumPrivateKeyProvider({
      config: {
        chainConfig: {
          chainId: "0x38",
          rpcTarget: "https://rpc.ankr.com/bsc",
          displayName: "Binance SmartChain Mainnet",
          blockExplorer: "https://bscscan.com/",
          ticker: "BNB",
          tickerName: "BNB",
        },
      },
    });
    await bnbPrivateKeyProvider.setupProvider(privateKey);
    const web3 = new Web3(bnbPrivateKeyProvider.provider as any);
    const address = (await web3.eth.getAccounts())[0];
    return address;
  };

  const getSolanaAddress = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();

    const { getED25519Key } = await import("@toruslabs/openlogin-ed25519");
    const ed25519key = getED25519Key(privateKey).sk.toString("hex");

    // Get user's Solana's public address
    const solanaPrivateKeyProvider = new SolanaPrivateKeyProvider({
      config: {
        chainConfig: {
          chainId: "0x3",
          rpcTarget: "https://ssc-dao.genesysgo.net",
          displayName: "Solana Mainnet",
          blockExplorer: "https://explorer.solana.com/",
          ticker: "SOL",
          tickerName: "Solana",
        },
      },
    });
    await solanaPrivateKeyProvider.setupProvider(ed25519key);
    console.log(solanaPrivateKeyProvider.provider);

    const solanaWallet = new SolanaWallet(
      solanaPrivateKeyProvider.provider as any
    );
    const solana_address = await solanaWallet.requestAccounts();
    return solana_address[0];
  };

  const getTezosAddress = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    const keyPairTezos = tezosCrypto.utils.seedToKeyPair(hex2buf(privateKey));
    const address = keyPairTezos?.pkh;
    return address;
  };

  const getStarkExAddress = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    const keyPairStarkEx = starkwareCrypto.ec.keyFromPrivate(privateKey, "hex");
    const starkex_account = starkwareCrypto.ec.keyFromPublic(
      keyPairStarkEx.getPublic(true, "hex"),
      "hex"
    );
    const address = starkex_account.pub.getX().toString("hex");
    return address;
  };

  const getStarkNetAddress = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    const keyPairStarkNet = starkwareCrypto.ec.keyFromPrivate(
      privateKey,
      "hex"
    );
    const starknet_account = starkwareCrypto.ec.keyFromPublic(
      keyPairStarkNet.getPublic(true, "hex"),
      "hex"
    );
    const address = starknet_account.pub.getX().toString("hex");
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
          <button onClick={getAccounts} className="card">
            Get ETH Account
          </button>
        </div>
        <div>
          <button onClick={getAllAccounts} className="card">
            Get All Accounts
          </button>
        </div>
        <div>
          <button onClick={getBalance} className="card">
            Get Balance
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
        <a target="_blank" href="http://web3auth.io/" rel="noreferrer">
          Web3Auth{" "}
        </a>
        & ReactJS Example
      </h1>

      <div className="grid">{provider ? loggedInView : unloggedInView}</div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/examples/tree/main/web-modal-sdk/multi-chain"
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
