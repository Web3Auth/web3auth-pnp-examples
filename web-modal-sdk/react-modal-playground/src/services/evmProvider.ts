import type { IProvider } from "@web3auth/base";
import { ContractFactory, ethers } from "ethers";

import { IWalletProvider } from "./walletProvider";

const ethersWeb3Provider = (provider: IProvider | null, uiConsole: (...args: unknown[]) => void): IWalletProvider => {
  const getAddress = async (): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);

      const signer = await ethersProvider.getSigner();

      // Get user's Ethereum public address
      const address = await signer.getAddress();
      return address;
    } catch (error) {
      uiConsole(error);
      return error.toString();
    }
  };

  const getChainId = async (): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);

      return (await ethersProvider.getNetwork()).chainId.toString(16);
    } catch (error) {
      uiConsole(error);
      return error.toString();
    }
  };

  const getBalance = async (): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);

      const signer = await ethersProvider.getSigner();

      // Get user's Ethereum public address
      const address = signer.getAddress();

      // Get user's balance in ether
      const res = ethers.formatEther(
        await ethersProvider.getBalance(address) // Balance is in wei
      );
      const balance = (+res).toFixed(4);
      return balance;
    } catch (error) {
      uiConsole(error);
      return error.toString();
    }
  };

  const getSignature = async (message: string): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);

      const signer = await ethersProvider.getSigner();
      // Sign the message
      const signedMessage = await signer.signMessage(message);
      return signedMessage;
    } catch (error) {
      uiConsole(error);
      return error.toString();
    }
  };

  const sendTransaction = async (amount: string, destination: string): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);

      const signer = await ethersProvider.getSigner();

      const amountBigInt = ethers.parseEther(amount);

      // Submit transaction to the blockchain
      const tx = await signer.sendTransaction({
        to: destination,
        value: amountBigInt,
        maxPriorityFeePerGas: "5000000000", // Max priority fee per gas
        maxFeePerGas: "6000000000000", // Max fee per gas
      });

      return `Transaction Hash: ${tx.hash}`;
    } catch (error) {
      return error as string;
    }
  };

  const getPrivateKey = async (): Promise<string> => {
    try {
      const privateKey = await provider.request({
        method: "eth_private_key",
      });

      return privateKey as string;
    } catch (error) {
      return error as string;
    }
  };

  const deployContract = async (contractABI: string, contractByteCode: string): Promise<any> => {
    try {
      console.log("here", contractABI, contractByteCode);
      const factory = new ContractFactory(JSON.parse(contractABI), contractByteCode);

      // Deploy contract with "Hello World!" in the constructor and wait to finish
      const contract = await factory.deploy("Hello World!");

      uiConsole(`Deployed Contract: ${contract}`);
      // Read message from smart contract
      return contract.target;
    } catch (error) {
      return error as string;
    }
  };

  const readContract = async (contractAddress: string, contractABI: any) => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);

      const signer = await ethersProvider.getSigner();

      // const contractABI = [
      //   { inputs: [{ internalType: "string", name: "initMessage", type: "string" }], stateMutability: "nonpayable", type: "constructor" },
      //   { inputs: [""], name: "message", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" },
      //   {
      //     inputs: [{ internalType: "string", name: "newMessage", type: "string" }],
      //     name: "update",
      //     outputs: [""],
      //     stateMutability: "nonpayable",
      //     type: "function",
      //   },
      // ];
      // const contractAddress = "0x04cA407965D60C2B39d892a1DFB1d1d9C30d0334";
      const contract = new ethers.Contract(contractAddress, JSON.parse(JSON.stringify(contractABI)), signer);

      // Read message from smart contract
      const message = await contract.message();
      return message;
    } catch (error) {
      return error as string;
    }
  };

  const writeContract = async (contractAddress: string, contractABI: any, updatedNumber: string) => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);

      const signer = await ethersProvider.getSigner();

      const contract = new ethers.Contract(contractAddress, JSON.parse(JSON.stringify(contractABI)), signer);
      // Generate random number between 1000 and 9000
      const number = parseInt(updatedNumber);

      // Send transaction to smart contract to update message
      const tx = await contract.update(`Web3Auth is awesome ${number} times!`);

      // Wait for transaction to finish
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      return error as string;
    }
  };

  return {
    getAddress,
    getBalance,
    getChainId,
    getSignature,
    sendTransaction,
    getPrivateKey,
    deployContract,
    readContract,
    writeContract,
  };
};

export default ethersWeb3Provider;
