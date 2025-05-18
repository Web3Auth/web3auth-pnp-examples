import { CustomChainConfig, WALLET_CONNECTORS } from "@web3auth/modal";
import { useWeb3AuthConnect, useWeb3AuthUser } from "@web3auth/modal/react";
import React, { JSX, useEffect, useState } from "react";

import Dropdown from "../components/DropDown";
import { usePlayground } from "../services/playground";

interface AccountDetailsProps {
  children?: JSX.Element | JSX.Element[];
}

function AccountDetails({ children }: AccountDetailsProps) {
  const {
    address,
    balance,
    getUserInfo,
    updateConnectedChain,
    connectedChain,
    isLoading,
    chainList,
    changeChain,
    getChainId,
    chainListOptionSelected,
  } = usePlayground();
  const { isConnected, connectorName } = useWeb3AuthConnect();
  const { userInfo } = useWeb3AuthUser();
  const [addressToShow, setAddressToShow] = useState<string>(address || "");
  const [selectedChain, setSelectedChain] = useState<string>(Object.keys(chainList)[0]);
  const [chainDetails, setChainDetails] = useState<CustomChainConfig>(chainList[selectedChain]);

  useEffect(() => {
    setAddressToShow(address || "");
    setChainDetails(chainList[selectedChain]);
  }, [selectedChain, address]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(chainDetails);
  };

  return (
    <div className="w-full max-w-4xl px-4 py-8 md:py-12 lg:py-16 sm:px-6 lg:px-8 z-0">
      <div className="flex flex-col space-y-2 md:flex-row md:justify-between md:space-y-0">
        <h1 className="text-lg font-bold text-gray-900 dark:text-dark-text-primary">Your Account Details</h1>
        <Dropdown
          rounded
          options={[...Object.keys(chainList)]}
          selectedOption={chainListOptionSelected}
          displayOptions={Object.keys(chainList).map(function (k) {
            return chainList[k].displayName;
          })}
          onChange={async (option) => {
            if ((await getChainId()) !== chainList[option].chainId) {
              console.log(option);
              await changeChain(chainList[option]);
            }
            updateConnectedChain(option);
            setSelectedChain(option);
          }}
        />
      </div>
      <div className="md:p-8 p-4 mt-6 space-y-4 rounded-lg bg-white dark:bg-dark-bg-tertiary overflow-hidden w-full shadow-md">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0">
          {userInfo?.profileImage && <img className="object-fill w-24 h-24 rounded-lg" src={userInfo?.profileImage} referrerPolicy="no-referrer" />}
          {!userInfo?.profileImage && userInfo?.name && (
            <span className="flex justify-center items-center bg-purple-100 dark:bg-dark-bg-secondary font-bold w-24 h-24 rounded-lg text-[80px] text-purple-800 dark:text-dark-accent-primary">
              {userInfo?.name.charAt(0).toUpperCase()}
            </span>
          )}
          {!(userInfo?.profileImage || userInfo?.name) && (
            <span className="flex justify-center items-center bg-purple-100 dark:bg-dark-bg-secondary font-bold w-24 h-24 rounded-lg text-[80px] text-purple-800 dark:text-dark-accent-primary">
              {connectorName?.charAt(0).toUpperCase()}
            </span>
          )}
          <div className="space-y-2 md:space-y-0 md:pl-8 flex flex-col justify-between items-start">
            {isConnected && connectorName === WALLET_CONNECTORS.AUTH ? (
              <span className="text-xl md:text-2xl text-gray-800 dark:text-dark-text-primary font-bold w-fit">{userInfo?.name}</span>
            ) : connectorName ? (
              <span className="text-xl md:text-2xl text-gray-800 dark:text-dark-text-primary font-bold w-fit">{`Connected to ${connectorName[0].toUpperCase()}${connectorName.slice(1).replace(/-/g, " ")}`}</span>
            ) : (
              <span className="text-sm leading-4 font-semibold text-gray-700 dark:text-dark-text-secondary">Not Connected</span>
            )}
            <div
              className="w-full md:w-fit text-xs sm:text-sm bg-gray-100 dark:bg-dark-bg-secondary text-gray-600 dark:text-dark-text-secondary p-2 px-3 rounded-full z-0 flex flex-row justify-between space-x-2 md:space-x-4 items-center cursor-pointer truncate mt-2 md:mt-0"
              onClick={() => {
                if (address) {
                  navigator.clipboard.writeText(address);
                  setAddressToShow("Copied!");
                  setTimeout(() => {
                    setAddressToShow(address);
                  }, 1000);
                }
              }}
            >
              <span className="truncate">{addressToShow}</span>
              <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.45166 2.26636C2.45166 1.16179 3.51498 0.266357 4.82666 0.266357H11.16C12.4717 0.266357 13.535 1.16179 13.535 2.26636V9.59969C13.535 10.7043 12.4717 11.5997 11.16 11.5997C11.16 12.7043 10.0967 13.5997 8.78499 13.5997H2.45166C1.13998 13.5997 0.0766602 12.7043 0.0766602 11.5997V4.26636C0.0766602 3.16179 1.13998 2.26636 2.45166 2.26636ZM2.45166 3.59969C2.01443 3.59969 1.65999 3.89817 1.65999 4.26636V11.5997C1.65999 11.9679 2.01443 12.2664 2.45166 12.2664H8.78499C9.22222 12.2664 9.57666 11.9679 9.57666 11.5997H4.82666C3.51498 11.5997 2.45166 10.7043 2.45166 9.59969V3.59969ZM4.82666 1.59969C4.38943 1.59969 4.03499 1.89817 4.03499 2.26636V9.59969C4.03499 9.96788 4.38943 10.2664 4.82666 10.2664H11.16C11.5972 10.2664 11.9517 9.96788 11.9517 9.59969V2.26636C11.9517 1.89817 11.5972 1.59969 11.16 1.59969H4.82666Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
        </div>
        {isConnected && connectorName === WALLET_CONNECTORS.AUTH && (
          <button
            className="w-full mt-4 md:mt-0 p-4 text-sm border border-gray-200 dark:border-dark-border-primary rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-dark-bg-secondary text-gray-900 dark:text-dark-text-primary"
            onClick={getUserInfo}
          >
            Get User Info
          </button>
        )}
      </div>
      <div className="p-4 md:p-8 mt-6 mb-0 rounded-lg bg-white dark:bg-dark-bg-tertiary grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 shadow-md">
        <div className="p-2 flex flex-col space-y-2">
          <span className="text-sm text-gray-600 dark:text-dark-text-secondary">Wallet Balance</span>
          <div className="flex flex-row space-x-1 items-start">
            <span className="text-xl md:text-2xl font-bold break-all text-gray-900 dark:text-dark-text-primary">{balance}</span>
            <span className="pt-1 text-sm font-medium text-gray-600 dark:text-dark-text-secondary">{connectedChain?.ticker || ""}</span>
          </div>
        </div>
        <div className="p-2 flex flex-col space-y-2 items-end">
          <span className="text-sm text-gray-600 dark:text-dark-text-secondary">Chain ID</span>
          <span className="text-xl md:text-2xl font-bold text-gray-900 dark:text-dark-text-primary">{connectedChain?.chainId || ""}</span>
        </div>
      </div>

      {children}
    </div>
  );
}

export default AccountDetails;
