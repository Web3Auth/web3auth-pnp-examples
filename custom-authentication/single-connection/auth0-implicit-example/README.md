# Web3Auth Auth0 Integration Example

This example demonstrates how to integrate Web3Auth's Plug and Play Modal SDK with Auth0 for custom authentication. It provides a simple, production-ready starting point for adding Web3Auth authentication to your application using Auth0 as the authentication provider.

## Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/Web3Auth/web3auth-pnp-examples.git
```

### 2. Navigate to the example
```bash
cd web3auth-pnp-examples/custom-authentication/single-connection/implicit-login/auth0-example
```

### 3. Install dependencies
```bash
npm install
# or
yarn
```

### 4. Configure environment variables
Create a `.env` file and add your Web3Auth and Auth0 configuration:
```bash
VITE_WEB3AUTH_CLIENT_ID=your-web3auth-client-id
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
```

### 5. Run the application
```bash
npm run dev
# or
yarn dev
```

## Important Links
- [Website](https://web3auth.io)
- [Documentation](https://web3auth.io/docs)
- [Guides](https://web3auth.io/docs/guides)
- [SDK / API References](https://web3auth.io/docs/sdk)
- [Pricing](https://web3auth.io/pricing.html)
- [Support](https://discord.gg/web3auth)

## Technical Details

### Stack
- Framework: React 18+
- Web3Auth SDK: `@web3auth/modal@7.x`
- Auth Provider: Auth0
- Blockchain: EVM (Ethereum, Polygon, etc.)
- Package Manager: npm/yarn
- Build Tool: Vite

### Key Features
- Custom authentication with Auth0
- Social login providers through Auth0
- Web3Auth integration for wallet creation
- Example blockchain interactions:
  - Get user's Ethereum address
  - Get user's ETH balance
  - Sign messages
  - Send transactions
- TypeScript support
- Vite for fast development and building

### Code Structure
```
src/
├── components/     # React components
├── config/        # Configuration files
├── services/      # Web3Auth and Auth0 services
└── App.tsx        # Main application component
```

### Web3Auth Configuration with Auth0
```typescript
const web3AuthConfig = {
  clientId: import.meta.env.VITE_WEB3AUTH_CLIENT_ID,
  web3AuthNetwork: "sapphire_devnet",
  chainConfig: {
    chainNamespace: "eip155",
    chainId: "0x1", // Ethereum Mainnet
    rpcTarget: "https://rpc.ankr.com/eth"
  }
};

const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  verifier: "web3auth-auth0-example",
  typeOfLogin: "jwt"
};
```

### Auth0 Integration
```typescript
// Initialize Auth0 client
const auth0Client = new Auth0Client({
  domain: auth0Config.domain,
  clientId: auth0Config.clientId,
  authorizationParams: {
    redirect_uri: window.location.origin
  }
});

// Get JWT token from Auth0
const getIdToken = async () => {
  const token = await auth0Client.getIdToken();
  return token;
};
```

## Security Considerations
- Keep your Web3Auth and Auth0 credentials secure and never commit them to version control
- Implement proper error handling for authentication and blockchain interactions
- Follow Auth0 security best practices
- Consider implementing rate limiting for authentication attempts
- Validate all user inputs and transaction parameters
- Use environment variables for sensitive configuration
- Implement proper session management
- Handle JWT token expiration and refresh

## Support and Feedback
- [Discord](https://discord.gg/web3auth)
- [GitHub Issues](https://github.com/Web3Auth/web3auth-pnp-examples/issues)
- [Documentation](https://web3auth.io/docs/custom-authentication/auth0)

## License
MIT
