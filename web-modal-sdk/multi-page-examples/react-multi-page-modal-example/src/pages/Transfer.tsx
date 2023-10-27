import { useState } from "react";

import Console from "../components/Console";
import Form from "../components/Form";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useWeb3Auth } from "../services/web3auth";

function Transfer() {
  const { provider } = useWeb3Auth();
  const [amount, setAmount] = useState("10");
  const [nonce, setNonce] = useState(`${Math.floor(Math.random() * 100)}`);
  const [senderPublicKey, setSenderPublicKey] = useState("asdf");
  const [senderVaultId, setSenderVaultId] = useState("1654615998");
  const [token, setToken] = useState("0x23a77118133287637ebdcd9e87a1613e443df789558867f5ba91faf7a024204");
  const [ethAddress, setEthAddress] = useState("0x987bade59c976DC2E341AB46fad1232dfba3444f");
  const [receiverPublicKey, setReceiverPublicKey] = useState("0x011869c13b32ab9b7ec84e2b31c1de58baaaa6bbb2443a33bbad8df739a6e958");
  const [receiverVaultId, setReceiverVaultId] = useState("1654615999");
  const [expirationTimestamp, setExpirationTimestamp] = useState("2147483647");
  const [signatureR, setSignatureR] = useState("5d14357fcf8f489218de0855267c6f64bc463135debf62680ad796e63cd6d3b");
  const [signatureS, setSignatureS] = useState("786ab874d91e3a5871134955fcb768914754760a0ada326af67f758f32819cf");

  const formDetails = [
    {
      label: "amount",
      input: amount as string,
      onChange: setAmount,
    },
    {
      label: "nonce",
      input: nonce as string,
      onChange: setNonce,
    },
    {
      label: "sender_public_key",
      input: senderPublicKey as string,
      readOnly: true,
    },
    {
      label: "sender_vault_id",
      input: senderVaultId as string,
      onChange: setSenderVaultId,
    },
    {
      label: "token",
      input: token as string,
      onChange: setToken,
    },
    {
      label: "eth_address",
      input: ethAddress as string,
      onChange: setEthAddress,
    },
    {
      label: "receiver_public_key",
      input: receiverPublicKey as string,
      onChange: setReceiverPublicKey,
    },
    {
      label: "receiver_vault_id",
      input: receiverVaultId as string,
      onChange: setReceiverVaultId,
    },
    {
      label: "expiration_timestamp",
      input: expirationTimestamp as string,
      onChange: setExpirationTimestamp,
    },
    {
      label: "Signature: R",
      input: signatureR as string,
      onChange: setSignatureR,
    },
    {
      label: "Signature: S",
      input: signatureS as string,
      onChange: setSignatureS,
    },
  ];

  return (
    <main className="flex flex-col h-screen z-0">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        {provider ? (
          <div className=" w-full h-full flex flex-1 flex-col bg-gray-50 items-center justify-flex-start overflow-scroll">
            <h1 className="w-11/12 px-4 pt-16 pb-8 sm:px-6 lg:px-8 text-2xl font-bold text-center sm:text-3xl">Transfer</h1>
            <Form heading="StarkEx Transfer" formDetails={formDetails}>
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

export default Transfer;
