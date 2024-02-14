import { getPublicCompressed } from "@toruslabs/eccrypto";
import { ADAPTER_EVENTS, CHAIN_NAMESPACES, CustomChainConfig, IProvider, WALLET_ADAPTERS } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth } from "@web3auth/modal";
import { OPENLOGIN_NETWORK, OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";
import * as jose from "jose";
import * as React from "react";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

import { chain } from "../config/chainConfig";
import { getWalletProvider, IWalletProvider } from "./walletProvider";

export interface IWeb3AuthContext {
  web3Auth: Web3Auth | null;
  connected: boolean;
  provider: IWalletProvider | null;
  isLoading: boolean;
  user: any;
  address: string;
  balance: string;
  chainId: string;
  playgroundConsole: string;
  connectedChain: CustomChainConfig;
  login: () => Promise<void>;
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
  showWalletUi: () => Promise<any>;
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
  connectedChain: chain.sepolia,
  login: async () => {},
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
  showWalletUi: async () => {},
});

export function useWeb3Auth(): IWeb3AuthContext {
  return useContext(Web3AuthContext);
}

interface IWeb3AuthProps {
  children?: ReactNode;
}

export const Web3AuthProvider = ({ children }: IWeb3AuthProps) => {
  const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IWalletProvider | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [playgroundConsole, setPlaygroundConsole] = useState<string>("");
  const [chainId, setChainId] = useState<any>(null);
  const [connectedChain, setConnectedChain] = useState<CustomChainConfig>(chain["Sepolia Testnet"]);
  const [connected, setConnected] = useState<boolean>(false);
  const [walletServicesPlugin, setWalletServicesPlugin] = useState<WalletServicesPlugin | null>(null);

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
    const subscribeAuthEvents = (web3auth: Web3Auth) => {
      // Can subscribe to all ADAPTER_EVENTS and LOGIN_MODAL_EVENTS
      web3auth.on(ADAPTER_EVENTS.CONNECTED, (data: unknown) => {
        console.log("Yeah!, you are successfully logged in", data);
        setUser(data);
        setWalletProvider(web3auth.provider!);
      });

      web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
        console.log("connecting");
      });

      web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
        console.log("disconnected");
        setUser(null);
      });

      web3auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
        console.error("some error or user has cancelled login request", error);
      });
    };

    async function init() {
      try {
        setIsLoading(true);
        const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ";
        const currentChainConfig = chain.Ethereum;

        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: { chainConfig: currentChainConfig },
        });

        const web3AuthInstance = new Web3Auth({
          clientId,
          web3AuthNetwork: OPENLOGIN_NETWORK.SAPPHIRE_MAINNET,
          chainConfig: currentChainConfig,
          uiConfig: {
            mode: "light", // light, dark or auto
            loginMethodsOrder: ["twitter"],
            logoDark: "https://images.web3auth.io/web3auth-logo-w-light.svg",
            logoLight: "https://images.web3auth.io/web3auth-logo-w-light.svg",
          },
          privateKeyProvider,
        });

        const openloginAdapter = new OpenloginAdapter({
          // loginSettings: {
          //   mfaLevel: "optional",
          // },
          adapterSettings: {
            uxMode: "redirect", // "redirect" | "popup"
            // mfaSettings: {
            //   deviceShareFactor: {
            //     enable: true,
            //     priority: 1,
            //     mandatory: true,
            //   },
            //   backUpShareFactor: {
            //     enable: true,
            //     priority: 2,
            //     mandatory: false,
            //   },
            //   socialBackupFactor: {
            //     enable: true,
            //     priority: 3,
            //     mandatory: false,
            //   },
            //   passwordFactor: {
            //     enable: true,
            //     priority: 4,
            //     mandatory: false,
            //   },
            // },
          },
        });
        web3AuthInstance.configureAdapter(openloginAdapter);

        // Configure & Add Wallet Services Plugin
        if (currentChainConfig.chainNamespace !== CHAIN_NAMESPACES.SOLANA) {
          const walletServicesPluginInstance = new WalletServicesPlugin({
            wsEmbedOpts: {},
            walletInitOptions: { whiteLabel: { showWidgetButton: true } },
          });
          setWalletServicesPlugin(walletServicesPluginInstance);
          web3AuthInstance.addPlugin(walletServicesPluginInstance);
        }

        await web3AuthInstance.initModal({
          modalConfig: {
            [WALLET_ADAPTERS.OPENLOGIN]: {
              label: "openlogin",
              loginMethods: {
                twitter: {
                  name: "X",
                  mainOption: true,
                },
              },
            },
          },
        });
        if (web3AuthInstance.status === "connected") {
          setWalletProvider(web3AuthInstance.provider);
          setUser(await web3AuthInstance.getUserInfo());
          setConnected(true);
        }
        subscribeAuthEvents(web3AuthInstance);
        setWeb3Auth(web3AuthInstance);
      } catch (error) {
        uiConsole(error);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [setWalletProvider]);

  const login = async () => {
    if (!web3Auth) {
      uiConsole("web3auth not initialized yet");
      uiConsole("web3auth not initialized yet");
      return;
    }
    await web3Auth.connect();

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

  const showWalletUi = async () => {
    try {
      if (!walletServicesPlugin) {
        console.log("walletServicesPlugin not initialized yet");
        uiConsole("walletServicesPlugin not initialized yet");
        return;
      }
      uiConsole("open walletServicesPlugin");
      return await walletServicesPlugin.showWalletUi();
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
    login,
    logout,
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
    showWalletUi,
  };
  return <Web3AuthContext.Provider value={contextProvider}>{children}</Web3AuthContext.Provider>;
};
