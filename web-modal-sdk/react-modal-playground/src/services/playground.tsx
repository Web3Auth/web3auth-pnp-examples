import { getPublicCompressed } from "@toruslabs/eccrypto";
import { CustomChainConfig, IProvider } from "@web3auth/base";
import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import * as jose from "jose";
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

import { chain } from "../config/chainConfig";
import { getWalletProvider, IWalletProvider } from "./walletProvider";

export interface IPlaygroundContext {
  walletProvider: IWalletProvider | null;
  isLoading: boolean;
  address: string;
  balance: string;
  chainList: { [key: string]: CustomChainConfig };
  chainListOptionSelected: string;
  chainId: string;
  playgroundConsole: string;
  connectedChain: CustomChainConfig;
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
  switchChain: (customChainConfig: CustomChainConfig) => Promise<void>;
  updateConnectedChain: (network: string | CustomChainConfig) => void;
}

export const PlaygroundContext = createContext<IPlaygroundContext>({
  walletProvider: null,
  isLoading: false,
  address: null,
  balance: null,
  chainId: null,
  playgroundConsole: "",
  chainList: chain,
  chainListOptionSelected: "ethereum",
  connectedChain: chain.ethereum,
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

interface IPlaygroundProps {
  children?: ReactNode;
}

export function usePlayground(): IPlaygroundContext {
  return useContext(PlaygroundContext);
}

export const Playground = ({ children }: IPlaygroundProps) => {
  const [walletProvider, setWalletProvider] = useState<IWalletProvider | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [chainList, setChainDetails] = useState(chain);
  const [chainListOptionSelected, setChainListOptionSelected] = useState("ethereum");
  const [chainId, setChainId] = useState<any>(null);
  const [playgroundConsole, setPlaygroundConsole] = useState<string>("");
  const [connectedChain, setConnectedChain] = useState<CustomChainConfig>(chain.ethereum);
  const uiConsole = (...args: unknown[]) => {
    setPlaygroundConsole(`${JSON.stringify(args || {}, null, 2)}\n\n\n\n${playgroundConsole}`);
    console.log(...args);
  };

  const { initModal, isConnected, connect, addAndSwitchChain, userInfo, provider, web3Auth } = useWeb3Auth();
  // const { showCheckout, showWalletConnectScanner, showWalletUI } = useWalletServicesPlugin();

  const setNewWalletProvider = useCallback(
    async (web3authProvider: IProvider) => {
      setWalletProvider(getWalletProvider(web3authProvider, uiConsole));
      setAddress(await walletProvider?.getAddress());
      setBalance(await walletProvider?.getBalance());
      setChainId(await walletProvider?.getChainId());
    },
    [chainId, address, balance]
  );

  useEffect(() => {
    async function init() {
      try {
        setIsLoading(true);
        if (isConnected) setNewWalletProvider(provider);
        else {
          try {
            await initModal();
            connect();
          } catch (error) {
            uiConsole(error);
          }
        }
      } catch (error) {
        uiConsole(error);
      } finally {
        setIsLoading(false);
      }
    }
    if (web3Auth) {
      init();
    }
  }, [web3Auth, isConnected, provider, connect, initModal, setNewWalletProvider]);

  const getUserInfo = async () => {
    if (!web3Auth) {
      uiConsole("web3Auth not initialized yet");
      return;
    }
    uiConsole(userInfo);
    return userInfo;
  };

  const getAddress = async () => {
    if (!web3Auth) {
      uiConsole("web3Auth not initialized yet");
      return "";
    }

    const updatedAddress = await walletProvider.getAddress();
    setAddress(updatedAddress);
    uiConsole(updatedAddress);
    return address;
  };

  const getBalance = async () => {
    if (!web3Auth) {
      uiConsole("web3Auth not initialized yet");
      return "";
    }
    const updatedBalance = await walletProvider.getBalance();

    setBalance(updatedBalance);
    uiConsole(updatedBalance);
    return balance;
  };

  const getSignature = async (message: string) => {
    if (!web3Auth) {
      uiConsole("web3Auth not initialized yet");
      return "";
    }
    const signature = await walletProvider.getSignature(message);
    uiConsole(signature);
    return signature;
  };

  const sendTransaction = async (amount: string, destination: string) => {
    if (!web3Auth) {
      uiConsole("web3Auth not initialized yet");
      return "";
    }
    const receipt = await walletProvider.sendTransaction(amount, destination);
    uiConsole(receipt);
    return receipt;
  };

  const getPrivateKey = async () => {
    if (!web3Auth) {
      uiConsole("web3Auth not initialized yet");
      return "";
    }
    const privateKey = await walletProvider.getPrivateKey();
    uiConsole("Private Key: ", privateKey);
    return privateKey;
  };

  const getChainId = async () => {
    if (!web3Auth) {
      uiConsole("web3Auth not initialized yet");
      return "";
    }

    await walletProvider.getChainId();
  };

  const deployContract = async (abi: any, bytecode: string, initValue: string): Promise<any> => {
    if (!web3Auth) {
      uiConsole("web3Auth not initialized yet");
      return;
    }
    const receipt = await walletProvider.deployContract(abi, bytecode, initValue);
    return receipt;
  };

  const readContract = async (contractAddress: string, contractABI: any): Promise<string> => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const message = await walletProvider.readContract(contractAddress, contractABI);
    uiConsole(message);
  };

  const writeContract = async (contractAddress: string, contractABI: any, updatedValue: string): Promise<string> => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const receipt = await walletProvider.writeContract(contractAddress, contractABI, updatedValue);
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
      const privKey: string = await provider?.request({
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

  const updateConnectedChain = (chainDetails: string | CustomChainConfig) => {
    if (typeof chainDetails === "string") {
      setConnectedChain(chainList[chainDetails]);
      setChainListOptionSelected(chainDetails);
      return;
    }
    if (typeof chainDetails === "object") {
      if (
        !(
          chainDetails.displayName in
          Object.keys(chainList).map(function (k) {
            return chainList[k].displayName;
          })
        )
      ) {
        setChainDetails({ ...chain, custom: chainDetails });
      }
      setConnectedChain(chainDetails);
      setChainListOptionSelected("custom");
      return;
    }
    uiConsole("No network or chainDetails provided");
  };

  const switchChain = async (chainConfig: CustomChainConfig) => {
    if (!web3Auth || !provider) {
      uiConsole("web3Auth or provider is not initialized yet");
      return;
    }

    try {
      setIsLoading(true);
      await addAndSwitchChain(chainConfig);
      setChainId(await walletProvider.getChainId());
      setAddress(await walletProvider.getAddress());
      setBalance(await walletProvider.getBalance());
      updateConnectedChain(chainConfig);
      setIsLoading(false);
      uiConsole("Chain switched successfully");
    } catch (error) {
      uiConsole("Failed to switch chain", error);
      setIsLoading(false);
    }
  };

  const contextProvider = {
    walletProvider,
    isLoading,
    address,
    balance,
    chainId,
    playgroundConsole,
    connectedChain,
    chainList,
    chainListOptionSelected,
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
  return <PlaygroundContext.Provider value={contextProvider}>{children}</PlaygroundContext.Provider>;
};
