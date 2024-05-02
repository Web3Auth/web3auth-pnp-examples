import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import React from "react";

import web3AuthLogoWhite from "../assets/web3authLogoWhite.svg";
import { usePlayground } from "../services/playground";

const ConnectWeb3AuthButton = () => {
  const { isConnected } = useWeb3Auth();
  const { login } = usePlayground();

  if (isConnected) {
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
