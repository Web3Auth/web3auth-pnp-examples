import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import React, { useState } from "react";

import Console from "../components/Console";
import Form from "../components/Form";
import Header from "../components/Header";
import NotConnectedPage from "../components/NotConnectedPage";
import Sidebar from "../components/Sidebar";
import SourceCode from "../components/SourceCode";
import Tabs from "../components/Tabs";
import { usePlayground } from "../services/playground";

function Transaction() {
  const { getSignature, sendTransaction } = usePlayground();
  const { isConnected } = useWeb3Auth();

  const [message, setMessage] = useState("Welcome to Web3Auth");
  const [address, setAddress] = useState("0xeaA8Af602b2eDE45922818AE5f9f7FdE50cFa1A8");
  const [amount, setAmount] = useState("0.01");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("signMessage");

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

  const formDetailsSignMessage = [
    {
      label: "message",
      input: message as string,
      onChange: setMessage,
    },
  ];

  const formDetailsDestinationAddress = [
    {
      label: "destination address",
      input: address as string,
      onChange: setAddress,
    },
    {
      label: "amount",
      input: amount as string,
      onChange: setAmount,
    },
  ];

  const TabData = [
    {
      tabName: "Sign Message",
      onClick: () => setTab("signMessage"),
      active: tab === "signMessage",
    },
    {
      tabName: "Send Transaction",
      onClick: () => setTab("sendTransaction"),
      active: tab === "sendTransaction",
    },
  ];

  return (
    <main className="flex flex-col h-screen z-0">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        {isConnected ? (
          <div className=" w-full h-full flex flex-1 flex-col bg-gray-50 items-center justify-flex-start overflow-scroll">
            <h1 className="w-11/12 px-4 pt-16 pb-8 sm:px-6 lg:px-8 text-2xl font-bold text-center sm:text-3xl">Signing/ Transaction</h1>
            <Tabs tabData={TabData} />
            {tab === "signMessage" ? (
              <Form formDetails={formDetailsSignMessage}>
                <LoaderButton
                  className="w-full mt-10 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                  style={{ backgroundColor: "#0364ff" }}
                  onClick={async () => {
                    setLoading(true);
                    await getSignature(message);
                    setLoading(false);
                  }}
                >
                  Sign Message
                </LoaderButton>
              </Form>
            ) : (
              <Form formDetails={formDetailsDestinationAddress}>
                <LoaderButton
                  className="w-full mt-10 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                  style={{ backgroundColor: "#0364ff" }}
                  onClick={async () => {
                    setLoading(true);
                    await sendTransaction(amount, address);
                    setLoading(false);
                  }}
                >
                  Send Transaction
                </LoaderButton>
              </Form>
            )}
            <Console />
            <SourceCode />
          </div>
        ) : (
          <NotConnectedPage />
        )}
      </div>
    </main>
  );
}

export default Transaction;
