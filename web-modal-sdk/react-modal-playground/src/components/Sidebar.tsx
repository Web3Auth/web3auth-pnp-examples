import { WALLET_CONNECTORS } from "@web3auth/modal";
import { useWeb3AuthConnect } from "@web3auth/modal/react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { usePlayground } from "../services/playground";
import UserProfile from "./UserProfile";

const Sidebar = () => {
  const { connectedChain } = usePlayground();
  // const { showCheckout, showWalletConnectScanner, showWalletUI } = useWalletServicesPlugin();
  const { isConnected, connectorName } = useWeb3AuthConnect();

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
    window.open("https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-modal-sdk/react-modal-playground");
  }
  function goToFaucet() {
    if (connectedChain?.chainId === "0xaa36a7") {
      window.open("https://www.infura.io/faucet/sepolia");
    } else if (connectedChain?.chainId === "0x13882") {
      window.open("https://faucet.polygon.technology/");
    }
  }
  const location = useLocation();
  function linktoGo(label: string, path: any, id: number) {
    return (
      <div
        onClick={() => path()}
        key={id}
        className="flex items-center px-4 py-2 mb-2 text-gray-500 dark:text-github-textSecondary rounded-lg hover:bg-gray-100 dark:hover:bg-github-hover hover:text-primary dark:hover:text-github-accent cursor-pointer"
      >
        <span className="text-sm font-normal">{label}</span>
      </div>
    );
  }
  function activePage(label: string, id: number) {
    return (
      <div
        key={id}
        className="flex items-center px-4 py-2 mb-2 rounded-lg bg-gray-100 dark:bg-github-hover text-primary dark:text-github-accent cursor-pointer"
      >
        <span className="text-sm font-bold">{label}</span>
      </div>
    );
  }

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
      label: "Transactions",
      path: goToTransaction,
      isActive: location.pathname === "/transaction",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
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
      label: "Server Verification",
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
      id: 9,
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
      id: 10,
      label: "Source Code",
      path: goToSourceCode,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="hidden lg:flex fixed top-16 left-0 bottom-0 w-64 z-10 bg-white dark:bg-github-bg border-r border-gray-200 dark:border-github-border">
      <div className="flex flex-col h-full w-full">
        {/* Main navigation */}
        <div className="flex-1 py-6 px-3 overflow-y-auto">
          <div className="px-4 mb-6">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-github-textSecondary">Navigation</h2>
          </div>

          <nav className="space-y-1 px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={item.path}
                className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
                  item.isActive
                    ? "bg-gray-100 dark:bg-github-hover text-primary dark:text-github-accent"
                    : "text-gray-600 dark:text-github-textSecondary hover:bg-gray-50 dark:hover:bg-github-hover"
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
                {item.isActive && <span className="ml-auto h-2 w-2 rounded-full bg-primary dark:bg-github-accent"></span>}
              </button>
            ))}
          </nav>

          {isConnected && connectorName === WALLET_CONNECTORS.OPENLOGIN && (
            <>
              <div className="px-4 mt-10 mb-6">
                <h2 className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-github-textSecondary">External Links</h2>
                <div className="mt-3 h-px bg-gray-200 dark:bg-github-border"></div>
              </div>

              <nav className="space-y-1 px-3">
                {externalLinks.map((item) => (
                  <button
                    key={item.id}
                    onClick={item.path}
                    className="w-full flex items-center px-2 py-2 text-sm font-medium text-gray-600 dark:text-github-textSecondary rounded-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-github-hover hover:text-primary dark:hover:text-github-accent group"
                  >
                    <span className="mr-3 text-gray-400 dark:text-github-textSecondary group-hover:text-primary dark:group-hover:text-github-accent transition-colors duration-200">
                      {item.icon}
                    </span>
                    {item.label}
                    <span className="ml-auto">
                      <svg
                        className="w-4 h-4 text-gray-400 dark:text-github-textSecondary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </span>
                  </button>
                ))}
              </nav>
            </>
          )}
        </div>

        {/* User profile */}
        <div className="flex-shrink-0 border-t border-gray-200 dark:border-github-border p-4">
          <UserProfile className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
