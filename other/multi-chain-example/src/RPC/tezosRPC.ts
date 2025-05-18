/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-console */
import { InMemorySigner } from "@taquito/signer";
import { TezosToolkit } from "@taquito/taquito";
import { hex2buf } from "@taquito/utils";
// @ts-ignore
import * as tezosCrypto from "@tezos-core-tools/crypto-utils";
import type { IProvider } from "@web3auth/no-modal";

const tezos = new TezosToolkit("https://rpc.tzbeta.net/");

export async function getTezosKeyPair(provider: IProvider): Promise<any> {
  try {
    const privateKey = (await provider.request({ method: "private_key" })) as string;
    const keyPair = tezosCrypto.utils.seedToKeyPair(hex2buf(privateKey));
    return keyPair;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// List of available RPC Nodes -- https://tezostaquito.io/docs/rpc_nodes

export async function setProvider(provider: IProvider): Promise<void> {
  const keyPair = await getTezosKeyPair(provider);
  // use TacoInfra's RemoteSigner for better security on mainnet..
  tezos.setSignerProvider(await InMemorySigner.fromSecretKey(keyPair?.sk as string));
}

export async function getTezosAccount(provider: IProvider): Promise<any> {
  try {
    const keyPair = await getTezosKeyPair(provider);
    return keyPair?.pkh;
  } catch (error) {
    console.error("Error", error);
    return error;
  }
}

export async function getTezosBalance(provider: IProvider): Promise<any> {
  try {
    const keyPair = await getTezosKeyPair(provider);
    // keyPair.pkh is the account address.
    console.log("keyPair", keyPair.pkh);
    const balance = await tezos.tz.getBalance(keyPair?.pkh as string);
    console.log("balance", balance);
    return balance;
  } catch (error) {
    console.error("Error", error);
    return error;
  }
}

export async function signTezosMessage(provider: IProvider): Promise<any> {
  try {
    // Reference: https://tezostaquito.io/docs/signing
    const keyPair = await getTezosKeyPair(provider);
    const signer = new InMemorySigner(keyPair.sk);
    const message = "0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad";
    const signature = await signer.sign(message);
    return signature;
  } catch (error) {
    return error;
  }
}

export async function signAndSendTezosTransaction(provider: IProvider): Promise<any> {
  try {
    await setProvider(provider);
    // example address.
    const address = "tz1dHzQTA4PGBk2igZ3kBrDsVXuvHdN8kvTQ";

    // NOTE: The account which is used to send tezos shoudld have some balance for this transaction to go through.
    // If there is no balance, then we will receive an error - "implicit.empty_implicit_contract"
    // To solve this error, use a faucet account to send some tzs to the account.
    // Alternate solution:
    // 1. Use this link: https://tezostaquito.io/docs/making_transfers#transfer-from-an-implicit-tz1-address-to-a-tz1-address
    // 2. Modify the address and use the pkh key extracted from web3auth seed in the live code editor and click run code.
    // 3. Check balance in the account and have some fun.
    const op = await tezos.wallet
      .transfer({
        to: address,
        amount: 0.00005,
      })
      .send();

    const txRes = await op.confirmation();
    return txRes;
  } catch (error) {
    return error;
  }
}
