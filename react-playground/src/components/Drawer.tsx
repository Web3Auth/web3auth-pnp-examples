import { WALLET_CONNECTORS } from "@web3auth/modal";
import { useWeb3AuthConnect, useWeb3AuthDisconnect } from "@web3auth/modal/react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import UserProfile from "../components/UserProfile";
import { usePlayground } from "../services/playground";

interface DrawerProps {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

const Drawer = ({ isOpen, setOpen }: DrawerProps) => {
  const { connectedChain } = usePlayground();
  const { isConnected, connectorName } = useWeb3AuthConnect();
  const { disconnect } = useWeb3AuthDisconnect();

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
    window.open(connectedChain?.blockExplorerUrl || "");
  }

  function goToSourceCode() {
    window.open("https://github.com/Web3Auth/web3auth-examples/tree/main/react-playground");
  }

  const location = useLocation();

  // Navigation items with icons
  const navItems = [
    {
      id: 1,
      label: "Dashboard",
      path: goToHome,
      isActive: location.pathname === "/",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      id: 2,
      label: "Transaction",
      path: goToTransaction,
      isActive: location.pathname === "/transaction",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
        </svg>
      ),
    },
    {
      id: 3,
      label: "Smart Contracts",
      path: goToContract,
      isActive: location.pathname === "/contract",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      id: 4,
      label: "Server Side Verification",
      path: goToServerSideVerification,
      isActive: location.pathname === "/server-side-verification",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
  ];

  // External links
  const externalLinks = [
    {
      id: 1,
      label: "Block Explorer",
      path: goToExplorer,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      ),
    },
    {
      id: 2,
      label: "Source Code",
      path: goToSourceCode,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
        </svg>
      ),
    },
  ];

  if (isOpen) {
    return (
      <div className="fixed inset-0 z-50 flex">
        {/* Backdrop with blur */}
        <div className="absolute inset-0 bg-dark-bg-primary bg-opacity-70 backdrop-blur-sm" onClick={() => setOpen(false)}></div>

        {/* Drawer panel */}
        <div className="relative w-full max-w-xs ml-auto h-full bg-dark-bg-secondary overflow-y-auto transform transition-all duration-300 ease-in-out">
          {/* Gradient line at top */}
          <div className="h-1 w-full bg-gradient-to-r from-dark-accent-primary to-dark-accent-tertiary"></div>

          <div className="flex flex-col h-full overflow-hidden">
            {/* Close button */}
            <div className="flex justify-end p-4">
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-full bg-dark-border-primary hover:bg-dark-border-secondary transition-colors"
              >
                <svg
                  className="w-5 h-5 text-dark-text-tertiary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-6">
                <h2 className="text-xs uppercase tracking-wider font-semibold text-dark-text-tertiary px-2">Navigation</h2>

                <div className="mt-3 space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        item.path();
                        setOpen(false);
                      }}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group
                        ${
                          item.isActive
                            ? "bg-dark-card-highlight text-dark-accent-primary"
                            : "text-dark-text-secondary hover:bg-dark-bg-tertiary hover:text-dark-text-primary"
                        }`}
                    >
                      <span
                        className={`mr-3 transition-colors duration-200 ${
                          item.isActive ? "text-dark-accent-primary" : "text-dark-text-tertiary group-hover:text-dark-text-secondary"
                        }`}
                      >
                        {item.icon}
                      </span>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {isConnected && connectorName === WALLET_CONNECTORS.AUTH && (
                <div className="mb-6">
                  <h2 className="text-xs uppercase tracking-wider font-semibold text-dark-text-tertiary px-2">External Links</h2>
                  <div className="mt-1 h-px bg-dark-border-primary mb-3"></div>
                  <div className="space-y-1">
                    {externalLinks.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          item.path();
                          setOpen(false);
                        }}
                        className="w-full flex items-center px-3 py-2 text-sm font-medium text-dark-text-secondary rounded-lg transition-all duration-200 hover:bg-dark-bg-tertiary hover:text-dark-text-primary group"
                      >
                        <span className="mr-3 text-dark-text-tertiary group-hover:text-dark-text-secondary transition-colors duration-200">
                          {item.icon}
                        </span>
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setOpen(false);
                  disconnect();
                }}
                className="w-full mt-4 flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-dark-card-highlight text-dark-accent-destructive hover:bg-dark-accent-destructive/10 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Disconnect
              </button>
            </div>

            {/* User profile */}
            <div className="border-t border-dark-border-primary">
              <UserProfile />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Drawer;
