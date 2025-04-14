import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Auth0Provider
    domain="web3auth.au.auth0.com"
    clientId="hUVVf4SEsZT7syOiL0gLU9hFEtm2gQ6O"
    authorizationParams={{
      redirect_uri: window.location.origin,
      connection: "github",
    }}
  >
    <App />
  </Auth0Provider>
);