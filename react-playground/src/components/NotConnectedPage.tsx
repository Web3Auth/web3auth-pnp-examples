import React from "react";

import { usePlayground } from "../services/playground";
import ConnectWeb3AuthButton from "./ConnectWeb3AuthButton";
import SourceCode from "./SourceCode";

const NotConnectedPage = () => {
  const { isLoading } = usePlayground();

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/3 w-1/3 h-1/3 rounded-full bg-primary/30 dark:bg-dark-accent-primary opacity-5 blur-3xl animate-float"></div>
        <div className="absolute top-1/2 right-1/4 w-1/4 h-1/4 rounded-full bg-secondary/30 dark:bg-dark-accent-secondary opacity-5 blur-3xl animate-pulse-slow"></div>
      </div>
      
      {/* Curved lines background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
        <svg className="w-full h-full opacity-10" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M0,400 C100,300 200,200 400,300 C600,400 800,100 1000,200 C1200,300 1400,400 1600,300" 
            stroke="url(#grad1)" 
            strokeWidth="3" 
            fill="none"
          />
          <path 
            d="M0,600 C200,500 400,700 600,600 C800,500 1000,700 1200,600" 
            stroke="url(#grad2)" 
            strokeWidth="3" 
            fill="none"
          />
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6D5AE6" />
              <stop offset="100%" stopColor="#4DBFFF" />
            </linearGradient>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF7D54" />
              <stop offset="100%" stopColor="#FFBD59" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center p-8 max-w-xl mx-auto">
        {/* Glowing card */}
        <div className="w-full bg-white/80 dark:bg-dark-bg-tertiary bg-opacity-50 backdrop-blur-md rounded-2xl overflow-hidden shadow-card">
          <div className="p-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary dark:from-dark-accent-primary to-secondary dark:to-dark-accent-tertiary text-center mb-4">
              Connect Your Wallet
            </h1>
            
            <p className="text-center text-gray-600 dark:text-dark-text-secondary mb-8">
              Connect to your Web3Auth wallet to explore the playground and interact with the SDK features.
            </p>
            
            <div className="flex justify-center mb-8">
              {isLoading ? (
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-2 border-t-primary dark:border-t-dark-accent-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                  <div className="absolute inset-1 rounded-full border-2 border-t-transparent border-r-secondary dark:border-r-dark-accent-secondary border-b-transparent border-l-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
                  <div className="absolute inset-2 rounded-full border-2 border-t-transparent border-r-transparent border-b-primary/70 dark:border-b-dark-accent-tertiary border-l-transparent animate-spin" style={{ animationDuration: '1.5s' }}></div>
                </div>
              ) : (
                <div className="transform transition-transform hover:scale-105">
                  <ConnectWeb3AuthButton />
                </div>
              )}
            </div>
          </div>
          
          <div className="py-6 px-8 bg-gray-100/70 dark:bg-dark-bg-primary bg-opacity-30 border-t border-gray-200 dark:border-dark-border-primary">
            <SourceCode />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotConnectedPage;
