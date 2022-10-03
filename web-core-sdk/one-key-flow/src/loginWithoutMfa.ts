import { subkey } from "@toruslabs/openlogin-subkey";
import { SafeEventEmitterProvider, UserInfo } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { nodeDetailManager, torus, chainConfig, verifier, clientId } from "./config";
import { UserLoginbase } from "./interface";
import {
    UserCredential,
  } from "firebase/auth";


export default class LoginWithoutMfa extends UserLoginbase {
   private _provider: SafeEventEmitterProvider | null = null;
   get provider() {
    return this._provider;
  }

  set provider(provider: SafeEventEmitterProvider | null) {
    this._provider = provider;
 }
   init(): Promise<void> {
      return Promise.resolve();
   }

   async loginWithWeb3Auth(userCreds: UserCredential): Promise<SafeEventEmitterProvider | null> {
        const idToken = await userCreds.user.getIdToken(true);
        const { torusNodeEndpoints, torusIndexes } = await nodeDetailManager.getNodeDetails({ verifier, verifierId: userCreds.user.uid });
        const keyDetails =  await torus.retrieveShares(torusNodeEndpoints, torusIndexes, verifier, { verifier_id:  userCreds.user.uid }, idToken, {});
        // sub key package is required to make sure user will get same key even after enabling mfa.
        const finalPrivKey = subkey(keyDetails.privKey.padStart(64, "0"), Buffer.from(clientId, "base64")).padStart(64, "0");
        const ethereumPrivateKeyProvider = new EthereumPrivateKeyProvider({
        config: {
            chainConfig,
        },
        });
        await ethereumPrivateKeyProvider.setupProvider(finalPrivKey);
        this._provider = ethereumPrivateKeyProvider.provider;
        return ethereumPrivateKeyProvider.provider;
    }
    getUserInfo(): Promise<Partial<UserInfo>>{
        if (!this.userInfo?.user) {
           return Promise.resolve({})
        }
       return Promise.resolve({
            email: this.userInfo.user.email as string,
            name: this.userInfo.user.displayName as string,
            picture: this.userInfo.user.photoURL as string,
       })
    }
    logout(): Promise<void> {
       window.location.reload();
       return Promise.resolve();
    }
}