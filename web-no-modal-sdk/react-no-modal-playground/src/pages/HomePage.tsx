import React from "react";

import AccountDetails from "../components/AccountDetails";
import Console from "../components/Console";
import Header from "../components/Header";
import NotConnectedPage from "../components/NotConnectedPage";
import Sidebar from "../components/Sidebar";
import SourceCode from "../components/SourceCode";
import { useWeb3Auth } from "../services/web3auth";

function HomePage() {
  const { connected } = useWeb3Auth();

  return (
    <main className="flex flex-col h-screen z-0">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {connected ? (
          <>
            <Sidebar />
            <div className=" w-full h-full flex flex-1 flex-col bg-gray-50 items-center justify-flex-start overflow-scroll">
              <h1 className="w-11/12 px-4 pt-16 sm:px-6 lg:px-8 text-2xl font-bold text-center sm:text-3xl">
                Welcome to Web3Auth PnP No Modal SDK Playground
              </h1>
              <AccountDetails />
              <Console />
              <SourceCode />
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
