import React from "react";

import ConnectWeb3AuthButton from "./ConnectWeb3AuthButton";

const NotConnectedPage = () => {
  return (
    <div className=" w-full h-full flex flex-1 flex-col bg-gray-50 items-center justify-center overflow-scroll p-4">
      <div className="max-w-md mx-auto mt-4 text-center text-gray-500">
        <ConnectWeb3AuthButton />
      </div>
      <span className="block px-4 py-2 text-xs font-medium text-gray-400 uppercase">
        <a href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-modal-sdk/react-modal-playground" target="_blank">
          Source code
        </a>
      </span>
    </div>
  );
};
export default NotConnectedPage;
