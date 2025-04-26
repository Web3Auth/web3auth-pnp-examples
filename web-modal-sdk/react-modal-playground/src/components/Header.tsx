import { useWeb3AuthConnect } from "@web3auth/modal/react";
import Hamburger from "hamburger-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import web3authLogo from "../assets/web3authLogoBlue.svg";
import DisconnectWeb3AuthButton from "./DisconnectWeb3AuthButton";
import Drawer from "./Drawer";

const Header = () => {
  const { isConnected } = useWeb3AuthConnect();
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false);

  function goToHome() {
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-20 w-full">
      {/* Glass effect navbar */}
      <div className="backdrop-blur-md bg-dark-bg-tertiary bg-opacity-80 border-b border-dark-border-primary">
        <div className="px-4 py-3 mx-auto sm:py-3 sm:px-6 md:px-8 transition-all duration-200">
          <div className="flex items-center justify-between">
            {/* Left side - Logo and title */}
            <div
              className="flex items-center space-x-3 cursor-pointer transform transition-transform hover:scale-[1.02] duration-200"
              onClick={() => goToHome()}
            >
              <div className="relative p-1 rounded-xl overflow-hidden">
                <img src={web3authLogo} className="h-6 md:h-8 relative z-10" alt="Web3Auth Logo" />
              </div>

              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg md:text-xl font-semibold text-dark-text-primary">SDK Playground</h1>
              </div>
            </div>

            {/* Right side - Navigation */}
            <div className="flex items-center space-x-3">
              <div className="hidden lg:block">
                <DisconnectWeb3AuthButton />
              </div>

              {isConnected && (
                <div className="lg:hidden">
                  <button className="p-1 rounded-lg bg-dark-border-primary/50 hover:bg-dark-border-secondary transition-colors duration-200">
                    <Hamburger toggled={isOpen} toggle={setOpen} size={20} direction="right" color="#CDCDDF" rounded />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile drawer animation */}
      {isConnected && (
        <div
          className={`fixed inset-0 z-30 transform transition-all duration-300 ease-in-out ${
            isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
          }`}
        >
          <Drawer isOpen={isOpen} setOpen={setOpen} />
        </div>
      )}
    </header>
  );
};

export default Header;
