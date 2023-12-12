import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import UserProfile from "../components/UserProfile";
import { useWeb3Auth } from "../services/web3auth";

interface DrawerProps {
  isOpen: boolean;
  setOpen: any;
}
const Drawer = ({ isOpen, setOpen }: DrawerProps) => {
  const { logout } = useWeb3Auth();

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
      <div className="flex items-center px-4 py-2 mb-2 rounded-lg bg-gray-100 text-primary  cursor-pointer">
        <span className="text-sm font-bold">{label}</span>
      </div>
    );
  }

  if (isOpen) {
    return (
      <div className="fixed flex w-full h-full  lg:hidden">
        <div onClick={() => setOpen(false)} className="w-full h-full bg-black/[.4]"></div>
        <div className="flex right-0 flex-col justify-between h-screen p-5 bg-white w-80">
          <div className="py-2">
            <strong className="px-4 block p-1 text-xs font-medium text-gray-400 uppercase">MENU</strong>
            <nav className="flex flex-col mt-6">
              {location.pathname === "/" ? activePage("Main Page") : linktoGo("Main Page", goToHome)}
              {location.pathname === "/transaction" ? activePage("Transactions") : linktoGo("Transactions", goToTransaction)}
              {location.pathname === "/contract" ? activePage("Smart Contract Interactions") : linktoGo("Smart Contract Interactions", goToContract)}
              {location.pathname === "/server-side-verification"
                ? activePage("Server Side Verification")
                : linktoGo("Server Side Verification", goToServerSideVerification)}
              <div
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="flex items-center px-4 py-2 mb-2 text-gray-500 rounded-lg hover:bg-gray-100 hover:text-primary  cursor-pointer"
              >
                <span className="text-sm font-normal">Disconnect</span>
              </div>
            </nav>
          </div>
          <UserProfile />
        </div>
      </div>
    );
  }

  return null;
};

export default Drawer;
