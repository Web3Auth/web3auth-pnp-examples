import React from "react";

import { usePlayground } from "../services/playground";

const Console = () => {
  const { playgroundConsole } = usePlayground();

  return (
    <div className="py-16 w-11/12 px-4 py-16 sm:px-6 lg:px-8 flex-col">
      <p className="text-lg font-bold">Console</p>
      <div className="justify-center p-8 mt-6 mb-0 space-y-4 rounded-lg bg-white">
        <div className="md:flex items-flex-start p-1 bg-gray-200 overflow-scroll max-h-72">
          <pre className="font-mono overflow-scroll w-full">{playgroundConsole}</pre>
        </div>
      </div>
    </div>
  );
};

export default Console;
