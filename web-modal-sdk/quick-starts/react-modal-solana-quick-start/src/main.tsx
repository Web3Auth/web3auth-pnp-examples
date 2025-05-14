import "./index.css";

import ReactDOM from "react-dom/client";
// IMP START - Setup Web3Auth Provider
import { Web3AuthProvider } from "@web3auth/modal/react";
import web3AuthContextConfig from "./web3authContext";
// IMP END - Setup Web3Auth Provider

import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // IMP START - Setup Web3Auth Provider
  <Web3AuthProvider config={web3AuthContextConfig}>
        <App />
  </Web3AuthProvider>
  // IMP END - Setup Web3Auth Provider
);
