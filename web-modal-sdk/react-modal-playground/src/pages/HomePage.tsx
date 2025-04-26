import { useWeb3AuthConnect } from "@web3auth/modal/react";
import React from "react";

import AccountDetails from "../components/AccountDetails";
import Console from "../components/Console";
import Header from "../components/Header";
import NotConnectedPage from "../components/NotConnectedPage";
import Sidebar from "../components/Sidebar";

function HomePage() {
  const { isConnected } = useWeb3AuthConnect();

  return (
    <main className="flex flex-col h-screen z-0">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {isConnected ? (
          <>
            <Sidebar />
            <div className="w-full h-full flex flex-1 flex-col bg-gray-50 dark:bg-dark-bg-secondary items-center overflow-y-auto lg:pl-64">
              {/* Hero section */}
              <div className="relative w-full py-12 md:py-16 border-b border-gray-200 dark:border-dark-border-primary">
                <div className="absolute inset-0 bg-gray-100 dark:bg-dark-bg-tertiary opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 dark:from-dark-accent-primary/10 to-transparent"></div>
                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h1 className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary dark:from-dark-accent-primary to-secondary dark:to-dark-accent-tertiary animate-pulse-slow">
                    Web3Auth PnP Modal SDK Playground
                  </h1>
                  <p className="mt-4 text-gray-600 dark:text-dark-text-secondary max-w-2xl mx-auto">
                    Explore the power of Web3Auth's Plug and Play Modal SDK in this interactive playground. Connect your wallet, interact with
                    contracts, and more.
                  </p>
                </div>
              </div>
              {/* Content sections */}
              <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 flex flex-col items-center py-8">
                <AccountDetails />
                <Console />
              </div>
            </div>
          </>
        ) : (
          <NotConnectedPage />
        )}
      </div>
    </main>
  );
}

export default HomePage;
