import { getPublicCompressed } from "@toruslabs/eccrypto";
import { CustomChainConfig, IProvider, UX_MODE, WALLET_ADAPTERS, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import * as jose from "jose";
import * as React from "react";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

import { chain } from "../config/chainConfig";
import { getWalletProvider, IWalletProvider } from "./walletProvider";

export interface IWeb3AuthContext {
  web3Auth: Web3AuthNoModal | null;
  connected: boolean;
  provider: IWalletProvider | null;
  isLoading: boolean;
  user: any;
  address: string;
  balance: string;
  chainId: string;
  playgroundConsole: string;
  connectedChain: CustomChainConfig;
  loginAuth0: () => Promise<void>;
  loginGoogle: () => Promise<void>;
  loginGitHub: () => Promise<void>;
  loginFacebook: () => Promise<void>;
  logout: () => Promise<void>;
  getUserInfo: () => Promise<any>;
  getAddress: () => Promise<string>;
  getBalance: () => Promise<string>;
  getSignature: (message: string) => Promise<string>;
  sendTransaction: (amount: string, destination: string) => Promise<string>;
  getPrivateKey: () => Promise<string>;
  getChainId: () => Promise<string>;
  deployContract: (abi: any, bytecode: string, initValue: string) => Promise<any>;
  readContract: (contractAddress: string, contractABI: any) => Promise<string>;
  writeContract: (contractAddress: string, contractABI: any, updatedValue: string) => Promise<string>;
  verifyServerSide: (idToken: string) => Promise<any>;
  switchChain: (network: string) => Promise<void>;
  updateConnectedChain: (network: string) => void;
}

export const Web3AuthContext = createContext<IWeb3AuthContext>({
  web3Auth: null,
  provider: null,
  isLoading: false,
  connected: false,
  user: null,
  address: null,
  balance: null,
  chainId: null,
  playgroundConsole: "",
  connectedChain: chain["Sepolia Testnet"],
  loginAuth0: async () => null,
  loginGoogle: async () => null,
  loginGitHub: async () => null,
  loginFacebook: async () => null,
  logout: async () => {},
  getUserInfo: async () => null,
  getAddress: async () => "",
  getBalance: async () => "",
  getSignature: async () => "",
  sendTransaction: async () => "",
  getPrivateKey: async () => "",
  getChainId: async () => "",
  deployContract: async () => {},
  readContract: async () => "",
  writeContract: async () => "",
  verifyServerSide: async () => {},
  switchChain: async () => null,
  updateConnectedChain: () => {},
});

export function useWeb3Auth(): IWeb3AuthContext {
  return useContext(Web3AuthContext);
}

interface IWeb3AuthProps {
  children?: ReactNode;
}

export const Web3AuthProvider = ({ children }: IWeb3AuthProps) => {
  const [web3Auth, setWeb3Auth] = useState<Web3AuthNoModal | null>(null);
  const [provider, setProvider] = useState<IWalletProvider | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [playgroundConsole, setPlaygroundConsole] = useState<string>("");
  const [chainId, setChainId] = useState<any>(null);
  const [connectedChain, setConnectedChain] = useState<CustomChainConfig>(chain["Sepolia Testnet"]);
  const [connected, setConnected] = useState<boolean>(false);

  const uiConsole = (...args: unknown[]) => {
    setPlaygroundConsole(`${JSON.stringify(args || {}, null, 2)}\n\n\n\n${playgroundConsole}`);
    console.log(...args);
  };

  const setWalletProvider = useCallback(async (web3authProvider: IProvider | null) => {
    const walletProvider = getWalletProvider(web3authProvider, uiConsole);
    setProvider(walletProvider);
    setAddress(await walletProvider.getAddress());
    setBalance(await walletProvider.getBalance());
    setChainId(await walletProvider.getChainId());
  }, []);

  useEffect(() => {
    async function init() {
      try {
        setIsLoading(true);
        const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ";

        const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig: chain["Sepolia Testnet"] } });

        const web3AuthInstance = new Web3AuthNoModal({
          clientId,
          privateKeyProvider,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
        });

        const openloginAdapter = new OpenloginAdapter({
          privateKeyProvider,
          loginSettings: {
            mfaLevel: "optional",
          },
          adapterSettings: {
            clientId,
            uxMode: UX_MODE.REDIRECT,
            loginConfig: {
              auth0: {
                verifier: "aggregate-sapphire",
                verifierSubIdentifier: "w3a-a0-email-passwordless",
                typeOfLogin: "jwt",
                clientId: "QiEf8qZ9IoasbZsbHvjKZku4LdnRC1Ct",
              },
              facebook: {
                verifier: "aggregate-sapphire",
                verifierSubIdentifier: "w3a-facebook",
                typeOfLogin: "facebook",
                clientId: "1222658941886084",
              },
              github: {
                verifier: "aggregate-sapphire",
                verifierSubIdentifier: "w3a-a0-github",
                typeOfLogin: "jwt",
                clientId: "hiLqaop0amgzCC0AXo4w0rrG9abuJTdu",
              },
            },
            mfaSettings: {
              deviceShareFactor: {
                enable: true,
                priority: 1,
                mandatory: true,
              },
              backUpShareFactor: {
                enable: true,
                priority: 2,
                mandatory: true,
              },
              socialBackupFactor: {
                enable: true,
                priority: 3,
                mandatory: true,
              },
              passwordFactor: {
                enable: true,
                priority: 4,
                mandatory: true,
              },
            },
          },
        });
        web3AuthInstance.configureAdapter(openloginAdapter);
        await web3AuthInstance.init();
        if (web3AuthInstance.status === "connected") {
          setWalletProvider(web3AuthInstance.provider);
          setUser(await web3AuthInstance.getUserInfo());
          setConnected(true);
        }
        setWeb3Auth(web3AuthInstance);
      } catch (error) {
        uiConsole(error);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [setWalletProvider]);

  const loginGoogle = async () => {
    if (!web3Auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    await web3Auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
      loginProvider: "google",
    });
    if (web3Auth.status === "connected") {
      setWalletProvider(web3Auth.provider);
      setUser(await web3Auth.getUserInfo());
      setConnected(true);
    }
  };

  const loginAuth0 = async () => {
    if (!web3Auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    await web3Auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
      loginProvider: "auth0",
      extraLoginOptions: {
        domain: "https://web3auth.au.auth0.com",
        verifierIdField: "email",
      },
    });
    if (web3Auth.status === "connected") {
      setWalletProvider(web3Auth.provider);
      setUser(await web3Auth.getUserInfo());
      setConnected(true);
    }
  };

  const loginGitHub = async () => {
    if (!web3Auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    await web3Auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
      loginProvider: "github",
      extraLoginOptions: {
        domain: "https://web3auth.au.auth0.com",
        verifierIdField: "email",
      },
    });
    if (web3Auth.status === "connected") {
      setWalletProvider(web3Auth.provider);
      setUser(await web3Auth.getUserInfo());
      setConnected(true);
    }
  };

  const loginFacebook = async () => {
    if (!web3Auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    await web3Auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
      loginProvider: "facebook",
    });
    if (web3Auth.status === "connected") {
      setWalletProvider(web3Auth.provider);
      setUser(await web3Auth.getUserInfo());
      setConnected(true);
    }
  };

  const logout = async () => {
    uiConsole("Logging out");
    if (!web3Auth) {
      uiConsole("web3auth not initialized yet");
      uiConsole("web3auth not initialized yet");
      return;
    }
    await web3Auth.logout();
    setProvider(null);
    setConnected(false);
  };

  const getUserInfo = async () => {
    if (!web3Auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const userInfo = await web3Auth.getUserInfo();
    setUser(userInfo);
    uiConsole(userInfo);
    return userInfo;
  };

  const getAddress = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return "";
    }
    const updatedAddress = await provider.getAddress();
    setAddress(updatedAddress);
    uiConsole(updatedAddress);
    return address;
  };

  const getBalance = async () => {
    if (!web3Auth) {
      uiConsole("web3auth not initialized yet");
      return "";
    }
    const updatedBalance = await provider.getBalance();

    setBalance(updatedBalance);
    uiConsole(updatedBalance);
    return balance;
  };

  const getSignature = async (message: string) => {
    if (!web3Auth) {
      uiConsole("web3auth not initialized yet");
      return "";
    }
    const signature = await provider.getSignature(message);
    uiConsole(signature);
    return signature;
  };

  const sendTransaction = async (amount: string, destination: string) => {
    if (!web3Auth) {
      uiConsole("web3auth not initialized yet");
      return "";
    }
    const receipt = await provider.sendTransaction(amount, destination);
    uiConsole(receipt);
    return receipt;
  };

  const getPrivateKey = async () => {
    if (!web3Auth) {
      uiConsole("web3auth not initialized yet");
      return "";
    }
    const privateKey = await provider.getPrivateKey();
    uiConsole("Private Key: ", privateKey);
    return privateKey;
  };

  const getChainId = async () => {
    if (!web3Auth) {
      uiConsole("web3auth not initialized yet");
      return "";
    }

    await provider.getChainId();
  };

  const deployContract = async (abi: any, bytecode: string, initValue: string): Promise<any> => {
    if (!web3Auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const receipt = await provider.deployContract(abi, bytecode, initValue);
    return receipt;
  };

  const readContract = async (contractAddress: string, contractABI: any): Promise<string> => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const message = await provider.readContract(contractAddress, contractABI);
    uiConsole(message);
  };

  const writeContract = async (contractAddress: string, contractABI: any, updatedValue: string): Promise<string> => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const receipt = await provider.writeContract(contractAddress, contractABI, updatedValue);
    uiConsole(receipt);

    if (receipt) {
      setTimeout(async () => {
        await readContract(contractAddress, contractABI);
      }, 2000);
    }
  };

  const parseToken = (token: any) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace("-", "+").replace("_", "/");
      return JSON.parse(window.atob(base64 || ""));
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const verifyServerSide = async (idTokenInFrontend: string) => {
    try {
      if (!provider) {
        uiConsole("provider not initialized yet");
        return;
      }
      const privKey: string = await web3Auth.provider?.request({
        method: "eth_private_key",
      });
      const pubkey = getPublicCompressed(Buffer.from(privKey, "hex")).toString("hex");

      const jwks = jose.createRemoteJWKSet(new URL("https://api.openlogin.com/jwks"));
      const jwtDecoded = await jose.jwtVerify(idTokenInFrontend, jwks, {
        algorithms: ["ES256"],
      });
      if ((jwtDecoded.payload as any).wallets[0].public_key === pubkey) {
        uiConsole(
          "Validation Success!",
          "Public Key from Provider: ",
          pubkey,
          "Public Key from decoded JWT: ",
          (jwtDecoded.payload as any).wallets[0].public_key,
          "Parsed Id Token: ",
          await parseToken(idTokenInFrontend)
        );
      } else {
        uiConsole("Failed");
      }
    } catch (e) {
      uiConsole(e);
    }
  };

  const switchChain = async (network: string) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }

    await web3Auth.addChain(chain[network]);
    await web3Auth.switchChain(chain[network]);
    setChainId(await provider.getChainId());
    setAddress(await provider.getAddress());
    setBalance(await provider.getBalance());

    uiConsole("Chain Switched");
  };

  const updateConnectedChain = (network: string) => {
    setConnectedChain(chain[network]);
  };

  const contextProvider = {
    web3Auth,
    provider,
    user,
    isLoading,
    address,
    balance,
    chainId,
    playgroundConsole,
    connectedChain,
    connected,
    logout,
    loginGoogle,
    loginGitHub,
    loginAuth0,
    loginFacebook,
    getUserInfo,
    getAddress,
    getBalance,
    getSignature,
    sendTransaction,
    getPrivateKey,
    getChainId,
    deployContract,
    readContract,
    writeContract,
    verifyServerSide,
    switchChain,
    updateConnectedChain,
  };
  return <Web3AuthContext.Provider value={contextProvider}>{children}</Web3AuthContext.Provider>;
};
