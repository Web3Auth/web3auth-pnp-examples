# Web3Auth PnP Examples Environment Setup Instructions

In order to use the examples in this repository, you'll need to create a '.env' file in each example directory.

For example, in the 'quick-starts/react-quick-start' directory, you would create:

```
VITE_WEB3AUTH_CLIENT_ID=YOUR_WEB3AUTH_CLIENT_ID
```

You can get your Web3Auth Client ID from the Web3Auth Dashboard at https://dashboard.web3auth.io

Each example directory includes a '.env.example' file that shows which environment variables are needed for that particular example. All hardcoded client IDs have been removed, so you must set your own client ID in the .env file for the examples to work.

## Common Environment Variables

- `VITE_WEB3AUTH_CLIENT_ID` - Your Web3Auth Client ID (for Vite-based projects)
- `NEXT_PUBLIC_WEB3AUTH_CLIENT_ID` - Your Web3Auth Client ID (for Next.js projects)
- `WEB3AUTH_CLIENT_ID` - Your Web3Auth Client ID (for vanilla JavaScript projects)

## Custom Authentication Examples

Custom authentication examples may require additional environment variables such as:

- `VITE_AUTH0_DOMAIN` - Your Auth0 domain
- `VITE_AUTH0_CLIENT_ID` - Your Auth0 Client ID
- `VITE_GOOGLE_CLIENT_ID` - Your Google OAuth Client ID
- `VITE_FIREBASE_API_KEY` - Your Firebase API Key
- `VITE_FIREBASE_AUTH_DOMAIN` - Your Firebase Auth Domain
- `VITE_FIREBASE_PROJECT_ID` - Your Firebase Project ID

Check the individual '.env.example' files in each example directory for the specific environment variables needed.

## Updated Files

All examples have been updated to use environment variables instead of hardcoded client IDs. The key files that were modified include:

### Quick Starts
- `quick-starts/react-quick-start/src/web3authContext.tsx`
- `quick-starts/vue-quick-start/src/web3authContext.tsx`
- `quick-starts/vue-solana-quick-start/src/web3authContext.tsx`
- `quick-starts/react-solana-quick-start/src/web3authContext.tsx`
- `quick-starts/nextjs-quick-start/components/provider.tsx`
- `quick-starts/angular-quick-start/src/app/app.component.ts`
- `quick-starts/vanillajs-quick-start/script.js`

### Other Examples
- `other/bitcoin-example/src/web3authContext.tsx`
- (All other examples have .env.example files)

### Custom Authentication
- `custom-authentication/single-connection/auth0-implicit-example/src/web3authContext.tsx`
- `custom-authentication/single-connection/auth0-jwt-example/src/index.tsx`
- `custom-authentication/single-connection/google-one-tap-example/src/index.tsx`
- (All other examples have .env.example files) 