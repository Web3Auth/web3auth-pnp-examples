import { ADAPTER_EVENTS, CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { OPENLOGIN_NETWORK, OpenloginUserInfo } from "@web3auth/openlogin-adapter";
import { getWalletProvider, IWalletProvider } from "./walletProvider";

export interface IWeb3AuthContext {
  web3Auth: Web3Auth | null;
  provider: IWalletProvider | null;
  isLoading: boolean;
  user: any;
  address: any;
  balance: any;
  chainDetails: any;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getUserInfo: () => Promise<any>;
  getAddress: () => Promise<string>;
  getBalance: () => Promise<string>;
  getSignature: (message: string) => Promise<string>;
  sendTransaction: (amount: string, destination: string) => Promise<string>;
  getPrivateKey: () => Promise<string>;
  getChainDetails: () => Promise<string>;
  deployContract: (abi: any, bytecode: string) => Promise<any>;
  readContract: () => Promise<any>;
  writeContract: () => Promise<any>;
}

export const Web3AuthContext = createContext<IWeb3AuthContext>({
  web3Auth: null,
  provider: null,
  isLoading: false,
  user: null,
  address: null,
  balance: null,
  chainDetails: null,
  login: async () => {},
  logout: async () => {},
  getUserInfo: async () => {},
  getAddress: async () => "",
  getBalance: async () => "",
  getSignature: async () => "",
  sendTransaction: async () => "",
  getPrivateKey: async () => "",
  getChainDetails: async () => "",
  deployContract: async () => {},
  readContract: async () => "",
  writeContract: async () => {},
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
  const [user, setUser] = useState<Partial<OpenloginUserInfo> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chainDetails, setChainDetails] = useState<string | null>(null);

  const uiConsole = (...args: unknown[]): void => {
    const el = document.querySelector("#console");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  };

  const setWalletProvider = useCallback(async (web3authProvider: SafeEventEmitterProvider | null) => {
    const walletProvider = getWalletProvider(web3authProvider, uiConsole);
    setProvider(walletProvider);
    setAddress(await walletProvider.getAddress());
    setBalance(await walletProvider.getBalance());
    setChainDetails(await walletProvider.getChainDetails());
  }, []);

  useEffect(() => {
    const subscribeAuthEvents = (web3auth: Web3Auth) => {
      // Can subscribe to all ADAPTER_EVENTS and LOGIN_MODAL_EVENTS
      web3auth.on(ADAPTER_EVENTS.CONNECTED, async (data: any) => {
        uiConsole("Yeah!, you are successfully logged in", data);
        setWalletProvider(web3auth.provider!);
        const userDetails = await web3auth.getUserInfo();
        setUser(userDetails);
      });

      web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
        uiConsole("connecting");
      });

      web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
        uiConsole("disconnected");
        setUser(null);
      });

      web3auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
        uiConsole("some error or user has cancelled login request", error);
      });
    };

    async function init() {
      try {
        setIsLoading(true);
        const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ";
        const web3AuthInstance = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x5",
            rpcTarget: "https://rpc.ankr.com/eth_goerli", // This is the public RPC we have added, please pass on your own endpoint while creating an app
          },
          web3AuthNetwork: OPENLOGIN_NETWORK.SAPPHIRE_MAINNET,
        });
        subscribeAuthEvents(web3AuthInstance);
        setWeb3Auth(web3AuthInstance);
        await web3AuthInstance.initModal();
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
    console.log("web3auth connecting");
    const localProvider = await web3Auth.connect();
    console.log("web3auth connected");
    setWalletProvider(localProvider);
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
  };

  const getUserInfo = async () => {
    if (!web3Auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const user = await web3Auth.getUserInfo();

    uiConsole(user);
  };

  const getAddress = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return "";
    }
    await provider.getAddress();
  };

  const getBalance = async () => {
    if (!web3Auth) {
      uiConsole("web3auth not initialized yet");
      return "";
    }
    await provider.getBalance();
  };

  const getSignature = async (message: string) => {
    if (!web3Auth) {
      uiConsole("web3auth not initialized yet");
      return "";
    }
    const signature = await provider.getSignature(message);
    uiConsole(signature);
  };

  const sendTransaction = async (amount: string, destination: string) => {
    if (!web3Auth) {
      uiConsole("web3auth not initialized yet");
      return "";
    }
    const receipt = await provider.sendTransaction(amount, destination);
    uiConsole(receipt);
  };

  const getPrivateKey = async () => {
    if (!web3Auth) {
      uiConsole("web3auth not initialized yet");
      return "";
    }
    await provider.getPrivateKey();
  };

  const getChainDetails = async () => {
    if (!web3Auth) {
      uiConsole("web3auth not initialized yet");
      return "";
    }
    await provider.getChainDetails();
  };

  const deployContract = async (abi: any, bytecode: string) => {
    if (!web3Auth) {
      uiConsole("web3auth not initialized yet");
      return null;
    }
    await provider.deployContract(abi, bytecode);
  };

  const readContract = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const message = await provider.readContract();
    uiConsole(message);
  };

  const writeContract = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const receipt = await provider.writeContract();
    uiConsole(receipt);

    if (receipt) {
      setTimeout(async () => {
        await readContract();
      }, 2000);
    }
  };

  const contextProvider = {
    web3Auth,
    provider,
    user,
    isLoading,
    address,
    balance,
    chainDetails,
    login,
    logout,
    getUserInfo,
    getAddress,
    getBalance,
    getSignature,
    sendTransaction,
    getPrivateKey,
    getChainDetails,
    deployContract,
    readContract,
    writeContract,
  };
  return <Web3AuthContext.Provider value={contextProvider}>{children}</Web3AuthContext.Provider>;
};
