import React, { useState } from "react";

import Console from "../components/Console";
import Form from "../components/Form";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Tabs from "../components/Tabs";
import { useWeb3Auth } from "../services/web3auth";

function Transaction() {
  const { provider, getSignature, sendTransaction } = useWeb3Auth();

  const [message, setMessage] = useState("Welcome to Web3Auth");
  const [address, setAddress] = useState("0xeaA8Af602b2eDE45922818AE5f9f7FdE50cFa1A8");
  const [amount, setAmount] = useState("0.01");

  const [tab, setTab] = useState("starkex");

  const formDetailsStarkEx = [
    {
      label: "message",
      input: message as string,
      onChange: setMessage,
    },
  ];

  const formDetailsL1 = [
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
      onClick: () => setTab("starkex"),
      active: tab === "starkex",
    },
    {
      tabName: "Send Transaction",
      onClick: () => setTab("l1"),
      active: tab === "l1",
    },
  ];

  return (
    <main className="flex flex-col h-screen z-0">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        {provider ? (
          <div className=" w-full h-full flex flex-1 flex-col bg-gray-50 items-center justify-flex-start overflow-scroll">
            <h1 className="w-11/12 px-4 pt-16 pb-8 sm:px-6 lg:px-8 text-2xl font-bold text-center sm:text-3xl">Withdrawal</h1>
            <Tabs tabData={TabData} />
            {tab === "starkex" ? (
              <Form formDetails={formDetailsStarkEx}>
                <button
                  className="w-full mt-10 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                  style={{ backgroundColor: "#0364ff" }}
                  onClick={() => getSignature(message)}
                >
                  Sign Message
                </button>
              </Form>
            ) : (
              <Form formDetails={formDetailsL1}>
                <button
                  className="w-full mt-10 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                  style={{ backgroundColor: "#0364ff" }}
                  onClick={() => sendTransaction(amount, address)}
                >
                  Send Transaction
                </button>
              </Form>
            )}
            <Console />
          </div>
        ) : (
          <div className=" w-full h-full flex flex-1 flex-col bg-gray-50 items-center justify-center overflow-scroll p-4">
            <h1 className="text-2xl font-bold text-center sm:text-3xl">Welcome to Web3Auth StarkEx Playground</h1>
            <p className="max-w-md mx-auto mt-4 text-center text-gray-500">Please connect to Web3Auth to get started.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default Transaction;
