import React from "react";

import web3AuthLogoWhite from "../assets/web3authLogoWhite.svg";
import { useWeb3Auth } from "../services/web3auth";

const ConnectWeb3AuthButton = () => {
  const { connected, login } = useWeb3Auth();

  if (connected) {
    return null;
  }
  return (
    <div
      className="flex flex-row rounded-full px-6 py-3 text-white justify-center align-center cursor-pointer"
      style={{ backgroundColor: "#0364ff" }}
      onClick={login}
    >
      <img src={web3AuthLogoWhite} className="headerLogo" />
      Connect to Web3Auth
    </div>
  );
};
export default ConnectWeb3AuthButton;
