import type { IProvider } from "@web3auth/no-modal";
import { convertStringToHex, Payment, xrpToDrops } from "xrpl";

export async function getAccounts(provider: IProvider): Promise<any> {
  try {
    const accounts = await provider.request<never, string[]>({
      method: "xrpl_getAccounts",
    });
    console.log("accounts", accounts);
    if (accounts) {
      const accInfo = await provider.request({
        method: "account_info",
        params: [
          {
            account: accounts[0],
            strict: true,
            ledger_index: "current",
            queue: true,
          },
        ],
      });
      return accInfo;
    } else {
      return "No accounts found, please report this issue.";
    }
  } catch (error) {
    console.error("Error", error);
    return error;
  }
}

export async function getBalance(provider: IProvider): Promise<any> {
  try {
    const accounts = await provider.request<never, string[]>({
      method: "xrpl_getAccounts",
    });

    if (accounts) {
      const accInfo = (await provider.request({
        method: "account_info",
        params: [
          {
            account: accounts[0],
            strict: true,
            ledger_index: "current",
            queue: true,
          },
        ],
      })) as Record<string, Record<string, string>>;
      return accInfo.account_data?.Balance;
    } else {
      return "No accounts found, please report this issue.";
    }
  } catch (error) {
    console.error("Error", error);
    return error;
  }
}

export async function signMessage(provider: IProvider): Promise<any> {
  try {
    const msg = "Hello world";
    const hexMsg = convertStringToHex(msg);
    const txSign = await provider.request<object, never>({
      method: "xrpl_signMessage",
      params: {
        message: hexMsg,
      },
    });
    return txSign;
  } catch (error) {
    console.log("error", error);
    return error;
  }
}

export async function signAndSendTransaction(provider: IProvider): Promise<any> {
  try {
    const accounts = await provider.request<never, string[]>({
      method: "xrpl_getAccounts",
    });

    if (accounts && accounts.length > 0) {
      const tx: Payment = {
        TransactionType: "Payment",
        Account: accounts[0] as string,
        Amount: xrpToDrops(2),
        Destination: "raYzhtCitpdZivyVN2XBj2xvHKSmBjft2n",
      };
      const txSign = await provider.request({
        method: "xrpl_submitTransaction",
        params: {
          transaction: tx,
        },
      });
      return txSign;
    } else {
      return "failed to fetch accounts";
    }
  } catch (error) {
    console.log("error", error);
    return error;
  }
}
