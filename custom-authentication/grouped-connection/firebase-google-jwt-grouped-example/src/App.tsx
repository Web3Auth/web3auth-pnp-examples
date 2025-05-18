import "./App.css";
import { useWeb3AuthConnect, useWeb3AuthDisconnect, useWeb3AuthUser } from "@web3auth/modal/react";
import { WALLET_CONNECTORS, AUTH_CONNECTION } from "@web3auth/modal";
import { initializeApp } from "firebase/app";
import { GithubAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { SendTransaction } from "./components/sendTransaction";
import { Balance } from "./components/getBalance";
import { SwitchChain } from "./components/switchNetwork";
import { useAccount } from "wagmi";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAAF-xdPur0wJpgwXLGdLZWDwRCTRLdX8",
  authDomain: "web3auth-firebase-github.firebaseapp.com",
  projectId: "web3auth-firebase-github",
  storageBucket: "web3auth-firebase-github.appspot.com",
  messagingSenderId: "384159528034",
  appId: "1:384159528034:web:9a9121481ea2948237cd3b",
};

function App() {
  const { connectTo, isConnected, connectorName } = useWeb3AuthConnect();
  const { disconnect } = useWeb3AuthDisconnect();
  const { userInfo } = useWeb3AuthUser();
  const { address } = useAccount();

  const loginWithGoogle = async (response: CredentialResponse) => {
    const idToken = response.credential;

    await connectTo(WALLET_CONNECTORS.AUTH, {
      groupedAuthConnectionId: "aggregate-sapphire",
      authConnectionId: "w3a-google",
      authConnection: AUTH_CONNECTION.GOOGLE,
      idToken,
      extraLoginOptions: {
        isUserIdCaseSensitive: false,
      },
    });
  };

  const loginWithFirebaseGithub = async () => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const githubProvider = new GithubAuthProvider();

    const result = await signInWithPopup(auth, githubProvider);    

    const idToken = await result.user.getIdToken(true);

    connectTo(WALLET_CONNECTORS.AUTH, {
      groupedAuthConnectionId: "aggregate-sapphire",
      authConnectionId: "w3a-firebase",
      authConnection: AUTH_CONNECTION.CUSTOM,
      idToken,
      extraLoginOptions: {
        isUserIdCaseSensitive: false,
      },
    });
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
      <button onClick={loginWithFirebaseGithub} className="card">
        Login with Firebase GitHub
      </button>
    </div>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/no-modal" rel="noreferrer">
          Web3Auth{" "}
        </a>
        & React No Modal with Firebase & Google Grouped Connection JWT
      </h1>

      <div className="grid">{isConnected ? loggedInView : unloggedInView}</div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-no-modal-sdk/custom-authentication/grouped-connection/firebase-google-jwt-grouped-no-modal-example"
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
