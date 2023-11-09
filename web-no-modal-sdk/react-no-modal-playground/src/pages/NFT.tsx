import { useState } from "react";

import Console from "../components/Console";
import Form from "../components/Form";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useWeb3Auth } from "../services/web3auth";

function NFT() {
  const [vaultId, setVaultId] = useState("1654615998");
  const [assetType, setAssetType] = useState("354");
  const [amount, setAmount] = useState("6000000000");

  const { provider } = useWeb3Auth();

  const formDetails = [
    {
      label: "ABI",
      input: vaultId as string,
      onChange: setVaultId,
    },
    {
      label: "Bytecode",
      input: assetType as string,
      onChange: setAssetType,
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
              >
                Show existing NFTs
              </button>
              <button
                className="w-full mt-10 mb-0 text-center justify-center items-center flex rounded-full px-6 py-3 text-white"
                style={{ backgroundColor: "#0364ff" }}
              >
                Mint new NFT
              </button>
            </Form>
            <Console />
          </div>
        ) : (
          <div className="w-full h-full flex flex-1 flex-col bg-gray-50 items-center justify-center overflow-scroll p-4">
            <h1 className="text-2xl font-bold text-center sm:text-3xl">Welcome to Web3Auth StarkEx Playground</h1>
            <p className="max-w-md mx-auto mt-4 text-center text-gray-500">Please connect to Web3Auth to get started.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default NFT;
