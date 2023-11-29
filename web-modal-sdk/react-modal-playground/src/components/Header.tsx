import Hamburger from "hamburger-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import web3authLogo from "../assets/web3authLogoBlue.svg";
import ConnectWeb3AuthButton from "./ConnectWeb3AuthButton";
import Drawer from "./Drawer";

const Header = () => {
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false);

  function goToHome() {
    navigate("/");
  }

  return (
    <header className="sticky max-w-screen z-10">
      <div className="px-4 py-4 mx-auto sm:py-2 sm:px-6 md:px-8 border-b">
        <div className="justify-between items-center flex">
          <div className="flex justify-center py-3 flex-col sm:flex-row" onClick={() => goToHome()}>
            <div className="flex flex-row justify-center">
              <img
                src={web3authLogo}
                style={{
                  height: "30px",
                  paddingRight: "15px",
                  borderRightWidth: "2px",
                }}
              />
              <div className="text-xl text-gray-900 px-3">SDK Playground</div>
            </div>
            <div className="flex flex-row justify-center items-center no-underline w-max overflow-hidden flex-wrap m-0 p-0 rounded-lg bg-purple_100 mt-5 sm:mt-0">
              <div className="flex flex-col justify-center text-center items-center w-max font-medium text-s leading-[150%] text-purple_800 flex-wrap m-0 px-3 py-0.5;">
                Plug and Play Modal
              </div>
            </div>
          </div>
          <div className="flex-col flex-row mt-0 items-center lg:flex hidden">
            <ConnectWeb3AuthButton />
          </div>
          <div className="flex-col flex-row mt-0 items-center flex lg:hidden">
            <Hamburger toggled={isOpen} toggle={setOpen} size={25} direction="right" />
          </div>
        </div>
      </div>
      <div className={`ease-in-out duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}>
        <Drawer isOpen={isOpen} setOpen={setOpen} />
      </div>
    </header>
  );
};

export default Header;
