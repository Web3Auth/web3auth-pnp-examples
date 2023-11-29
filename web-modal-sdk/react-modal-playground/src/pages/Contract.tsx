import React, { useState } from "react";

import Console from "../components/Console";
import Form from "../components/Form";
import Header from "../components/Header";
import NotConnectedPage from "../components/NotConnectedPage";
import Sidebar from "../components/Sidebar";
import { useWeb3Auth } from "../services/web3auth";

function Contract() {
  const [abi, setAbi] = useState("1654615998");
  const [bytecode, setBytecode] = useState("354");
  const [amount, setAmount] = useState("6000000000");

  const { provider, deployContract } = useWeb3Auth();

  const formDetails = [
    {
      label: "ABI",
      input: abi as string,
      onChange: setAbi,
    },
    {
      label: "Bytecode",
      input: bytecode as string,
      onChange: setBytecode,
    },
    {
      label: "amount",
      input: amount as string,
      onChange: setAmount,
    },
  ];

  return (
    <main className="flex flex-col h-screen z-0">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        {provider ? (
          <div className="w-full h-full flex flex-1 flex-col bg-gray-50 items-center justify-flex-start overflow-scroll">
            <h1 className="w-11/12 px-4 pt-16 pb-8 sm:px-6 lg:px-8 text-2xl font-bold text-center sm:text-3xl">Deposit</h1>
            <Form formDetails={formDetails}>
              <button
                className="w-full mt-10 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                style={{ backgroundColor: "#0364ff" }}
                onClick={() => deployContract(abi, bytecode)}
              >
                Deploy
              </button>
              <button
                className="w-full mt-10 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                style={{ backgroundColor: "#0364ff" }}
                // onClick={readContract}
              >
                Read
              </button>
              <button
                className="w-full mt-10 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                style={{ backgroundColor: "#0364ff" }}
                // onClick={writeContract}
              >
                Write
              </button>
            </Form>
            <Console />
          </div>
        ) : (
          <NotConnectedPage />
        )}
      </div>
    </main>
  );
}

export default Contract;
