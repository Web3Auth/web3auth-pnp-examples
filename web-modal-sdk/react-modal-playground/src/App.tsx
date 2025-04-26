// import "./App.css";

import { Web3AuthProvider } from "@web3auth/modal/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Contract from "./pages/Contract";
import HomePage from "./pages/HomePage";
// import NFT from "./pages/NFT";
import ServerSideVerification from "./pages/ServerSideVerification";
import Transaction from "./pages/Transaction";
import { Playground } from "./services/playground";
import web3AuthContextConfig from "./services/web3authContext";

function App() {
  return (
    <div className="relative min-h-screen bg-dark-bg-primary text-dark-text-primary">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Gradient blobs */}
        <div className="absolute top-0 right-0 w-2/3 h-2/3 rounded-full bg-dark-accent-primary opacity-5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 rounded-full bg-dark-accent-secondary opacity-5 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-1/4 h-1/4 rounded-full bg-dark-accent-tertiary opacity-5 blur-3xl"></div>

        {/* Grid pattern - subtle background texture */}
        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4zIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0wLTZoLTJWNmgydjR6bTAgMzBoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0eiIvPjwvZz48L2c+PC9zdmc+')]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Web3AuthProvider config={{ web3AuthOptions: web3AuthContextConfig }}>
          <Playground>
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
          </Playground>
        </Web3AuthProvider>
      </div>
    </div>
  );
}

export default App;
