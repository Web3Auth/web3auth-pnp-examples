// @ts-ignore
import { useState } from "react";

import Console from "../components/Console";
import Form from "../components/Form";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useWeb3Auth } from "../services/web3auth";

function Minting() {
  const [vaultId, setVaultId] = useState("1654615998");
  const [tokenId, setTokenId] = useState("0x23a77118133287637ebdcd9e87a1613e443df789558867f5ba91faf7a024204");
  const [amount, setAmount] = useState("100");

  const { provider } = useWeb3Auth();

  const formDetails = [
    {
      label: "vault_id",
      input: vaultId as string,
      onChange: setVaultId,
    },
    {
      label: "token_id",
      input: tokenId as string,
      onChange: setTokenId,
    },
    {
      label: "amount",
      input: amount as string,
      onChange: setAmount,
    },
  ];

  return (
    <main className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden z-0">
        <Sidebar />
        {provider ? (
          <div className=" w-full h-full flex flex-1 flex-col bg-gray-50 items-center justify-flex-start overflow-scroll">
            <h1 className="w-11/12 px-4 pt-16 pb-8 sm:px-6 lg:px-8 text-2xl font-bold text-center sm:text-3xl">Minting</h1>
            <Form heading="StarkEx Minting" formDetails={formDetails}>
              <button
                className="w-full mt-10 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                style={{ backgroundColor: "#0364ff" }}
              >
                Send with StarkEx Gateway
              </button>
            </Form>
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

export default Minting;
