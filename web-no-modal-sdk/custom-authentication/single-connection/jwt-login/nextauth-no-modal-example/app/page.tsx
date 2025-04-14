import Image from "next/image";

import { auth } from "@/auth";
import SignIn from "@/components/auth/signin-button";
import Profile from "@/components/profile";

export default async function Home() {
  const session = await auth();

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
