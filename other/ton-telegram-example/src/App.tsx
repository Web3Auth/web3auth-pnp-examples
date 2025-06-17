import { useEffect, useState } from "react";
import {
  Web3Auth,
  WEB3AUTH_NETWORK,
  WALLET_CONNECTORS,
  AUTH_CONNECTION,
} from "@web3auth/modal";
import TonRPC from "./tonRpc";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import { useTelegramMock } from "./hooks/useMockTelegramInitData";
import { Sun, Moon, Copy, Check } from "lucide-react";
import Loading from "./components/Loading";
import TelegramLogo from "./assets/TelegramLogo.svg";
import web3AuthLogoLight from "./assets/web3AuthLogoLight.svg";
import web3AuthLogoDark from "./assets/web3AuthLogoDark.svg";
import "./App.css";

const authConnectionId = "w3a-telegram-demo";
const clientId =
  "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ";

const generateGenericAvatarUrl = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=random`;

const getFallbackAvatar = (user: any) => {
  if (!user) return generateGenericAvatarUrl("User");

  const name =
    `${user.firstName || user.first_name || ""} ${
      user.lastName || user.last_name || ""
    }`.trim() ||
    user.username ||
    "User";
  return user.photoUrl || user.photo_url || generateGenericAvatarUrl(name);
};

function App() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null);
  const [web3AuthInitialized, setWeb3AuthInitialized] = useState(false);
  const [userData, setUserData] = useState<any | null>(null);
  const [tonAccountAddress, setTonAccountAddress] = useState<string | null>(
    null
  );
  const [signedMessage, setSignedMessage] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({
    account: false,
    message: false,
  });

  const { initDataRaw, initData } = useLaunchParams() || {};

  useTelegramMock();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark-mode");
      document.body.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const initializeWeb3Auth = async () => {
      try {
        const web3authInstance = new Web3Auth({
          clientId,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
        });

        setWeb3Auth(web3authInstance);
        await web3authInstance.init();
        setWeb3AuthInitialized(true);
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
      }
    };

    initializeWeb3Auth();
  }, []);

  useEffect(() => {
    const connectWeb3Auth = async () => {
      if (web3Auth && web3AuthInitialized && initDataRaw) {
        setIsLoggingIn(true);
        try {
          if (web3Auth.status === "connected") {
            await web3Auth.logout();
          }

          const idToken = await getIdTokenFromServer(
            initDataRaw,
            initData?.user.photoUrl
          );
          if (!idToken) return;

          await web3Auth.connectTo(WALLET_CONNECTORS.AUTH, {
            authConnectionId,
            authConnection: AUTH_CONNECTION.CUSTOM,
            idToken,
            extraLoginOptions: {
              isUserIdCaseSensitive: true,
            },
          });

          setIsLoggedIn(true);

          const tonRpc = new TonRPC(web3Auth.provider);
          const tonAddress = await tonRpc.getAccounts();
          setTonAccountAddress(tonAddress);

          const messageToSign = "Hello, TON!";
          const signedMsg = await tonRpc.signMessage(messageToSign);
          setSignedMessage(signedMsg);
        } catch (error) {
          console.error("Error during Web3Auth connection:", error);
        } finally {
          setIsLoggingIn(false);
        }
      }
    };

    if (web3AuthInitialized && initDataRaw) {
      connectWeb3Auth();
    }
  }, [initDataRaw, web3Auth, web3AuthInitialized, initData?.user.photoUrl]);

  useEffect(() => {
    if (initData?.user) {
      setUserData(initData.user);
    }
  }, [initData]);

  const getIdTokenFromServer = async (
    initDataRaw: string,
    photoUrl: string | undefined
  ) => {
    const isMocked = !!sessionStorage.getItem("____mocked");
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/auth/telegram`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ initDataRaw, isMocked, photoUrl }),
      }
    );
    const data = await response.json();
    return data.token;
  };

  const copyToClipboard = async (text: string, type: "account" | "message") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates((prev) => ({
        ...prev,
        [type]: true,
      }));

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedStates((prev) => ({
          ...prev,
          [type]: false,
        }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="logo-container">
          <img
            src={isDarkMode ? web3AuthLogoDark : web3AuthLogoLight}
            alt="Web3Auth Logo"
            className="web3auth-logo"
          />
          <button
            onClick={toggleDarkMode}
            className="theme-toggle"
            aria-label="Toggle dark mode">
            {isDarkMode ? (
              <Sun className="text-yellow-500" />
            ) : (
              <Moon className="text-gray-700" />
            )}
          </button>
        </div>
        <div className="title">
          <h4>Web3Auth Telegram MiniApp</h4>
        </div>

        <div className="description">
          <p>
            Seamless wallet access on any chain with Telegram. Just one click,
            and you're in!
          </p>
        </div>
      </div>
      {isLoggingIn ? (
        <Loading />
      ) : (
        <div className="grid">
          {isLoggedIn && (
            <>
              <div className="user-info-box">
                <img
                  src={getFallbackAvatar(userData)}
                  alt="User avatar"
                  className="user-avatar"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = generateGenericAvatarUrl(
                      userData?.firstName || userData?.username || "User"
                    );
                  }}
                />
                <div className="user-info">
                  <div className="id-with-logo">
                    <p>
                      <strong>ID:</strong> {userData?.id}
                    </p>
                    <img
                      src={TelegramLogo}
                      alt="Telegram Logo"
                      className="telegram-logo"
                    />
                  </div>
                  <p>
                    <strong>Username:</strong> {userData?.username}
                  </p>
                  <p>
                    <strong>Name:</strong> {userData?.firstName}{" "}
                    {userData?.lastName || ""}
                  </p>
                </div>
              </div>
              <div
                className="info-box"
                onClick={() =>
                  copyToClipboard(tonAccountAddress || "", "account")
                }>
                <div className="info-box-content">
                  <p>
                    <strong>TON Account:</strong>
                    <span className="ellipsed-text">{tonAccountAddress}</span>
                  </p>
                  {copiedStates.account ? (
                    <Check className="copy-icon success" size={18} />
                  ) : (
                    <Copy className="copy-icon" size={18} />
                  )}
                </div>
              </div>
              <div
                className="info-box"
                onClick={() => copyToClipboard(signedMessage || "", "message")}>
                <div className="info-box-content">
                  <p>
                    <strong>Signed Message:</strong>
                    <span className="ellipsed-text">{signedMessage}</span>
                  </p>
                  {copiedStates.message ? (
                    <Check className="copy-icon success" size={18} />
                  ) : (
                    <Copy className="copy-icon" size={18} />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <footer className="footer">
        <a
          href="https://web3auth.io/community/t/build-powerful-telegram-mini-apps-with-web3auth/9244"
          target="_blank"
          rel="noopener noreferrer"
          className="learn-more-button">
          Telegram MiniApp Setup Guide
        </a>
      </footer>
    </div>
  );  
}

export default App;
