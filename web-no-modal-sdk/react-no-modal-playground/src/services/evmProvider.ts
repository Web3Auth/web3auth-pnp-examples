import type { IProvider } from "@web3auth/base";
import { ContractFactory, ethers } from "ethers";

// import { json } from "stream/consumers";
import { IWalletProvider } from "./walletProvider";

const ethersWeb3Provider = (provider: IProvider | null, uiConsole: (...args: unknown[]) => void): IWalletProvider => {
  const getAddress = async (): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);

      const signer = await ethersProvider.getSigner();

      // Get user's Ethereum public address
      const address = await signer.getAddress();
      return address;
    } catch (error: any) {
      uiConsole(error);
      return error.toString();
    }
  };

  const getChainId = async (): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);

      return (await ethersProvider.getNetwork()).chainId.toString(16);
    } catch (error: any) {
      uiConsole(error);
      return error.toString();
    }
  };

  const getBalance = async (): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);

      const signer = await ethersProvider.getSigner();

      // Get user's Ethereum public address
      const address = signer.getAddress();

      // Get user's balance in ether
      const res = ethers.formatEther(
        await ethersProvider.getBalance(address) // Balance is in wei
      );
      const balance = (+res).toFixed(4);
      return balance;
    } catch (error: any) {
      uiConsole(error);
      return error.toString();
    }
  };

  const getSignature = async (message: string): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);

      const signer = await ethersProvider.getSigner();
      // Sign the message
      const signedMessage = await signer.signMessage(message);
      return signedMessage;
    } catch (error: any) {
      uiConsole(error);
      return error.toString();
    }
  };

  const sendTransaction = async (amount: string, destination: string): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);

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
    } catch (error: any) {
      uiConsole(error);
      return error as string;
    }
  };

  const getPrivateKey = async (): Promise<string> => {
    try {
      const privateKey = await provider?.request({
        method: "eth_private_key",
      });

      return privateKey as string;
    } catch (error: any) {
      uiConsole(error);
      return error as string;
    }
  };

  const deployContract = async (contractABI: string, contractByteCode: string, initValue: string): Promise<any> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);

      const signer = await ethersProvider.getSigner();
      const factory = new ContractFactory(JSON.parse(contractABI), contractByteCode, signer);

      // Deploy contract with "Hello World!" in the constructor and wait to finish
      const contract = await factory.deploy(initValue);
      uiConsole("Contract:", contract);
      uiConsole(`Deploying Contract at Target: ${contract.target}, waiting for confirmation...`);

      const receipt = await contract.waitForDeployment();
      uiConsole("Contract Deployed. Receipt:", receipt);

      return receipt;
    } catch (error: any) {
      uiConsole(error);
      return error as string;
    }
  };

  const readContract = async (contractAddress: string, contractABI: any) => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);
      const signer = await ethersProvider.getSigner();
      uiConsole(contractABI);

      const contract = new ethers.Contract(contractAddress, JSON.parse(contractABI), signer);

      // Read message from smart contract
      const message = await contract.message();
      return message;
    } catch (error: any) {
      uiConsole(error);
      return error as string;
    }
  };

  const writeContract = async (contractAddress: string, contractABI: any, updatedValue: string) => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider as any);

      const signer = await ethersProvider.getSigner();

      const contract = new ethers.Contract(contractAddress, JSON.parse(JSON.stringify(contractABI)), signer);

      // Send transaction to smart contract to update message
      const tx = await contract.update(updatedValue);

      // Wait for transaction to finish
      const receipt = await tx.wait();
      return receipt;
    } catch (error: any) {
      uiConsole(error);
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
