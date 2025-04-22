#!/bin/bash

BASE_DIR="/Users/yashovardhanagrawal/GitHub/web3auth-pnp-examples/web-no-modal-sdk/custom-authentication/single-connection/implicit-login"
EXAMPLES=("cognito-no-modal-example" "discord-no-modal-example" "facebook-no-modal-example" "google-no-modal-example" "twitch-no-modal-example" "worldcoin-no-modal-example")
AUTH0_EXAMPLE="$BASE_DIR/auth0-no-modal-example"

for example in "${EXAMPLES[@]}"; do
  echo "Updating $example..."
  EXAMPLE_DIR="$BASE_DIR/$example"
  
  # Create components directory if it doesn't exist
  mkdir -p "$EXAMPLE_DIR/src/components"
  
  # Copy component files
  cp "$AUTH0_EXAMPLE/src/components/sendTransaction.tsx" "$EXAMPLE_DIR/src/components/"
  cp "$AUTH0_EXAMPLE/src/components/getBalance.tsx" "$EXAMPLE_DIR/src/components/"
  cp "$AUTH0_EXAMPLE/src/components/switchNetwork.tsx" "$EXAMPLE_DIR/src/components/"
  
  # Copy web3authContext.tsx
  cp "$AUTH0_EXAMPLE/src/web3authContext.tsx" "$EXAMPLE_DIR/src/"
  
  # Copy App.css
  cp "$AUTH0_EXAMPLE/src/App.css" "$EXAMPLE_DIR/src/"
  
  # Remove unnecessary files
  rm -f "$EXAMPLE_DIR/src/viemRPC.ts" "$EXAMPLE_DIR/src/web3RPC.ts" "$EXAMPLE_DIR/src/ethersRPC.ts" "$EXAMPLE_DIR/src/App.test.tsx" "$EXAMPLE_DIR/src/setupTests.ts" "$EXAMPLE_DIR/src/reportWebVitals.ts"
  
  echo "Updated $example"
done

echo "All examples updated!" 