import { useWeb3AuthConnect } from "@web3auth/modal/react";
import React from "react";

import web3AuthLogoWhite from "../assets/web3authLogoWhite.svg";

const ConnectWeb3AuthButton = () => {
  const { connect, isConnected } = useWeb3AuthConnect();

  if (isConnected) {
    return null;
  }

  return (
    <button onClick={connect} className="relative group flex items-center justify-center space-x-2 px-6 py-3 rounded-lg overflow-hidden hover-lift">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-dark-accent-primary to-dark-accent-tertiary opacity-90 animate-gradient-bg transition-all duration-500 group-hover:opacity-100"></div>

      {/* Content */}
      <div className="relative z-10 flex items-center">
        <img src={web3AuthLogoWhite} className="h-6 w-auto mr-3" alt="Web3Auth Logo" />
        <span className="text-white font-semibold">Connect to Web3Auth</span>
      </div>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 -m-1 bg-gradient-to-r from-dark-accent-primary to-dark-accent-tertiary rounded-lg blur-sm opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
    </button>
  );
};

export default ConnectWeb3AuthButton;
