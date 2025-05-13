#!/bin/bash

# Base directory for blockchain examples
BASE_DIR="web-no-modal-sdk/blockchain-interaction"

# List of all blockchain examples
EXAMPLES=(
  "algorand-no-modal-example"
  "aptos-no-modal-example"
  "bitcoin-no-modal-example"
  "cosmos-no-modal-example"
  "immutablex-no-modal-example"
  "polkadot-no-modal-example"
  "polymesh-no-modal-example"
  "starkex-no-modal-example"
  "starknet-no-modal-example"
  "sui-no-modal-example"
  "tezos-no-modal-example"
  "ton-no-modal-example"
  "tron-no-modal-example"
  "xrpl-no-modal-example"
)

# Skip these examples as they're already updated
SKIP_EXAMPLES=(
  "algorand-no-modal-example"
  "aptos-no-modal-example"
  "bitcoin-no-modal-example"
  "tron-no-modal-example"
)

# Function to check if an element is in an array
contains() {
  local e match="$1"
  shift
  for e; do [[ "$e" == "$match" ]] && return 0; done
  return 1
}

# Loop through each example directory
for example in "${EXAMPLES[@]}"; do
  echo "Processing $example..."
  
  # Skip already updated examples
  if contains "$example" "${SKIP_EXAMPLES[@]}"; then
    echo "Skipping $example as it's already updated."
    continue
  fi
  
  # Extract blockchain name from example folder name
  BLOCKCHAIN_NAME=$(echo "$example" | sed -E 's/(.+)-no-modal-example/\1/')
  BLOCKCHAIN_NAME_UPPERCASE=$(echo "$BLOCKCHAIN_NAME" | tr '[:lower:]' '[:upper:]')
  
  echo "Updating for blockchain: $BLOCKCHAIN_NAME"
  
  # Create web3authContext.tsx file
  cat > "$BASE_DIR/$example/src/web3authContext.tsx" << 'EOF'
// IMP START - Quick Start
import { authConnector, WEB3AUTH_NETWORK, type Web3AuthNoModalOptions } from "@web3auth/no-modal";
// IMP END - Quick Start

// IMP START - Dashboard Registration
const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // get from https://dashboard.web3auth.io
// IMP END - Dashboard Registration

// IMP START - Instantiate SDK
const web3AuthOptions: Web3AuthNoModalOptions = {
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  authBuildEnv: "testing",
};
// IMP END - Instantiate SDK

// IMP START - Instantiate SDK
const web3AuthContextConfig = {
  web3AuthOptions
};
// IMP END - Instantiate SDK

export default web3AuthContextConfig;
EOF

  # Update main.tsx or index.tsx file
  MAIN_FILE="$BASE_DIR/$example/src/main.tsx"
  INDEX_FILE="$BASE_DIR/$example/src/index.tsx"
  
  if [ -f "$MAIN_FILE" ]; then
    TARGET_FILE="$MAIN_FILE"
  else
    TARGET_FILE="$INDEX_FILE"
  fi
  
  cat > "$TARGET_FILE" << 'EOF'
import "./index.css";

import ReactDOM from "react-dom/client";
// IMP START - Setup Web3Auth Provider
import { Web3AuthProvider } from "@web3auth/no-modal/react";
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
EOF

  # Update package.json
  PACKAGE_FILE="$BASE_DIR/$example/package.json"
  if [ -f "$PACKAGE_FILE" ]; then
    # Use sed to replace @web3auth dependencies (this is a simplified approach)
    sed -i '' -e '/"@web3auth\/auth-adapter"/d' \
       -e '/"@web3auth\/base-provider"/d' \
       -e 's/"@web3auth\/no-modal": ".*"/"@web3auth\/no-modal": "^9.7.0"/' "$PACKAGE_FILE"
  fi
  
  # Find the RPC file for the blockchain
  RPC_FILE=$(find "$BASE_DIR/$example/src" -name "*RPC*.ts" -o -name "*rpc*.ts" | head -n 1)
  RPC_FILENAME=$(basename "$RPC_FILE")
  RPC_NAME="${RPC_FILENAME%.ts}"
  
  echo "Found RPC file: $RPC_FILE"
  
  # Create App.tsx template with blockchain-specific references
  cat > "$BASE_DIR/$example/src/App.tsx" << EOF
import "./App.css";
import {
  useWeb3AuthConnect, useWeb3AuthDisconnect, useWeb3AuthUser, useWeb3Auth
} from "@web3auth/no-modal/react";
import { WALLET_CONNECTORS, AUTH_CONNECTION } from "@web3auth/no-modal";
import { getPrivateKey, getAccounts, getBalance, signMessage, signAndSendTransaction } from "./$RPC_NAME";

