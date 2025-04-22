#!/bin/bash

BASE_DIR="/Users/yashovardhanagrawal/GitHub/web3auth-pnp-examples/web-no-modal-sdk/custom-authentication/single-connection/implicit-login"
EXAMPLES=("cognito-no-modal-example" "discord-no-modal-example" "facebook-no-modal-example" "twitch-no-modal-example" "worldcoin-no-modal-example")

for example in "${EXAMPLES[@]}"; do
  echo "Updating package.json for $example..."
  cp "$BASE_DIR/google-no-modal-example/package.json" "$BASE_DIR/$example/package.json"
  
  echo "Updating index.tsx for $example..."
  cp "$BASE_DIR/google-no-modal-example/src/index.tsx" "$BASE_DIR/$example/src/index.tsx"
  
  echo "Updated $example"
done

echo "All remaining examples' package.json and index.tsx updated!" 