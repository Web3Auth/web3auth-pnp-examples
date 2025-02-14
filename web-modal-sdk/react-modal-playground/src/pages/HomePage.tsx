import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import React from "react";

import AccountDetails from "../components/AccountDetails";
import Console from "../components/Console";
import Header from "../components/Header";
import NotConnectedPage from "../components/NotConnectedPage";
import Sidebar from "../components/Sidebar";
// import SourceCode from "../components/SourceCode";

function HomePage() {
  const { isConnected } = useWeb3Auth();

  return (
    <main className="flex flex-col h-screen z-0">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {isConnected ? (
          <>
            <Sidebar />
            <div className="w-full h-full flex flex-1 flex-col items-center justify-flex-start overflow-y-auto">
              <AccountDetails />
              <Console />
              {/*     <SourceCode /> */}
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
