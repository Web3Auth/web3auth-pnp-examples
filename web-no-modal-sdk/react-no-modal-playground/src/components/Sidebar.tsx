import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import UserProfile from "../components/UserProfile";
import { useWeb3Auth } from "../services/web3auth";

const Sidebar = () => {
  const { connectedChain } = useWeb3Auth();

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
    window.open(connectedChain.blockExplorerUrl);
  }
  function goToFaucet() {
    if (connectedChain.chainId === "0xaa36a7") {
      window.open("https://www.infura.io/faucet/sepolia");
    } else if (connectedChain.chainId === "0x13881") {
      window.open("https://faucet.polygon.technology/");
    }
  }
  const location = useLocation();
  function linktoGo(label: string, path: any) {
    return (
      <div
        onClick={() => path()}
        className="flex items-center px-4 py-2 mb-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-primary  cursor-pointer"
      >
        <span className="text-sm font-normal">{label}</span>
      </div>
    );
  }
  function activePage(label: string) {
    return (
      <div className="flex items-center px-4 py-2 mb-2 rounded-lg bg-gray-100 text-primary cursor-pointer">
        <span className="text-sm font-bold">{label}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between h-screen bg-white border-r w-64 p-5 lg:flex hidden">
      <div className="py-3">
        <strong className="px-4 block p-1 text-xs font-medium text-gray-400 uppercase">MENU</strong>
        <nav className="flex flex-col mt-6">
          {location.pathname === "/" ? activePage("Main Page") : linktoGo("Main Page", goToHome)}
          {location.pathname === "/transaction" ? activePage("Signing/ Transaction") : linktoGo("Signing/ Transaction", goToTransaction)}
          {location.pathname === "/contract" ? activePage("Smart Contract Interactions") : linktoGo("Smart Contract Interactions", goToContract)}
          {location.pathname === "/server-side-verification"
            ? activePage("Server Side Verification")
            : linktoGo("Server Side Verification", goToServerSideVerification)}
          {linktoGo("Explorer Link", goToExplorer)}
          {connectedChain.chainId === "0xaa36a7" || connectedChain.chainId === "0x13881" ? linktoGo("Faucet Link", goToFaucet) : null}
        </nav>
      </div>
      <UserProfile />
    </div>
  );
};
export default Sidebar;
