import "./index.css";

import WebApp from "@twa-dev/sdk";
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

WebApp.ready();
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<App />);
