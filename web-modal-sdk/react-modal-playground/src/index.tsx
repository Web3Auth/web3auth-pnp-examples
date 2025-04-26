import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

// Ensure dark mode is enabled
document.documentElement.classList.add('dark');

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
