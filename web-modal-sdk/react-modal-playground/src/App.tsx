import "./App.css";

import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3AuthOptions } from "@web3auth/modal";
import { Web3AuthProvider } from "@web3auth/modal-react-hooks";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { chain } from "./config/chainConfig";
import Contract from "./pages/Contract";
import HomePage from "./pages/HomePage";
// import NFT from "./pages/NFT";
import ServerSideVerification from "./pages/ServerSideVerification";
import Transaction from "./pages/Transaction";

const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ";

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: {
    chainConfig: chain["Sepolia Testnet"],
  },
});

const web3AuthOptions: Web3AuthOptions = {
  clientId,
  web3AuthNetwork: "sapphire_mainnet",
  uiConfig: {
    mode: "dark", // light, dark or auto
    loginMethodsOrder: ["twitter"],
  },
  privateKeyProvider,
};
const openloginAdapter = new OpenloginAdapter({
  adapterSettings: {
    uxMode: "redirect",
  },
});

const web3AuthContextConfig = {
  web3AuthOptions,
  adapters: [openloginAdapter],
};

function App() {
  return (
    <div>
      <Web3AuthProvider config={web3AuthContextConfig}>
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route index element={<HomePage />} />
              <Route path="contract" element={<Contract />} />
              <Route path="transaction" element={<Transaction />} />
              <Route path="server-side-verification" element={<ServerSideVerification />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Web3AuthProvider>
    </div>
  );
}

export default App;
