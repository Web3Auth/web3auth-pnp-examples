import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import React from "react";

import web3AuthLogoWhite from "../assets/web3authLogoWhite.svg";

const DisconnectWeb3AuthButton = () => {
  const { isConnected, logout } = useWeb3Auth();

  if (isConnected) {
    return (
      <div
        className="flex flex-row rounded-full px-6 py-3 text-white justify-center align-center cursor-pointer"
        style={{ backgroundColor: "#0364ff" }}
        onClick={() => logout()}
      >
        <img src={web3AuthLogoWhite} className="headerLogo" />
        Disconnect
      </div>
    );
  }
  return null;
};
export default DisconnectWeb3AuthButton;
