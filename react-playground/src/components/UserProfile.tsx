import { WALLET_CONNECTORS } from "@web3auth/modal";
import { useWeb3AuthConnect, useWeb3AuthUser } from "@web3auth/modal/react";
import React from "react";

interface UserProfileProps {
  className?: string;
}

function UserProfile({ className }: UserProfileProps) {
  const { userInfo } = useWeb3AuthUser();
  const { isConnected, connectorName } = useWeb3AuthConnect();

  return (
    <div className={`flex flex-row items-center space-x-2 ${className}`}>
      {userInfo?.profileImage && (
        <img className="object-fill w-8 h-8 rounded-full" src={userInfo?.profileImage} referrerPolicy="no-referrer" alt="Profile" />
      )}
      {!userInfo?.profileImage && userInfo?.name && (
        <span className="flex justify-center items-center bg-purple-100 dark:bg-github-hover font-bold w-8 h-8 rounded-full text-sm text-purple-800 dark:text-github-accent">
          {userInfo?.name.charAt(0).toUpperCase()}
        </span>
      )}
      {!(userInfo?.profileImage || userInfo?.name) && isConnected && (
        <span className="flex justify-center items-center bg-purple-100 dark:bg-github-hover font-bold w-8 h-8 rounded-full text-sm text-purple-800 dark:text-github-accent">
          {connectorName?.charAt(0).toUpperCase()}
        </span>
      )}
      {!isConnected && (
        <span className="flex justify-center items-center bg-purple-100 dark:bg-github-hover font-bold w-8 h-8 rounded-full text-sm text-purple-800 dark:text-github-accent">
          G
        </span>
      )}
      <div className="flex flex-col">
        {isConnected && connectorName === WALLET_CONNECTORS.AUTH ? (
          <span className="text-sm leading-4 font-semibold text-gray-700 dark:text-github-heading">{userInfo?.name || "Guest"}</span>
        ) : connectorName ? (
          <span className="text-sm leading-4 font-semibold text-gray-700 dark:text-github-heading">
            {`Connected to ${connectorName[0].toUpperCase() || ""}${connectorName?.slice(1)?.replace(/-/g, " ") || ""}`}
          </span>
        ) : (
          <span className="text-sm leading-4 font-semibold text-gray-700 dark:text-github-heading">Not Connected</span>
        )}
        <span className="text-xs leading-4 font-normal text-gray-500 dark:text-github-textSecondary">
          {isConnected ? userInfo?.email || "No Email" : "Not Connected"}
        </span>
      </div>
    </div>
  );
}

export default UserProfile;
