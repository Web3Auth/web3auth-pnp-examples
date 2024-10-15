import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import React, { useState } from "react";

import Console from "../components/Console";
import Form from "../components/Form";
import Header from "../components/Header";
import NotConnectedPage from "../components/NotConnectedPage";
import Sidebar from "../components/Sidebar";
import SourceCode from "../components/SourceCode";
import { usePlayground } from "../services/playground";

function ServerSideVerification() {
  const [loading, setLoading] = useState(false);
  const { isConnected } = useWeb3Auth();
  const [tokenId, setTokenId] = useState(null);
  const { verifyServerSide, getIdToken } = usePlayground();

  const LoaderButton = ({ ...props }) => (
    <button {...props}>
      {loading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {props.children}
    </button>
  );

  const formDetails = [
    {
      label: "JWT IdToken received from Web3Auth",
      input: tokenId as string,
      readOnly: true,
    },
  ];

  return (
    <main className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden z-0">
        {isConnected ? (
          <>
            <Sidebar />
            <div className=" w-full h-full flex flex-1 flex-col bg-gray-50 items-center justify-flex-start overflow-scroll">
              <h1 className="w-11/12 px-4 pt-16 pb-8 sm:px-6 lg:px-8 text-2xl font-bold text-center sm:text-3xl">Server Side Verification</h1>
              <Form heading="" formDetails={formDetails}>
                {tokenId ? (
                  <LoaderButton
                    className="w-full mt-10 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                    style={{ backgroundColor: "#0364ff" }}
                    onClick={async () => {
                      setLoading(true);
                      await verifyServerSide(tokenId);
                      setLoading(false);
                    }}
                  >
                    Verify
                  </LoaderButton>
                ) : (
                  <LoaderButton
                    className="w-full mt-10 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                    style={{ backgroundColor: "#0364ff" }}
                    onClick={async () => {
                      setLoading(true);
                      const idtoken = await getIdToken();
                      setTokenId(idtoken);
                      setLoading(false);
                    }}
                  >
                    Get ID Token
                  </LoaderButton>
                )}
              </Form>
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

export default ServerSideVerification;
