import React from "react";
import App from "./App";
import { Web3AuthProvider, Web3AuthInnerContext } from "@web3auth/no-modal-react-hooks";
import { web3AuthContextConfig } from "./Web3AuthProvider";

const Home: React.FC = () => {
  return (
    <Web3AuthProvider config={web3AuthContextConfig}>
        <App />
    </Web3AuthProvider>
  );
};

export default Home;
