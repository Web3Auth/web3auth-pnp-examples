import { SafeEventEmitterProvider } from "@web3auth/base";
import Web3 from "web3";

export const sendEth = async (provider: SafeEventEmitterProvider, uiConsole: any) => {
  try {
    const web3 = new Web3(provider as any);
    const accounts = await web3.eth.getAccounts();
    console.log("pubKey", accounts);
    const txRes = await web3.eth.sendTransaction({
      from: accounts[0],
      to: accounts[0],
      value: web3.utils.toWei("0.01"),
    });
    uiConsole("txRes", txRes);
  } catch (error) {
    console.log("error", error);
    uiConsole("error", error);
  }
};

export const signEthMessage = async (provider: SafeEventEmitterProvider, uiConsole: any) => {
  try {
    const web3 = new Web3();
    web3.setProvider(provider as any);

    const fromAddress = (await web3.eth.getAccounts())[0];
    console.log("fromAddress", fromAddress);

    const message = "Some string";
    const hash = web3.utils.sha3(message) as string;
    const sig = await web3.eth.personal.sign(hash, fromAddress, "");
    uiConsole("personal sign", sig);
  } catch (error) {
    console.log("error", error);
    uiConsole("error", error);
  }
};

export const getAccounts = async (provider: SafeEventEmitterProvider, uiConsole: any): Promise<string[] | undefined> => {
  try {
    const web3 = new Web3(provider as any);
    const accounts = await web3.eth.getAccounts();
    uiConsole("accounts", accounts);
    return accounts;
  } catch (error) {
    console.error("Error", error);
    uiConsole("error", error);
  }
};
export const getChainId = async (provider: SafeEventEmitterProvider, uiConsole: any): Promise<string | undefined> => {
  try {
    const web3 = new Web3(provider as any);
    const chainId = await web3.eth.getChainId();
    uiConsole(chainId.toString());
    return chainId.toString();
  } catch (error) {
    console.error("Error", error);
    uiConsole("error", error);
  }
};
export const getBalance = async (provider: SafeEventEmitterProvider, uiConsole: any) => {
  try {
    const web3 = new Web3(provider as any);
    const accounts = await web3.eth.getAccounts();
    const balance = await web3.eth.getBalance(accounts[0]);
    uiConsole("balance", balance);
  } catch (error) {
    console.error("Error", error);
    uiConsole("error", error);
  }
};

export const signTransaction = async (provider: SafeEventEmitterProvider, uiConsole: any) => {
  try {
    const web3 = new Web3(provider as any);
    const accounts = await web3.eth.getAccounts();

    // only supported with social logins (openlogin adapter)
    const txRes = await web3.eth.signTransaction({
      from: accounts[0],
      to: accounts[0],
      value: web3.utils.toWei("0.01"),
    });
    uiConsole("txRes", txRes);
  } catch (error) {
    console.log("error", error);
    uiConsole("error", error);
  }
};
