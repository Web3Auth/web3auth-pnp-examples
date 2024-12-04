import "./index.css";

import ReactDOM from "react-dom/client";
import { Web3AuthProvider } from "@web3auth/modal-react-hooks";
import web3AuthContextConfig from "./web3authContext";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Web3AuthProvider config={web3AuthContextConfig}>
    <App />
  </Web3AuthProvider>
);