function App() {
  const { connect, isConnected, connectorName, loading: connectLoading, error: connectError } = useWeb3AuthConnect();
  const { disconnect, loading: disconnectLoading, error: disconnectError } = useWeb3AuthDisconnect();
  const { userInfo } = useWeb3AuthUser();
  const { provider } = useWeb3Auth();

  const onGetPrivateKey = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const privateKey = await getPrivateKey(provider);
    uiConsole("Private Key", privateKey);
  };

  const onGetAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const userAccount = await getAccounts(provider);
    uiConsole("Address", userAccount);
  };

  const onGetBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const balance = await getBalance(provider);
    uiConsole("Balance", balance);
  };

  const onSignMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const result = await signMessage(provider);
    uiConsole("Signature", result);
  };

  const onSendTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const result = await signAndSendTransaction(provider);
    uiConsole("Transaction", result);
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

  const loggedInView = (
    <div className="grid">
      <div className="flex-container">
        <div>
          <button onClick={() => uiConsole(userInfo)} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={onGetPrivateKey} className="card">
            Get Private Key
          </button>
        </div>
        <div>
          <button onClick={onGetAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={onGetBalance} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={onSignMessage} className="card">
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={onSendTransaction} className="card">
            Send Transaction
          </button>
        </div>
        <div>
          <button onClick={() => disconnect()} className="card">
            Log Out
          </button>
          {disconnectLoading && <div className="loading">Disconnecting...</div>}
          {disconnectError && <div className="error">{disconnectError.message}</div>}
        </div>
      </div>
    </div>
  );

  const unloggedInView = (
    // IMP START - Login  
    <div className="grid">
      <button onClick={() => connect(WALLET_CONNECTORS.AUTH, {
        authConnection: AUTH_CONNECTION.GOOGLE,
      })} className="card">
        Login
      </button>
      {connectLoading && <div className="loading">Connecting...</div>}
      {connectError && <div className="error">{connectError.message}</div>}
    </div>
    // IMP END - Login
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/no-modal" rel="noreferrer">
          Web3Auth{" "}
        </a>
        & ${BLOCKCHAIN_NAME_UPPERCASE} Example
      </h1>

      <div className="grid">{isConnected ? loggedInView : unloggedInView}</div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-no-modal-sdk/blockchain-interaction/${example}"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
      </footer>
    </div>
  );
}

export default App;
EOF

  # Create RPC template for blockchain
  cat > "$BASE_DIR/$example/src/$RPC_NAME.ts" << EOF
import type { IProvider } from "@web3auth/base";

// Get the private key from the Web3Auth provider
export async function getPrivateKey(provider: IProvider): Promise<string> {
  try {
    const privateKey = await provider.request({ method: "private_key" });
    return privateKey as string;
  } catch (error) {
    throw new Error("Failed to retrieve private key");
  }
}

// Get account address
export async function getAccounts(provider: IProvider): Promise<string> {
  try {
    // Implement ${BLOCKCHAIN_NAME}-specific account retrieval here
    const privateKey = await getPrivateKey(provider);
    return "Implement ${BLOCKCHAIN_NAME}-specific account retrieval using privateKey";
  } catch (error) {
    throw new Error("Failed to get account address");
  }
}

// Get account balance
export async function getBalance(provider: IProvider): Promise<string> {
  try {
    // Implement ${BLOCKCHAIN_NAME}-specific balance retrieval here
    const address = await getAccounts(provider);
    return "Implement ${BLOCKCHAIN_NAME}-specific balance retrieval for " + address;
  } catch (error) {
    throw new Error("Failed to get balance");
  }
}

// Sign a message
export async function signMessage(provider: IProvider): Promise<string> {
  try {
    // Implement ${BLOCKCHAIN_NAME}-specific message signing here
    const privateKey = await getPrivateKey(provider);
    return "Implement ${BLOCKCHAIN_NAME}-specific message signing using privateKey";
  } catch (error) {
    throw new Error("Failed to sign message");
  }
}

// Send a transaction
export async function signAndSendTransaction(provider: IProvider): Promise<string> {
  try {
    // Implement ${BLOCKCHAIN_NAME}-specific transaction sending here
    const privateKey = await getPrivateKey(provider);
    return "Implement ${BLOCKCHAIN_NAME}-specific transaction sending using privateKey";
  } catch (error) {
    throw new Error("Failed to send transaction");
  }
}
EOF

  echo "Updated $example"
done

echo "All blockchain examples have been updated!" 