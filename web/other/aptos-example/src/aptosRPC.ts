import type { IProvider } from "@web3auth/base";
import { Account, Aptos, AptosConfig, Network, Secp256k1PrivateKey } from "@aptos-labs/ts-sdk";

interface CoinStoreResource {
  type: string;
  data: {
    coin: {
      value: string;
    };
    deposit_events: any;
    frozen: boolean;
    withdraw_events: any;
  };
}

const APTOS_COIN: `${string}::${string}::${string}` = "0x1::aptos_coin::AptosCoin";

// Fetches the private key from the connected Web3Auth provider
export async function getPrivateKey(provider: IProvider): Promise<string> {
  try {
    const privateKey = await provider.request({ method: "private_key" });
    return privateKey as string;
  } catch (error) {
    throw new Error("Failed to retrieve private key");
  }
}

// Converts the private key into an Aptos account instance
export async function getAptosAccount(provider: IProvider): Promise<Account> {
  try {
    const privateKey = await getPrivateKey(provider);
    const privateKeyUint8Array = new Uint8Array(privateKey.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16)));
    const secp256k1PrivateKey = new Secp256k1PrivateKey(privateKeyUint8Array);
    return Account.fromPrivateKey({ privateKey: secp256k1PrivateKey });
  } catch (error) {
    throw new Error("Failed to create Aptos account");
  }
}

// Returns the Aptos account address of the connected user
export async function getAccounts(provider: IProvider): Promise<string> {
  try {
    const aptosAccount = await getAptosAccount(provider);
    return aptosAccount.accountAddress.toString();
  } catch (error) {
    throw new Error("Failed to get Aptos account address");
  }
}

// Requests an airdrop (funds) to the specified account address
export async function getAirdrop(provider: IProvider, accountAddress: string, amount: number): Promise<any> {
  try {
    console.log(`Requesting airdrop for account: ${accountAddress} with amount: ${amount}`);
    
    const config = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(config);
    
    // Step 1: Fund the account (Airdrop)
    const transaction = await aptos.fundAccount({
      accountAddress: accountAddress,
      amount: amount,
    });
    console.log(`Airdrop transaction hash: ${transaction.hash}`);

    // Step 2: Wait for the transaction result
    console.log("\n=== Waiting for result of airdrop transaction ===\n");
    const executedTransaction = await aptos.waitForTransaction({
      transactionHash: transaction.hash,
    });
    console.log("Airdrop executed:", executedTransaction);

    return executedTransaction;
  } catch (error) {
    console.error("Failed to airdrop funds. You may be rate limited or encountered another issue:", error);
    throw new Error("Airdrop failed.");
  }
}  

// Retrieves the balance of AptosCoin for the given account address
export async function getBalance(provider: IProvider, accountAddress: string): Promise<number> {
  try {
    console.log(`Fetching balance for account: ${accountAddress}`);
    
    const config = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(config);
    
    // Fetch account resources
    const resources = await aptos.account.getAccountResources({ accountAddress });

    // Find the CoinStore resource for AptosCoin
    const coinResource = resources.find((resource: any) =>
      resource.type.includes("0x1::coin::CoinStore")
    ) as CoinStoreResource;

    if (!coinResource || !coinResource.data) {
      throw new Error("Coin resource not found for this account");
    }

    // Parse the balance from the resource
    const balance = parseInt(coinResource.data.coin.value, 10);
    console.log(`Balance for account ${accountAddress}: ${balance}`);
    
    return balance;
  } catch (error) {
    console.error("Failed to get account balance:", error);
    throw new Error("Balance retrieval failed.");
  }
}

// Sends a transaction that transfers AptosCoin to the specified recipient
export async function sendTransaction(provider: IProvider): Promise<string> {
  try {
    const config = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(config);
    
    const aptosAccount = await getAptosAccount(provider);

    // Step 1: Build the transaction
    const transaction = await aptos.transaction.build.simple({
      sender: aptosAccount.accountAddress,
      data: {
        function: "0x1::coin::transfer",
        typeArguments: [APTOS_COIN],
        functionArguments: [aptosAccount.accountAddress, "717"], // Sending 717 APT
      },
    });

    // Step 2: Sign the transaction
    const senderAuthenticator = await aptos.transaction.sign({ signer: aptosAccount, transaction });

    // Step 3: Submit the transaction
    const committedTxn = await aptos.transaction.submit.simple({ transaction, senderAuthenticator });

    // Step 4: Wait for the transaction to be finalized
    await aptos.waitForTransaction({ transactionHash: committedTxn.hash });

    return committedTxn.hash;
  } catch (error) {
    console.error("Error in sendTransaction:", error);
    throw new Error("Failed to send transaction. Please check your balance and try again.");
  }
}
