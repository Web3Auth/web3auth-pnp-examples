import "./App.css";
import { useWeb3AuthConnect, useWeb3AuthDisconnect, useWeb3AuthUser} from "@web3auth/no-modal/react";
import { WALLET_CONNECTORS, AUTH_CONNECTION } from "@web3auth/no-modal";
import { useAccount } from "wagmi";
import { SendTransaction } from "./components/sendTransaction";
import { Balance } from "./components/getBalance";
import { SwitchChain } from "./components/switchNetwork";
import { useAuth0 } from "@auth0/auth0-react";
import { GoogleLogin, CredentialResponse, googleLogout } from "@react-oauth/google";

function App() {
  const { connect, isConnected, connectorName, loading: connectLoading, error: connectError } = useWeb3AuthConnect();
  const { disconnect, loading: disconnectLoading, error: disconnectError } = useWeb3AuthDisconnect();
  const { userInfo } = useWeb3AuthUser();
  const { address } = useAccount();
  const { getIdTokenClaims, loginWithPopup } = useAuth0();

  const loginWithGoogle = async (response: CredentialResponse) => {
    const idToken = response.credential;

    await connect(WALLET_CONNECTORS.AUTH, {
      groupedAuthConnectionId: "aggregate-sapphire",
      authConnectionId: "w3a-google",
      authConnection: AUTH_CONNECTION.CUSTOM,
      id_token: idToken,
      extraLoginOptions: {
        isUserIdCaseSensitive: false,
        verifierIdField: "email",
      },
    });
  };

  const loginWithAuth0 = async () => {
    try {
      await loginWithPopup();
      const idToken = (await getIdTokenClaims())?.__raw.toString();
      if (!idToken) {
        throw new Error("No id token found");
      }
      await connect(WALLET_CONNECTORS.AUTH, {
        groupedAuthConnectionId: "aggregate-sapphire",
        authConnectionId: "w3a-a0-github",
        authConnection: AUTH_CONNECTION.CUSTOM,
        id_token: idToken,
        extraLoginOptions: {
          isUserIdCaseSensitive: false,
          verifierIdField: "email",
        },
      });

    } catch (err) {
      console.error(err);
    }
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
      console.log(...args);
    }
  }

  const loggedInView = (
    <>
      <h2>Connected to {connectorName}</h2>
      <div>{address}</div>
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
      </div>
      <SendTransaction />
      <Balance />
      <SwitchChain />
    </>
  );

  const unloggedInView = (
    <div className="flex-container">
      <div className="card">
        <GoogleLogin
          onSuccess={loginWithGoogle}
          onError={() => {
            console.log("Login Failed");
          }}
          shape="pill"
          theme="filled_blue"
          text="signin_with"
          size="large"
          logo_alignment="center"
        />
      </div>
      <button onClick={loginWithAuth0} className="card">
        Login with Auth0 GitHub
      </button>
    </div>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/no-modal" rel="noreferrer">
          Web3Auth{" "}
        </a>
        & React No Modal with Auth0 & Google Grouped Connection JWT
      </h1>

      <div className="grid">{isConnected ? loggedInView : unloggedInView}</div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-no-modal-sdk/custom-authentication/grouped-connection/auth0-google-jwt-grouped-no-modal-example"
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
