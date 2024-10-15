import React, { useState, useEffect } from "react";
import { ethers, Signer } from "ethers";
import { Client, useClient } from "@xmtp/react-sdk";
import { ConversationContainer } from "./ConversationContainer";

interface HomeProps {
  wallet: Signer;
  env?: string;
  isPWA?: boolean;
  onLogout?: () => void;
  isContained?: boolean;
  isConsent?: boolean;
}

export default function Home({
  wallet,
  env,
  isPWA = false,
  onLogout,
  isContained = false,
  isConsent = false,
}: HomeProps): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOnNetwork, setIsOnNetwork] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const initialIsOpen =
      isPWA ||
      isContained ||
      localStorage.getItem("isWidgetOpen") === "true" ||
      false;
    const initialIsOnNetwork =
      localStorage.getItem("isOnNetwork") === "true" || false;
    const initialIsConnected =
      (localStorage.getItem("isConnected") === "true" && wallet !== null) || false;

    setIsOpen(initialIsOpen);
    setIsOnNetwork(initialIsOnNetwork);
    setIsConnected(initialIsConnected);
  }, []);

  const { client, error, isLoading, initialize, disconnect } = useClient();
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [signer, setSigner] = useState<Signer | undefined>();

  const styles: { [key: string]: React.CSSProperties } = {
    FloatingLogo: {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      backgroundColor: "white",
      display: "flex",
      alignItems: "center",
      border: "1px solid #ccc",
      justifyContent: "center",
      cursor: "pointer",
      transition: "transform 0.3s ease",
      padding: "5px",
    },
    uContainer: {
      position: isContained ? "relative" : isPWA ? "relative" : "fixed",
      bottom: isContained ? "0px" : isPWA ? "0px" : "80px",
      right: isContained ? "0px" : isPWA ? "0px" : "20px",
      width: isContained ? "100%" : isPWA ? "100%" : "300px",
      height: isContained ? "100%" : isPWA ? "100vh" : "400px",
      border: isContained ? "0px" : isPWA ? "0px" : "1px solid #ccc",
      backgroundColor: "#f9f9f9",
      borderRadius: isContained ? "0px" : isPWA ? "0px" : "10px",
      zIndex: 1000,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    },
    logoutBtn: {
      position: "absolute",
      top: "10px",
      textDecoration: "none",
      color: "#000",
      left: "5px",
      background: "transparent",
      border: "none",
      fontSize: isPWA ? "12px" : "10px",
      cursor: "pointer",
    },
    widgetHeader: {
      padding: "2px",
    },
    label: {
      fontSize: "10px",
      textAlign: "center",
      marginTop: "5px",
      cursor: "pointer",
      display: "block",
    },
    conversationHeader: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "none",
      border: "none",
      width: "auto",
      margin: "0px",
    },
    conversationHeaderH4: {
      margin: "0px",
      padding: "4px",
      fontSize: isPWA ? "20px" : "14px",
    },
    backButton: {
      border: "0px",
      background: "transparent",
      cursor: "pointer",
      fontSize: isPWA ? "20px" : "14px",
    },
    widgetContent: {
      flexGrow: 1,
      overflowY: "auto",
    },
    xmtpContainer: {
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      alignItems: "center",
      height: "100%",
    },
    btnXmtp: {
      backgroundColor: "#f0f0f0",
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      color: "#000",
      justifyContent: "center",
      border: "1px solid grey",
      padding: isPWA ? "20px" : "10px",
      borderRadius: "5px",
      fontSize: isPWA ? "20px" : "14px",
    },
  };

  useEffect(() => {
    localStorage.setItem("isOnNetwork", isOnNetwork.toString());
    localStorage.setItem("isWidgetOpen", isOpen.toString());
    localStorage.setItem("isConnected", isConnected.toString());
  }, [isOpen, isConnected, isOnNetwork]);

  useEffect(() => {
    if (wallet) {
      setSigner(wallet);
      setIsConnected(true);
    }
    if (client && !isOnNetwork) {
      setIsOnNetwork(true);
    }
    if (signer && isOnNetwork) {
      initXmtpWithKeys();
    }
  }, [wallet, signer, client]);

  const connectWallet = async (): Promise<void> => {
    if (typeof (window as any).ethereum !== 'undefined') {
      try {
        await (window as any).ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        setSigner(signer);
        setIsConnected(true);
      } catch (error) {
        console.error("User rejected request", error);
      }
    } else {
      console.error("Metamask not found");
    }
  };

  const getAddress = async (signer: Signer): Promise<string | null> => {
    try {
      if (signer && typeof signer.getAddress === "function") {
        return await signer.getAddress();
      }
      if (signer && typeof (signer as any).getAddresses === "function") {
        //viem
        const [address] = await (signer as any).getAddresses();
        return address;
      }
      return null;
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  const [isWalletCreated, setIsWalletCreated] = useState<boolean>(false);

  const createNewWallet = async (): Promise<void> => {
    const newWallet = ethers.Wallet.createRandom();
    console.log("Your address", newWallet.address);
    setSigner(newWallet);
    setIsConnected(true);
    setIsWalletCreated(true);
  };
  const initXmtpWithKeys = async (): Promise<void> => {
    const options = { env: env ? env : getEnv() };
    const address = await getAddress(signer as Signer);
    if (!address) return;
    let keys = loadKeys(address);
    if (!keys) {
      keys = await Client.getKeys(signer as Signer, {
        ...options,
        skipContactPublishing: true,
        persistConversations: false,
        env: options.env as "local" | "dev" | "production" | undefined,
      });
      storeKeys(address, keys);
    }
    setLoading(true);
    await initialize({ keys, options: { ...options, env: options.env as "local" | "dev" | "production" | undefined }, signer: signer as Signer });
  };

  const openWidget = (): void => {
    setIsOpen(true);
  };

  const closeWidget = (): void => {
    setIsOpen(false);
  };

  if (typeof window !== 'undefined') {
    (window as any).FloatingInbox = {
      open: openWidget,
      close: closeWidget,
    };
  }
  const handleLogout = async (): Promise<void> => {
    setIsConnected(false);
    const address = await getAddress(signer as Signer);
    if (address) wipeKeys(address);
    console.log("wipe", address);
    setSigner(undefined);
    setIsOnNetwork(false);
    await disconnect();
    setSelectedConversation(null);
    localStorage.removeItem("isOnNetwork");
    localStorage.removeItem("isConnected");
    if (typeof onLogout === "function") {
      onLogout();
    }
  };

  return (
    <>
      {!isPWA && !isContained && (
        <div
          onClick={isOpen ? closeWidget : openWidget}
          className={
            "FloatingInbox " +
            (isOpen ? "spin-clockwise" : "spin-counter-clockwise")
          }
          style={styles.FloatingLogo}
        >
          💬
        </div>
      )}
      {isOpen && (
        <div
          style={styles.uContainer}
          className={" " + (isOnNetwork ? "expanded" : "")}
        >
          {isConnected && (
            <button style={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          )}
          {isConnected && isOnNetwork && (
            <div style={styles.widgetHeader}>
              <div style={styles.conversationHeader}>
                {isOnNetwork && selectedConversation && (
                  <button
                    style={styles.backButton}
                    onClick={() => {
                      setSelectedConversation(null);
                    }}
                  >
                    ←
                  </button>
                )}
                <h4 style={styles.conversationHeaderH4}>Conversations</h4>
              </div>
            </div>
          )}
          {isConnected}
          <div style={styles.widgetContent}>
            {!isConnected && (
              <div style={styles.xmtpContainer}>
                <button style={styles.btnXmtp} onClick={connectWallet}>
                  Connect Wallet
                </button>
                <div style={styles.label} onClick={createNewWallet}>
                  or create new one
                </div>
              </div>
            )}
            {isConnected && !isOnNetwork && (
              <div style={styles.xmtpContainer}>
                <button style={styles.btnXmtp} onClick={initXmtpWithKeys}>
                  Connect to XMTP
                </button>
                {isWalletCreated && signer && 'address' in signer && (
                  <button style={styles.label}>
                    Your address: {signer.address?.toString()}
                  </button>
                )}
              </div>
            )}
            {isConnected && isOnNetwork && client && (
              <ConversationContainer
                isPWA={isPWA}
                isConsent={isConsent}
                isContained={isContained}
                selectedConversation={selectedConversation}
                setSelectedConversation={setSelectedConversation}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

const ENCODING = "binary";

export const getEnv = (): string => {
  // "dev" | "production" | "local"
  return typeof process !== 'undefined' && process.env.REACT_APP_XMTP_ENV
    ? process.env.REACT_APP_XMTP_ENV
    : "production";
};
export const buildLocalStorageKey = (walletAddress: string): string => {
  return walletAddress ? `xmtp:${getEnv()}:keys:${walletAddress}` : "";
};

export const loadKeys = (walletAddress: string): Uint8Array | null => {
  const val = localStorage.getItem(buildLocalStorageKey(walletAddress));
  return val ? Buffer.from(val, ENCODING) : null;
};

export const storeKeys = (walletAddress: string, keys: Uint8Array): void => {
  localStorage.setItem(
    buildLocalStorageKey(walletAddress),
    Buffer.from(keys).toString(ENCODING)
  );
};

export const wipeKeys = (walletAddress: string): void => {
  localStorage.removeItem(buildLocalStorageKey(walletAddress));
};
