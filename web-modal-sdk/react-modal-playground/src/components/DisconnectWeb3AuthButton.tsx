import { useWeb3AuthConnect, useWeb3AuthDisconnect } from "@web3auth/modal/react";
import React from "react";

import web3AuthLogoWhite from "../assets/web3authLogoWhite.svg";

const DisconnectWeb3AuthButton = () => {
  const { isConnected } = useWeb3AuthConnect();
  const { disconnect } = useWeb3AuthDisconnect();

  if (isConnected) {
    return (
      <button
        onClick={() => disconnect()}
        className="relative group flex items-center justify-center space-x-2 px-5 py-2 rounded-lg overflow-hidden hover-lift border border-dark-border-primary"
      >
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-dark-bg-tertiary opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Content */}
        <div className="relative z-10 flex items-center">
          <img src={web3AuthLogoWhite} className="h-5 w-auto mr-2" alt="Web3Auth Logo" />
          <span className="text-dark-text-primary font-medium">Disconnect</span>
        </div>

        {/* Subtle glow effect on hover */}
        <div className="absolute right-0 top-0 h-8 w-8 bg-gradient-to-tl from-dark-accent-primary/20 to-transparent rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </button>
    );
  }
  return null;
};

export default DisconnectWeb3AuthButton;
