import { CHAIN_NAMESPACES, SafeEventEmitterProvider, UserInfo, WALLET_ADAPTERS } from "@web3auth/base";
import { chainConfig, verifier, clientId } from "./config";
import { UserLoginbase } from "./interface";

import { Web3AuthCore } from "@web3auth/core";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";

export default class LoginWithMfa extends UserLoginbase {
   private web3auth: Web3AuthCore | null = null;
   
   private _provider: SafeEventEmitterProvider | null = null;
   get provider() {
    return this._provider;
   }
    set provider(provider: SafeEventEmitterProvider | null) {
       this._provider = provider;
    }
    async init(): Promise<void> {
        try {
            // Initialising Web3Auth
            const web3auth = new Web3AuthCore({
              clientId,
              chainConfig: {
                chainNamespace: CHAIN_NAMESPACES.EIP155,
                ...chainConfig,
              },
            });
    
            const openloginAdapter = new OpenloginAdapter({
              loginSettings: {
                mfaLevel: "mandatory",
              },
              adapterSettings: {
                network: "testnet",
                uxMode: "redirect",
                loginConfig: {
                  jwt: {
                    name: "Web3Auth One Key Login Flow",
                    verifier,
                    typeOfLogin: "jwt",
                    clientId,
                  },
                },
              },
            });
            web3auth.configureAdapter(openloginAdapter);
           
            await web3auth.init();
            this.web3auth = web3auth;
            
            this.provider = web3auth.provider;
            if (!this.provider) {
                web3auth.once("connected", ()=> {
                    this.provider = web3auth.provider;
                  })
            }
            
          } catch (error) {
            console.error(error);
            throw error;
          }
   }

    async loginWithWeb3Auth(idToken: string): Promise<SafeEventEmitterProvider | null>    {

        if (!this.web3auth) {
          throw new Error("web3auth not initialized yet");
        }
        // if NO, login with web3auth
        const web3authProvider = await this.web3auth.connectTo(
          WALLET_ADAPTERS.OPENLOGIN,
          {
            loginProvider: "jwt",
            extraLoginOptions: {
              id_token: idToken,
              verifierIdField: "sub",
              domain: "http://localhost:3000",
            },
          }
        );
        return web3authProvider;
    }
    
    async getUserInfo(): Promise<Partial<UserInfo>> {
        if (!this.web3auth) {
            throw new Error("web3auth not initialized yet");
        }
        return this.web3auth.getUserInfo();
    }
    async logout(): Promise<void> {
        if (!this.web3auth) {
            throw new Error("web3auth not initialized yet");
        }
        return this.web3auth.logout();
    }
}