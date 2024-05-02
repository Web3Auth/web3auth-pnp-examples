import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import UserProfile from "../components/UserProfile";
import { usePlayground } from "../services/playground";

const Sidebar = () => {
  const { connectedChain } = usePlayground();

  const navigate = useNavigate();
  function goToHome() {
    navigate("/");
  }
  function goToTransaction() {
    navigate("/transaction");
  }
  function goToContract() {
    navigate("/contract");
  }
  function goToServerSideVerification() {
    navigate("/server-side-verification");
  }
  function goToExplorer() {
    window.open(connectedChain?.blockExplorerUrl || "");
  }
  function goToSounceCode() {
    window.open("https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-modal-sdk/react-modal-playground");
  }
  function goToFaucet() {
    if (connectedChain?.chainId === "0xaa36a7") {
      window.open("https://www.infura.io/faucet/sepolia");
    } else if (connectedChain?.chainId === "0x13881") {
      window.open("https://faucet.polygon.technology/");
    }
  }
  const location = useLocation();
  function linktoGo(label: string, path: any, id: number) {
    return (
      <div
        onClick={() => path()}
        key={id}
        className="flex items-center px-4 py-2 mb-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-primary  cursor-pointer"
      >
        <span className="text-sm font-normal">{label}</span>
      </div>
    );
  }
  function activePage(label: string, id: number) {
    return (
      <div key={id} className="flex items-center px-4 py-2 mb-2 rounded-lg bg-gray-100 text-primary cursor-pointer">
        <span className="text-sm font-bold">{label}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between h-screen bg-white border-r w-64 p-5 lg:flex hidden">
      <div className="py-3">
        <strong className="px-4 block p-1 text-xs font-medium text-gray-400 uppercase">MENU</strong>
        <nav className="flex flex-col mt-6">
          {location.pathname === "/" ? activePage("Main Page", 1) : linktoGo("Main Page", goToHome, 1)}
          {location.pathname === "/transaction" ? activePage("Signing/ Transaction", 2) : linktoGo("Signing/ Transaction", goToTransaction, 2)}
          {location.pathname === "/contract"
            ? activePage("Smart Contract Interactions", 3)
            : linktoGo("Smart Contract Interactions", goToContract, 3)}
          {location.pathname === "/server-side-verification"
            ? activePage("Server Side Verification", 4)
            : linktoGo("Server Side Verification", goToServerSideVerification, 4)}
          {linktoGo("Explorer Link", goToExplorer, 5)}
          {connectedChain.chainId === "0x5" || connectedChain.chainId === "0x13881" ? linktoGo("Faucet Link", goToFaucet, 6) : null}
          {linktoGo("Source Code", goToSounceCode, 6)}
        </nav>
      </div>
      <UserProfile />
    </div>
  );
};
export default Sidebar;
