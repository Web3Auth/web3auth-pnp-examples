import React from "react";

import Console from "../components/Console";
import Dropdown from "../components/DropDown";
import Form from "../components/Form";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { chain } from "../config/chainConfig";
import { useWeb3Auth } from "../services/web3auth";

function HomePage() {
  const { provider, address, balance, chainId, switchChain, getBalance } = useWeb3Auth();

  const formDetails = [
    {
      label: "Address",
      input: address as string,
      readOnly: true,
    },
    {
      label: "Balance",
      input: `${balance} ETH`,
      readOnly: true,
    },
    {
      label: "Connected Chain Id",
      input: chainId,
      readOnly: true,
    },
  ];

  return (
    <main className="flex flex-col h-screen z-0">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        {provider ? (
          <div className=" w-full h-full flex flex-1 flex-col bg-gray-50 items-center justify-flex-start overflow-scroll">
            <h1 className="w-11/12 px-4 pt-16 sm:px-6 lg:px-8 text-2xl font-bold text-center sm:text-3xl">
              Welcome to Web3Auth Modal SDK Playground
            </h1>
            <div className="py-16 w-11/12 ">
              <Form heading="Your Account Details" formDetails={formDetails}>
                <Dropdown options={Object.keys(chain)} label="Switch Chain" onChange={(option) => switchChain(option)} />
                <button
                  className="w-full mt-10 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                  style={{ backgroundColor: "#0364ff" }}
                  onClick={() => getBalance()}
                >
                  Refresh Balance
                </button>
              </Form>
              <Console />
            </div>
          </div>
        ) : (
          <div className=" w-full h-full flex flex-1 flex-col bg-gray-50 items-center justify-center overflow-scroll p-4">
            <h1 className="text-2xl font-bold text-center sm:text-3xl">Welcome to Web3Auth Modal SDK Playground</h1>
            <p className="max-w-md mx-auto mt-4 text-center text-gray-500">Please connect to Web3Auth to get started.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default HomePage;
