import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import Hamburger from "hamburger-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import wlfiLogo from "../assets/wlfiLogo.svg";
import DisconnectWeb3AuthButton from "./DisconnectWeb3AuthButton";
import Drawer from "./Drawer";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

const Header = () => {
  const { isConnected } = useWeb3Auth();
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function goToHome() {
    navigate("/");
  }

  return (
    <header className="sticky max-w-screen z-10">
      <div className="px-4 py-4 mx-auto sm:py-2 sm:px-6 md:px-8">
        <div className="justify-between items-center flex">
          <div className="flex justify-center py-3 flex-row" onClick={() => goToHome()}>
            <div className="flex flex-row justify-center items-center">
              <img
                src={wlfiLogo}
                style={{
                  height: "30px",
                  paddingRight: "15px",
                }}
              />
              <div className="text-lg sm:text-xl bg-[linear-gradient(134.84deg,#ffe898,#57370e_101.44%)] text-transparent bg-clip-text items-center">
                World Liberty Financial
              </div>
            </div>
          </div>
          <div className="flex-col flex-row mt-0 items-center lg:flex hidden">
            <DisconnectWeb3AuthButton />
          </div>
          {isConnected && (
            <div className="flex-col flex-row mt-0 items-center flex lg:hidden">
              <Hamburger toggled={isOpen} toggle={setOpen} size={25} direction="right" />
            </div>
          )}
        </div>
      </div>
      {isConnected && (
        <div className={`ease-in-out duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}>
          <Drawer isOpen={isOpen} setOpen={setOpen} />
        </div>
      )}
    </header>
  );
};

export default Header;
