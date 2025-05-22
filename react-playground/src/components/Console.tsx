import React from "react";

import { usePlayground } from "../services/playground";

const Console = () => {
  const { playgroundConsole } = usePlayground();

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-col mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 rounded-full bg-dark-accent-destructive"></div>
          <div className="h-3 w-3 rounded-full bg-dark-accent-warning"></div>
          <div className="h-3 w-3 rounded-full bg-dark-accent-quaternary"></div>
          <span className="ml-2 text-sm font-semibold text-dark-text-primary">Console Output</span>
        </div>
        <div className="text-xs text-dark-text-tertiary bg-dark-bg-primary px-2 py-1 rounded">
          web3auth-sdk
        </div>
      </div>
      
      <div className="bg-dark-bg-primary border border-dark-border-primary rounded-lg overflow-hidden shadow-card">
        {/* Terminal header */}
        <div className="bg-dark-border-primary bg-opacity-30 px-4 py-2 border-b border-dark-border-primary flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-dark-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span className="text-xs font-medium text-dark-text-tertiary">Terminal</span>
          </div>
          
          <div className="text-xs text-dark-text-tertiary">
            {new Date().toLocaleTimeString()}
          </div>
        </div>
        
        {/* Console content */}
        <div className="relative">
          <div className="font-mono p-4 overflow-x-auto max-h-96 custom-scrollbar text-sm">
            {playgroundConsole ? (
              <pre className="text-dark-text-secondary whitespace-pre-wrap break-all">
                <span className="text-dark-accent-primary">$ </span>
                {playgroundConsole.split('\n').map((line, index) => (
                  <div key={index} className="py-0.5">
                    {line.includes('Error') || line.includes('error') ? (
                      <span className="text-dark-accent-destructive">{line}</span>
                    ) : line.includes('Success') || line.includes('success') ? (
                      <span className="text-dark-accent-quaternary">{line}</span>
                    ) : line.includes('{') || line.includes('}') ? (
                      <span className="text-dark-accent-secondary">{line}</span>
                    ) : (
                      line
                    )}
                  </div>
                ))}
                <span className="animate-pulse">_</span>
              </pre>
            ) : (
              <div className="text-dark-text-tertiary italic">
                Console output will appear here...
              </div>
            )}
          </div>
          
          {/* Reflection effect */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-dark-bg-primary to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default Console;
