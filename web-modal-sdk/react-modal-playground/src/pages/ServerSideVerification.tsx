import React, { useState } from "react";

import Console from "../components/Console";
import Form from "../components/Form";
import Header from "../components/Header";
import NotConnectedPage from "../components/NotConnectedPage";
import Sidebar from "../components/Sidebar";
import { useWeb3Auth } from "../services/web3auth";

function ServerSideVerification() {
  const [tokenId, setTokenId] = useState("0x23a77118133287637ebdcd9e87a1613e443df789558867f5ba91faf7a024204");

  const { provider, verifyServerSide } = useWeb3Auth();

  const formDetails = [
    {
      label: "token_id",
      input: tokenId as string,
      onChange: setTokenId,
    },
  ];

  return (
    <main className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden z-0">
        {provider ? (
          <>
            <Sidebar />
            <div className=" w-full h-full flex flex-1 flex-col bg-gray-50 items-center justify-flex-start overflow-scroll">
              <h1 className="w-11/12 px-4 pt-16 pb-8 sm:px-6 lg:px-8 text-2xl font-bold text-center sm:text-3xl">Server Side Verification</h1>
              <Form heading="Verification" formDetails={formDetails}>
                <button
                  className="w-full mt-10 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                  style={{ backgroundColor: "#0364ff" }}
                  onClick={verifyServerSide}
                >
                  Verify
                </button>
              </Form>
              <Console />
            </div>
          </>
        ) : (
          <NotConnectedPage />
        )}
      </div>
    </main>
  );
}

export default ServerSideVerification;
