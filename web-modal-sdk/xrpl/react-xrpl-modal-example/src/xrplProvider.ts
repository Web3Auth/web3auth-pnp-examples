import type { SafeEventEmitterProvider } from "@web3auth/base";
import { convertStringToHex, Payment, xrpToDrops } from "xrpl";

export default class XrplProvider {
  private provider: SafeEventEmitterProvider;

  constructor(provider: SafeEventEmitterProvider) {
    this.provider = provider;
  }

  async getAccounts(): Promise<any> {
    try {
      const accounts = await this.provider.request<string[]>({
        method: "ripple_getAccounts"
      })
      console.log("accounts", accounts);

      if (accounts) {
        const accInfo = await this.provider.request({
            "method": "account_info",
            "params": [
                {
                    "account": accounts[0],
                    "strict": true,
                    "ledger_index": "current",
                    "queue": true
                }
            ]
        })
        return accInfo;

      } else {
        console.log("No accounts found, please report this issue.")
      }
    } catch (error) {
      console.error("Error", error);
    }
  }

  async getBalance(): Promise<any> {
    try {
      const accounts = await this.provider.request<string[]>({
        method: "ripple_getAccounts"
      })

      if (accounts) {
        const accInfo = await this.provider.request({
            "method": "account_info",
            "params": [
                {
                    "account": accounts[0],
                    "strict": true,
                    "ledger_index": "current",
                    "queue": true
                }
            ]
        }) as Record<string, Record<string,string>>;
        return accInfo.account_data?.Balance;

      } else {
        console.log("No accounts found, please report this issue.")
      }
     
    } catch (error) {
      console.error("Error", error);
    }
  }

  async sendTransaction(): Promise<any> {
    try {
      const accounts = await this.provider.request<string[]>({
          method: "xrpl_getAccounts"
      })
  
      if (accounts && accounts.length > 0) {
          const tx: Payment =  {
              TransactionType: "Payment",
              Account: accounts[0] as string,
              Amount: xrpToDrops(2),
              Destination: "rJSsXjsLywTNevqLjeXV6L6AXQexnF2N5u",
          }
          const txSign = await this.provider.request({
              method: "xrpl_submitTransaction",
              params: {
                  transaction: tx
              }
            })
        return txSign;
      } else {
          console.log("failed to fetch accounts");
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async signMessage() {
    try {
      
      const msg = "Hello world";
      const hexMsg = convertStringToHex(msg);
      const txSign = await this.provider.request<{ signature: string }>({
          method: "xrpl_signMessage",
          params: {
              message: hexMsg
          }
          })
      return txSign;
     
    } catch (error) {
      console.log("error", error);
    }
  }
}