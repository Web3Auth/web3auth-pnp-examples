"use client";

import { useEffect, useState } from "react";
import { Web3AuthNoModal, WALLET_CONNECTORS, AUTH_CONNECTION, WEB3AUTH_NETWORK } from "@web3auth/no-modal";
import { signIn, signOut, useSession } from "next-auth/react";
import RPC from "../lib/evm.ethers";
import Image from "next/image";

import SignIn from "@/components/auth/signin-button";
import Profile from "@/components/profile";

const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // get from https://dashboard.web3auth.io

// Initialising Web3Auth No Modal SDK
const web3auth = new Web3AuthNoModal({
  clientId, // Get your Client ID from Web3Auth Dashboard
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  authBuildEnv: "testing",
});

export default function Home() {
  const { data: session } = useSession();
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.init();
        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const connectWeb3Auth = async () => {
    if (!session?.idToken) return;
    
    try {
      setIsLoggingIn(true);
      await web3auth.connectTo(WALLET_CONNECTORS.AUTH, {
        authConnection: AUTH_CONNECTION.CUSTOM,
        authConnectionId: "nextauth-web3auth",
        extraLoginOptions: {
          id_token: session.idToken,
        },
      });
      setLoggedIn(true);
      setIsLoggingIn(false);
    } catch (error) {
      console.error(error);
      setIsLoggingIn(false);
    }
  };

  const getUserInfo = async () => {
    try {
      const userInfo = await web3auth.getUserInfo();
      uiConsole(userInfo);
    } catch (error) {
      console.error(error);
    }
  };

  const getAccounts = async () => {
    try {
      const rpc = new RPC(web3auth.provider);
      const accounts = await rpc.getAccounts();
      uiConsole(accounts);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    try {
      await signOut();
      web3auth.logout();
      setLoggedIn(false);
    } catch (error) {
      console.error(error);
    }
  };

  function uiConsole(...args: any[]): void {
    setConsoleOutput(JSON.stringify(args || {}, null, 2));
  }

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Auth.js demo in&nbsp;
          <code className="font-mono font-bold">Next.js</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://web3auth.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            By <Image src="https://web3auth.io/images/web3auth-logo---Dark.svg" alt="Web3Auth Logo" width={100} height={24} priority />
          </a>
        </div>
      </div>
      {!session ? <SignIn /> : <Profile session={session} />}

      <div className="mt-8">
        <a
          href="https://github.com/Web3Auth/web3auth-core-kit-examples/tree/main/single-factor-auth-web/sfa-web-nextauth-example"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 hover:text-blue-300 font-mono text-sm"
        >
          Source Code
        </a>
      </div>
    </main>
  );
}
