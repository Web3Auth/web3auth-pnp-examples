import { SafeEventEmitterProvider, UserInfo } from "@web3auth/base";
import { initializeApp } from "firebase/app";

import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    UserCredential,
} from "firebase/auth";
import { firebaseConfig } from "./config";


const app = initializeApp(firebaseConfig);


export interface UserLoginInterface {
    provider: SafeEventEmitterProvider | null | undefined;
    init(): Promise<void>;
    loginWithFirebase(): Promise<UserCredential>;
    loginWithWeb3Auth(userCreds: UserCredential): Promise<SafeEventEmitterProvider | null>;
    getUserInfo(): Promise<Partial<UserInfo>>;
    logout(): Promise<void>
    
}


export abstract class UserLoginbase implements UserLoginInterface {
    abstract provider: SafeEventEmitterProvider | null | undefined;
    abstract init(): Promise<void>;
    abstract loginWithWeb3Auth(userCreds: UserCredential): Promise<SafeEventEmitterProvider | null>;
    abstract getUserInfo(): Promise<Partial<UserInfo>>;
    abstract logout(): Promise<void>
    protected userInfo: UserCredential | null = null;

    async loginWithFirebase(): Promise<UserCredential> {
        try {
          const auth = getAuth(app);
          const googleProvider = new GoogleAuthProvider();
          const res = await signInWithPopup(auth, googleProvider);
          this.userInfo = res
          return res;
        } catch (err) {
          console.error(err);
          throw err;
        }
    };
}