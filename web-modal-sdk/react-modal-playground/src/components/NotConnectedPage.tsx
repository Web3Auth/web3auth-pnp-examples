import React from "react";

import { usePlayground } from "../services/playground";
import ConnectWeb3AuthButton from "./ConnectWeb3AuthButton";
import SourceCode from "./SourceCode";

const NotConnectedPage = () => {
  const { isLoading } = usePlayground();

  return (
    <div className="w-full h-full flex flex-1 flex-col bg-gray-50 items-center justify-center overflow-scroll p-4">
      <div className="max-w-md mx-auto mt-4 text-center text-gray-500">
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="#0364ff"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <ConnectWeb3AuthButton />
        )}
      </div>
      <SourceCode />
    </div>
  );
};
export default NotConnectedPage;
