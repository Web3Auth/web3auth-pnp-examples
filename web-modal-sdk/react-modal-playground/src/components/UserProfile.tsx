import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import React from "react";

const UserProfile = () => {
  const { userInfo, isConnected } = useWeb3Auth();

  if (isConnected) {
    try {
      return (
        <div className="sticky px-4 inset-x-0 bottom-0 border-t border-gray-100">
          <div className="flex items-center justify-flex-start py-4 shrink-0 overflow-hidden">
            {userInfo.profileImage && (
              <img className="object-fill w-10 h-10 rounded-full" src={userInfo?.profileImage} referrerPolicy="no-referrer" />
            )}
            {!userInfo.profileImage && (
              <span className="flex justify-center items-center bg-purple_100 font-bold w-10 h-10 rounded-full text-[28px] text-purple_800">
                {userInfo?.name.charAt(0).toUpperCase()}
              </span>
            )}
            <div className="ml-1.5 overflow-hidden">
              <strong className="text-xs block font-medium truncate">{userInfo.name as string}</strong>
            </div>
          </div>
        </div>
      );
    } catch (e) {
      return null;
    }
  } else {
    return null;
  }
};

export default UserProfile;
