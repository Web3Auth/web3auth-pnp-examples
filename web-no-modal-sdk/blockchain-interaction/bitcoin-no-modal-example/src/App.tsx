import { useEffect, useState } from "react";
import { Web3Auth, decodeToken } from "@web3auth/single-factor-auth";
import { ADAPTER_EVENTS, CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import ecc from "@bitcoinerlab/secp256k1";
import ECPairFactory from "ecpair";
import { Psbt, networks, payments, crypto, initEccLib } from "bitcoinjs-lib";
import axios from "axios";
import { GoogleLogin, CredentialResponse, googleLogout } from "@react-oauth/google";

import Loading from "./Loading";
import "./App.css";

// Initialize ECPair and ecc library
const ECPair = ECPairFactory(ecc);
initEccLib(ecc);

// Replace with your verifier and client ID from the Web3Auth dashboard
const verifier = "w3a-sfa-web-google";
const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // Replace with your client ID

const chainConfig = {
  chainId: "0xaa36a7",
  displayName: "Ethereum Sepolia Testnet",
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  tickerName: "Ethereum",
  ticker: "ETH",
  decimals: 18,
  rpcTarget: "https://rpc.ankr.com/eth_sepolia",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  logo: "https://cryptologos.cc/logos/polygon-matic-logo.png",
};

function App() {
  const network = networks.testnet;
  const [web3authSFAuth, setWeb3authSFAuth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [pk, setPk] = useState<string>("");

  useEffect(() => {
    const initWeb3Auth = async () => {
      try {
        const ethereumPrivateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });
        const web3authSfa = new Web3Auth({
          clientId,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
          usePnPKey: false,
          privateKeyProvider: ethereumPrivateKeyProvider,
        });

        web3authSfa.on(ADAPTER_EVENTS.CONNECTED, (data) => {
          console.log("sfa:connected", data);
          setProvider(web3authSfa.provider);
        });

        web3authSfa.on(ADAPTER_EVENTS.DISCONNECTED, () => {
          console.log("sfa:disconnected");
          setProvider(null);
        });

        await web3authSfa.init();
        setWeb3authSFAuth(web3authSfa);
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
      }
    };

    initWeb3Auth();
  }, []);

  useEffect(() => {
    const getPrivateKey = async () => {
      if (!provider) return;
      try {
        const privateKey = await provider.request({ method: "eth_private_key" });
        setPk(privateKey as string);
      } catch (error) {
        console.error("Error getting private key:", error);
        setPk("");
      }
    };

    getPrivateKey();
  }, [provider]);

  const onSuccess = async (response: CredentialResponse) => {
    if (!web3authSFAuth) {
      uiConsole("Web3Auth Single Factor Auth SDK not initialized yet");
      return;
    }
    setIsLoggingIn(true);
    const idToken = response.credential;
    if (!idToken) {
      setIsLoggingIn(false);
      return;
    }
    try {
      const { payload } = decodeToken(idToken);
      await web3authSFAuth.connect({
        verifier,
        verifierId: (payload as any)?.email,
        idToken,
      });
      setIsLoggingIn(false);
    } catch (err) {
      setIsLoggingIn(false);
      console.error("Error during authentication:", err);
    }
  };

  const getUserInfo = async () => {
    if (!web3authSFAuth) {
      uiConsole("Web3Auth Single Factor Auth SDK not initialized yet");
      return;
    }
    const userInfo = await web3authSFAuth.getUserInfo();
    uiConsole(userInfo);
  };

  const logout = async () => {
    if (!web3authSFAuth) {
      uiConsole("Web3Auth Single Factor Auth SDK not initialized yet");
      return;
    }
    googleLogout();
    await web3authSFAuth.logout();
  };

  const authenticateUser = async () => {
    if (!web3authSFAuth) {
      uiConsole("Web3Auth Single Factor Auth SDK not initialized yet");
      return;
    }
    try {
      const userCredential = await web3authSFAuth.authenticateUser();
      uiConsole(userCredential);
    } catch (err) {
      uiConsole("Error during user authentication:", err);
    }
  };

  const uiConsole = (...args: any[]): void => {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  };

  const fetchUtxos = async (address: string) => {
    try {
      const response = await axios.get(`https://blockstream.info/testnet/api/address/${address}/utxo`);
      return response.data.filter((utxo: { status: { confirmed: boolean } }) => utxo.status.confirmed);
    } catch (error) {
      console.error("Error fetching UTXOs:", error);
      return [];
    }
  };

  const getBitcoinAddressAndKeys = (privateKey: string) => {
    if (!privateKey) return { address: null, tweakedChildNode: null, xOnlyPubKey: null };
    const keyPair = ECPair.fromPrivateKey(Buffer.from(privateKey, "hex"));
    const bufPubKey = keyPair.publicKey;
    const xOnlyPubKey = bufPubKey.subarray(1, 33);
    const tweakedChildNode = keyPair.tweak(crypto.taggedHash("TapTweak", xOnlyPubKey));
    const { address, output } = payments.p2tr({
      pubkey: Buffer.from(tweakedChildNode.publicKey.subarray(1, 33)),
      network,
    });
    return { address, output, tweakedChildNode, xOnlyPubKey };
  };

  const getBitcoinAddress = (): string | undefined => {
    const { address } = getBitcoinAddressAndKeys(pk);
    if (!address) {
      console.error("Unable to generate address.");
      return;
    }
    console.log("Bitcoin Taproot Address: ", address);
    uiConsole("Bitcoin Taproot Address: ", address);
    return address;
  };

  const sendTaprootTransaction = async () => {
    const { address, output, tweakedChildNode, xOnlyPubKey } = getBitcoinAddressAndKeys(pk);
    if (!address || !tweakedChildNode || !xOnlyPubKey) return;

    const utxos = await fetchUtxos(address);
    console.log("utxos: ", utxos);
    if (utxos.length === 0) {
      return "No confirmed UTXOs found, send some funds to the address first.";
    }

    const utxo = utxos[0];
    const amount = utxo.value;
    const feeResponse = await axios.get("https://blockstream.info/testnet/api/fee-estimates");
    const maxFee = Math.max(...(Object.values(feeResponse.data) as number[]));
    const fee = maxFee * 1.2;
    if (amount <= fee) {
      const errorMsg = `Insufficient funds: ${amount} <= ${fee}`;
      uiConsole(errorMsg);
      throw new Error(errorMsg);
    }

    const sendAmount = amount - Math.floor(fee);

    const psbt = new Psbt({ network })
      .addInput({
        hash: utxo.txid,
        index: utxo.vout,
        witnessUtxo: { value: utxo.value, script: output! },
        tapInternalKey: xOnlyPubKey,
      })
      .addOutput({ value: sendAmount, address: "tb1ph9cxmts2r8z56mfzyhem74pep0kfz2k0pc56uhujzx0c3v2rrgssx8zc5q" });

    psbt.signInput(0, tweakedChildNode);
    psbt.finalizeAllInputs();
    const txHex = psbt.extractTransaction().toHex();

    try {
      const response = await axios.post(`https://blockstream.info/testnet/api/tx`, txHex);
      console.log("Transaction sent successfully:", response.data);
      uiConsole("Transaction sent successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error sending transaction:", error);
      uiConsole("Error sending transaction", error);
      throw error;
    }
  };

  const getBitcoinBalance = async () => {
    const { address } = getBitcoinAddressAndKeys(pk);
    if (!address) {
      console.error("Unable to generate address.");
      return;
    }

    try {
      const utxos = await fetchUtxos(address);
      const balance = utxos.reduce((acc: any, utxo: { value: any }) => acc + utxo.value, 0);
      console.log("Bitcoin Balance: ", balance);
      uiConsole("Bitcoin Balance: ", balance);
      return balance;
    } catch (error) {
      console.error("Error fetching balance:", error);
      uiConsole("Error fetching balance:", error);
    }
  };

  const loginView = (
    <>
      <div className="flex-container">
        <button onClick={getUserInfo} className="card">
          Get User Info
        </button>
        <button onClick={authenticateUser} className="card">
          Get ID Token
        </button>
        <button onClick={getBitcoinAddress} className="card">
          Get Bitcoin Taproot Address
        </button>
        <button onClick={getBitcoinBalance} className="card">
          Get Bitcoin Balance
        </button>
        <button onClick={sendTaprootTransaction} className="card">
          Send Bitcoin Taproot Transaction
        </button>
        <button onClick={logout} className="card">
          Log Out
        </button>
      </div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
    </>
  );

  const logoutView = <GoogleLogin onSuccess={onSuccess} useOneTap />;

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/core-kit/sfa-web" rel="noreferrer">
          Web3Auth
        </a>{" "}
        SFA Bitcoin Demo
      </h1>
      <h3 className="sub-title">Bitcoin Taproot Example</h3>
      {isLoggingIn ? <Loading /> : <div className="grid">{web3authSFAuth ? (provider ? loginView : logoutView) : null}</div>}
      <footer className="footer">
        <a
          href="https://github.com/web3auth/web3auth-core-kit-examples/tree/main/single-factor-auth-web/sfa-web-bitcoin-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
        <a href="https://blockstream.info/testnet/" target="_blank" rel="noopener noreferrer">
          Block Explorer
        </a>
        <a href="https://coinfaucet.eu/en/btc-testnet/" target="_blank" rel="noopener noreferrer">
          Faucet
        </a>
      </footer>
    </div>
  );
}

export default App;
