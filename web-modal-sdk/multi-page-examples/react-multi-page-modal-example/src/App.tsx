import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Deposit from "./pages/Deposit";
import Explorer from "./pages/Explorer";
import HomePage from "./pages/HomePage";
import Minting from "./pages/Minting";
import Settlement from "./pages/Settlement";
import Transfer from "./pages/Transfer";
import Withdrawal from "./pages/Withdrawal";
import { Web3AuthProvider } from "./services/web3auth";

function App() {
  return (
    <div>
      <Web3AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route index element={<HomePage />} />
              <Route path="deposit" element={<Deposit />} />
              <Route path="withdrawal" element={<Withdrawal />} />
              <Route path="minting" element={<Minting />} />
              <Route path="transfer" element={<Transfer />} />
              <Route path="settlement" element={<Settlement />} />
              <Route path="explorer" element={<Explorer />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Web3AuthProvider>
    </div>
  );
}

export default App;
