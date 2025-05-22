/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import type { IProvider } from "@web3auth/modal";

/**
 * Makes a Polkadot API client
 */
export async function makeClient(): Promise<any> {
  // Rococo is a testnet in the Polkadot ecosystem
  console.log("Establishing connection to Rococo Relay Chain RPC...");
  const provider = new WsProvider("wss://rococo-rpc.polkadot.io"); // roccoco testnet relay chain
  // const provider = new WsProvider("wss://rpc.polkadot.io"); // Polkadot mainnet relay chain
  const api = await ApiPromise.create({ provider });
  const resp = await api.isReady;
  console.log("Polkadot RPC is ready", resp);
  return api;
}

/**
 * Gets the Polkadot key pair from the provider
 */
export async function getPolkadotKeyPair(provider: IProvider): Promise<any> {
  await cryptoWaitReady();
  const privateKey = (await provider.request({
    method: "private_key",
  })) as string;
  console.log("privateKey", `0x${privateKey}`);
  const keyring = new Keyring({ ss58Format: 42, type: "sr25519" });

  const keyPair = keyring.addFromUri(`0x${privateKey}`);
  console.log("keyPair", keyPair);
  return keyPair;
}

/**
 * Gets the account address
 */
export async function getAccounts(provider: IProvider): Promise<any> {
  const keyPair = await getPolkadotKeyPair(provider);
  return keyPair.address;
}

/**
 * Gets the account balance
 */
export async function getBalance(provider: IProvider): Promise<any> {
  const keyPair = await getPolkadotKeyPair(provider);
  const api = await makeClient();
  const data = await api.query.system.account(keyPair.address);
  console.log(data);
  return data.toHuman();
}

/**
 * Signs and sends a transaction
 */
export async function signAndSendTransaction(provider: IProvider): Promise<any> {
  try {
    const keyPair = await getPolkadotKeyPair(provider);
    const api = await makeClient();
    const txHash = await api.tx.balances.transferKeepAlive("5Gzhnn1MsDUjMi7S4cN41CfggEVzSyM58LkTYPFJY3wt7o3d", 12345).signAndSend(keyPair);
    console.log(txHash);
    return txHash.toHuman();
  } catch (err: any) {
    return err.toString();
  }
}
