import { useEffect, useState } from "react";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES, IProvider, WALLET_ADAPTERS, WEB3AUTH_NETWORK, CustomChainConfig } from "@web3auth/base";
import { AuthAdapter, AuthLoginParams } from "@web3auth/auth-adapter";
import { WalletConnectV2Adapter, getWalletConnectV2Settings } from "@web3auth/wallet-connect-v2-adapter";
import { WalletConnectModal } from "@walletconnect/modal";
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";
import "./App.css";
import TronRpc from "./tronRPC";

const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ";
const projectId = "04309ed1007e77d1f119b85205bb779d";

const chainConfig: CustomChainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x94a9059e", // "0x2b6653dc" for Tron Mainnet
  rpcTarget: "https://api.shasta.trongrid.io/jsonrpc",
  displayName: "TRON Shasta Testnet",
  blockExplorerUrl: "https://shasta.tronscan.org",
  ticker: "TRX",
  tickerName: "TRON",
  logo: "https://cryptologos.cc/logos/tron-trx-logo.png",
};

function App() {
  const [web3auth, setWeb3Auth] = useState<Web3AuthNoModal | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [walletServicesPlugin, setWalletServicesPlugin] = useState<WalletServicesPlugin | null>(null);
  const [tronRpc, setTronRpc] = useState<TronRpc | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const web3authInstance = await initializeWeb3Auth();
        setWeb3Auth(web3authInstance);

        if (web3authInstance.connected) {
          setLoggedIn(true);
          setProvider(web3authInstance.provider);
          const tronRpcInstance = await initializeTronRpc(web3authInstance.provider!);
          setTronRpc(tronRpcInstance);
        }
      } catch (error) {
        console.error("Initialization failed:", error);
      }
    };

    init();
  }, []);

  const initializeWeb3Auth = async (): Promise<Web3AuthNoModal> => {
    const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });
    const web3auth = new Web3AuthNoModal({
      clientId,
      web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
      privateKeyProvider,
    });

    const authAdapter = new AuthAdapter({
      adapterSettings: {
        uxMode: "redirect",
      },
    });
    web3auth.configureAdapter(authAdapter);

    const defaultWcSettings = await getWalletConnectV2Settings(CHAIN_NAMESPACES.EIP155, ["0x2b6653dc", "0x94a9059e"], projectId);
    const walletConnectModal = new WalletConnectModal({ projectId });
    const walletConnectV2Adapter = new WalletConnectV2Adapter({
      adapterSettings: {
        qrcodeModal: walletConnectModal,
        ...defaultWcSettings.adapterSettings,
      },
      loginSettings: { ...defaultWcSettings.loginSettings },
    });

    const walletServicesPluginInstance = new WalletServicesPlugin({
      wsEmbedOpts: {},
      walletInitOptions: { whiteLabel: { showWidgetButton: true } },
    });

    setWalletServicesPlugin(walletServicesPluginInstance);
    web3auth.addPlugin(walletServicesPluginInstance);
    web3auth.configureAdapter(walletConnectV2Adapter);

    await web3auth.init();
    return web3auth;
  };

  const initializeTronRpc = async (provider: IProvider): Promise<TronRpc> => {
    const tronRpcInstance = new TronRpc(provider);
    await tronRpcInstance.init();
    return tronRpcInstance;
  };

  const login = async () => {
    if (!web3auth) {
      return uiConsole("web3auth not initialized yet");
    }
    try {
      const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.AUTH, {
        loginProvider: "google",
      });
      setProvider(web3authProvider);
      setLoggedIn(true);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const loginWithSMS = async () => loginWithProvider("sms_passwordless", "+65-XXXXXXX");

  const loginWithEmail = async () => loginWithProvider("email_passwordless", "hello@web3auth.io");

  const loginWithProvider = async (loginProvider: string, loginHint: string) => {
    if (!web3auth) {
      return uiConsole("web3auth not initialized yet");
    }
    try {
      const web3authProvider = await web3auth.connectTo<AuthLoginParams>(WALLET_ADAPTERS.AUTH, {
        loginProvider,
        extraLoginOptions: { login_hint: loginHint },
      });
      setProvider(web3authProvider);
      setLoggedIn(true);
    } catch (error) {
      console.error(`Login with ${loginProvider} failed:`, error);
    }
  };

  const loginWCModal = async () => {
    if (!web3auth) {
      return uiConsole("web3auth not initialized yet");
    }
    try {
      const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.WALLET_CONNECT_V2);
      setProvider(web3authProvider);
      setLoggedIn(true);
    } catch (error) {
      console.error("Wallet Connect login failed:", error);
    }
  };

  const authenticateUser = async () => {
    if (!web3auth) {
      return uiConsole("web3auth not initialized yet");
    }
    try {
      const idToken = await web3auth.authenticateUser();
      uiConsole(idToken);
    } catch (error) {
      console.error("Failed to authenticate user:", error);
    }
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      return uiConsole("web3auth not initialized yet");
    }
    try {
      const user = await web3auth.getUserInfo();
      uiConsole(user);
    } catch (error) {
      console.error("Failed to get user info:", error);
    }
  };

  const logout = async () => {
    if (!web3auth) {
      return uiConsole("web3auth not initialized yet");
    }
    try {
      await web3auth.logout();
      setProvider(null);
      setLoggedIn(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleTronRpcMethod = async (method: keyof TronRpc) => {
    if (!tronRpc) {
      return uiConsole("TronRpc not initialized yet");
    }
    try {
      const result = await tronRpc[method]();
      uiConsole(result);
    } catch (error) {
      console.error(`Failed to execute ${method}:`, error);
    }
  };

  const showWalletUi = async () => {
    if (!walletServicesPlugin) {
      return uiConsole("WalletServicesPlugin not initialized yet");
    }
    try {
      await walletServicesPlugin.showWalletUi();
    } catch (error) {
      console.error("Failed to show Wallet UI:", error);
    }
  };

  const showWalletConnectScanner = async () => {
    if (!walletServicesPlugin) {
      return uiConsole("WalletServicesPlugin not initialized yet");
    }
    try {
      await walletServicesPlugin.showWalletConnectScanner();
    } catch (error) {
      console.error("Failed to show Wallet Connect Scanner:", error);
    }
  };

  const showCheckout = async () => {
    if (!walletServicesPlugin) {
      return uiConsole("WalletServicesPlugin not initialized yet");
    }
    try {
      await walletServicesPlugin.showCheckout();
    } catch (error) {
      console.error("Failed to show checkout:", error);
    }
  };

  const uiConsole = (...args: unknown[]): void => {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args, null, 2);
    }
  };

  const renderButton = (label: string, onClick: () => void) => (
    <div>
      <button onClick={onClick} className="card">
        {label}
      </button>
    </div>
  );

  const loggedInView = (
    <>
      <div className="flex-container">
        {renderButton("Get User Info", getUserInfo)}
        {renderButton("Get ID Token", authenticateUser)}
        {renderButton("Get Chain ID", () => handleTronRpcMethod("getChainId"))}
        {renderButton("Show Wallet UI", showWalletUi)}
        {renderButton("Show Wallet Connect Scanner", showWalletConnectScanner)}
        {renderButton("Fiat to Crypto", showCheckout)}
        {renderButton("Get Accounts", () => handleTronRpcMethod("getAccounts"))}
        {renderButton("Get Balance", () => handleTronRpcMethod("getBalance"))}
        {renderButton("Sign Message", () => handleTronRpcMethod("signMessage"))}
        {renderButton("Send Transaction", () => handleTronRpcMethod("sendTransaction"))}
        {renderButton("Get Private Key", () => handleTronRpcMethod("getPrivateKey"))}
        {renderButton("Log Out", logout)}
      </div>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <p>Running low on TRX for testing? No worries!</p>
        <a href="https://shasta.tronex.io/" target="_blank" rel="noopener noreferrer" style={{ color: "#007bff", textDecoration: "underline" }}>
          Get some testnet TRX coins from the Shasta Faucet
        </a>
      </div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p>Logged in Successfully!</p>
      </div>
    </>
  );

  const unloggedInView = (
    <>
      {renderButton("Login with Google", login)}
      {renderButton("SMS Login (e.g +cc-number)", loginWithSMS)}
      {renderButton("Email Login (e.g hello@web3auth.io)", loginWithEmail)}
      {renderButton("Login with Wallet Connect v2", loginWCModal)}
    </>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/no-modal" rel="noreferrer">
          Web3Auth
        </a>{" "}
        & React Tron Example
      </h1>

      <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-no-modal-sdk/blockchain-connection-examples/tron-no-modal-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
        <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FWeb3Auth%2Fweb3auth-pnp-examples%2Ftree%2Fmain%2Fweb-no-modal-sdk%2Fblockchain-connection-examples%2Ftron-no-modal-example&project-name=w3a-tron-no-modal&repository-name=w3a-tron-no-modal">
          <img src="https://vercel.com/button" alt="Deploy with Vercel" />
        </a>
      </footer>
    </div>
  );
}

export default App;
