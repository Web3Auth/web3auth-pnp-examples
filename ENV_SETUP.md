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

Check the individual '.env.example' files in each example directory for the specific environment variables needed.
