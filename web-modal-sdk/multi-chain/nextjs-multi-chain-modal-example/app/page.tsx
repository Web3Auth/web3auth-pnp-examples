"use client";
/* eslint-disable no-console */

// Polkadot
import { Keyring } from "@polkadot/api";
import { cryptoWaitReady } from "@polkadot/util-crypto";
// StarkEx and StarkNet
import starkwareCrypto from "@starkware-industries/starkware-crypto-utils";
import { hex2buf } from "@taquito/utils";
// Tezos
import * as tezosCrypto from "@tezos-core-tools/crypto-utils";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
// Solana
import { SolanaPrivateKeyProvider, SolanaWallet } from "@web3auth/solana-provider";
import { useEffect, useState } from "react";
// EVM
import Web3 from "web3";

import RPC from "./web3RPC"; // for using web3.js

const clientId = "BEglQSgt4cUWcj6SKRdu5QkOXTsePmMcusG5EAoyjyOYKlVRjIF1iCNnMOTfpzCiunHRrMui8TIwQPXdkQ8Yxuk"; // get from https://dashboard.web3auth.io

export default function App() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // ETH_Goerli
        const web3auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x5",
          },
          web3AuthNetwork: "cyan",
        });
        setWeb3auth(web3auth);

        const openloginAdapter = new OpenloginAdapter({
          loginSettings: {
            mfaLevel: "default",
          },
          adapterSettings: {
            whiteLabel: {
              name: "Your app Name",
              logoLight: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
              logoDark: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
              defaultLanguage: "en",
              dark: true, // whether to enable dark mode. defaultValue: false
            },
          },
        });
        web3auth.configureAdapter(openloginAdapter);

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

  const login = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
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
  };

  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const address = await rpc.getAccounts();
    uiConsole(`ETH Address: ${address}`);
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
          rpcTarget: "https://rpc.ankr.com/solana",
          displayName: "Solana Mainnet",
          blockExplorer: "https://explorer.solana.com/",
          ticker: "SOL",
          tickerName: "Solana",
        },
      },
    });
    await solanaPrivateKeyProvider.setupProvider(ed25519key);
    console.log(solanaPrivateKeyProvider.provider);

    const solanaWallet = new SolanaWallet(solanaPrivateKeyProvider.provider as any);
    const solanaAddress = await solanaWallet.requestAccounts();
    return solanaAddress[0];
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

  // Will address this in future PR
  // const getNearAddress = async () => {
  //   if (!provider) {
  //     uiConsole("provider not initialized yet");
  //     return;
  //   }
  //   const rpc = new RPC(provider);
  //   const privateKey = await rpc.getPrivateKey();
  //   const keyPair = KeyPair.fromString(utils.serialize.base_encode(privateKey));
  //   const myKeyStore = new keyStores.InMemoryKeyStore();
  //   await myKeyStore.setKey("testnet", "web3auth-test-account.testnet", keyPair);
  //   const publicKey = utils.PublicKey.fromString(keyPair?.getPublicKey().toString());
  //   const address = Buffer.from(publicKey.data).toString("hex")
  //   return address;
  // };

  const getStarkExAddress = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    const keyPairStarkEx = starkwareCrypto.ec.keyFromPrivate(privateKey, "hex");
    const starkexAccount = starkwareCrypto.ec.keyFromPublic(keyPairStarkEx.getPublic(true, "hex"), "hex");
    const address = starkexAccount.pub.getX().toString("hex");
    return address;
  };

  const getStarkNetAddress = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    const keyPairStarkNet = starkwareCrypto.ec.keyFromPrivate(privateKey, "hex");
    const starknetAccount = starkwareCrypto.ec.keyFromPublic(keyPairStarkNet.getPublic(true, "hex"), "hex");
    const address = starknetAccount.pub.getX().toString("hex");
    return address;
  };

  const getPolkadotAddress = async () => {
    await cryptoWaitReady();
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = (await rpc.getPrivateKey()) as string;
    const keyring = new Keyring({ ss58Format: 42, type: "sr25519" });

    const keyPair = keyring.addFromUri(`0x${privateKey}`);
    const { address } = keyPair;
    return address;
  };

  const getAllAccounts = async () => {
    // EVM chains
    const polygonAddress = await getPolygonAddress();
    const bnbAddress = await getBnbAddress();

    // Solana
    let solanaAddress;
    try {
      solanaAddress = await getSolanaAddress();
    } catch (error) {
      solanaAddress = "Solana JSON RPC Error";
    }
    // Others
    const tezosAddress = await getTezosAddress();
    const starkexAddress = await getStarkExAddress();
    const starknetAddress = await getStarkNetAddress();
    const polkadotAddress = await getPolkadotAddress();
    // const nearAddress = await getNearAddress();

    uiConsole(
      `Polygon Address: ${polygonAddress}`,
      `BNB Address: ${bnbAddress}`,
      `Solana Address: ${solanaAddress}`,
      `Tezos Address: ${tezosAddress}`,
      `StarkEx Address: ${starkexAddress}`,
      `StarkNet Address: ${starknetAddress}`,
      `Polkadot Address: ${polkadotAddress}`
      // "Near Address: " + nearAddress
    );
  };

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
          <button onClick={getAllAccounts} className="card">
            Get All Accounts
          </button>
        </div>
        <div>
          <button onClick={getBalance} className="card">
            Get ETH Balance
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
        & NextJS Multi-chain Example
      </h1>

      <div className="grid">{provider ? loggedInView : unloggedInView}</div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/examples/tree/main/web-modal-sdk/multi-chain/nextjs-multi-chain-modal-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
      </footer>
    </div>
  );
}
