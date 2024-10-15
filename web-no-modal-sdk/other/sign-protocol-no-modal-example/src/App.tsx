import { CHAIN_NAMESPACES, IProvider, WALLET_ADAPTERS, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { AuthAdapter } from "@web3auth/auth-adapter";
import { useEffect, useState } from "react";
import EthereumRPC from "./ethereumRPC";
import "./App.css";
import SignClient from "./signClient";


const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7",
  rpcTarget: "https://rpc.ankr.com/eth_sepolia",
  displayName: "Ethereum Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

const web3auth = new Web3AuthNoModal({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  privateKeyProvider,
});

const authAdapter = new AuthAdapter();
web3auth.configureAdapter(authAdapter);

function App() {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {

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

  const login = async () => {

    const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.AUTH, {
      loginProvider: "google",
    });

    setProvider(web3authProvider);

    if (web3auth.connected) {
      setLoggedIn(true);
    }
  };

  const getUserInfo = async () => {
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
    uiConsole("logged out");
  };


  const getAccounts = async () => {
    if (!provider) {
      uiConsole("Provider not initialized yet");
      return;
    }

    const ethereumRPC = new EthereumRPC(provider!);
    const address = await ethereumRPC.getAccount();
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("Provider not initialized yet");
      return;
    }

    const ethereumRPC = new EthereumRPC(provider!);
    const balance = await ethereumRPC.fetchBalance();
    uiConsole(balance);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("Provider not initialized yet");
      return;
    }

    const ethereumRPC = new EthereumRPC(provider!);
    const signedMessage = await ethereumRPC.signMessage();
    uiConsole(signedMessage);
  };


  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("Provider not initialized yet");
      return;
    }

    const ethereumRPC = new EthereumRPC(provider!);
    uiConsole("Sending Transaction...");

    const hash = await ethereumRPC.sendTransaction();
    uiConsole(hash);
  };

  const createAttestation = async () => {
    if (!provider) {
      uiConsole("Provider not initialized yet");
      return;
    }

    const ethereumRPC = new EthereumRPC(provider!);
    const signClient = new SignClient(ethereumRPC.walletClient);
    uiConsole("Creating Attestation...");

    const address = await ethereumRPC.getAccount();
    const response = await signClient.attest(address);

    uiConsole({
      "hash": response.txHash,
      "attestationId": response.attestationId,
    });
  };

  const fetchAccountAttestations = async () => {
    if (!provider) {
      uiConsole("Provider not initialized yet");
      return;
    }

    const ethereumRPC = new EthereumRPC(provider!);
    const signClient = new SignClient(ethereumRPC.walletClient);
    uiConsole("Fetching Attestation...");

    const address = await ethereumRPC.getAccount();
    const response = await signClient.fetchAccountAttestations(address);

    uiConsole(response);
  }

  function uiConsole(...args: any[]): void {
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
          <button onClick={getUserInfo} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={getBalance} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={sendTransaction} className="card">
            Send Transaction
          </button>
        </div>
        <div>
          <button onClick={createAttestation} className="card">
            Create attestation
          </button>
        </div>
        <div>
          <button onClick={fetchAccountAttestations} className="card">
            Fetch attestations
          </button>
        </div>
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
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
        &
        <a target="_blank" href="https://docs.sign.global/" rel="noreferrer">
          {" "}Sign Protocol{" "}
        </a>
        Quick Start
      </h1>

      <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-no-modal-sdk/quick-starts/react-no-modal-quick-start"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
        <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FWeb3Auth%2Fweb3auth-pnp-examples%2Ftree%2Fmain%2Fweb-modal-sdk%2Fquick-starts%2Freact-modal-quick-start&project-name=w3a-evm-modal&repository-name=w3a-evm-modal">
          <img src="https://vercel.com/button" alt="Deploy with Vercel" />
        </a>
      </footer>
    </div>
  );
}

export default App;
