import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useWeb3Auth } from "../services/web3auth";

const Sidebar = () => {
  const { provider, user, connectedChain } = useWeb3Auth();

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
    window.open(connectedChain.blockExplorer);
  }
  function goToFaucet() {
    if (connectedChain.chainId === "0x5") {
      window.open("https://goerlifaucet.com/");
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
  function userProfile() {
    if (provider) {
      try {
        return (
          <div className="sticky px-4 inset-x-0 bottom-0 border-t border-gray-100">
            <div className="flex items-center justify-flex-start py-4 shrink-0 overflow-hidden">
              {user.profileImage && <img className="object-fill w-10 h-10 rounded-full" src={user?.profileImage} referrerPolicy="no-referrer" />}
              {!user.profileImage && (
                <span className="flex justify-center items-center bg-purple_100 font-bold w-10 h-10 rounded-full text-[28px] text-purple_800">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              )}
              <div className="ml-1.5 overflow-hidden">
                <strong className="text-xs block font-medium truncate">{user.name as string}</strong>
              </div>
            </div>
          </div>
        );
      } catch (e) {
        return null;
      }
    } else {
      return null;
    }
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
          {connectedChain.chainId === "0x5" || connectedChain.chainId === "0x13881" ? linktoGo("Faucet Link", goToFaucet) : null}
        </nav>
      </div>
      {userProfile()}
    </div>
  );
};
export default Sidebar;
