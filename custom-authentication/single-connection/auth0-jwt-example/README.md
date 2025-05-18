# Web3Auth Auth0 JWT Integration Example

This example demonstrates how to integrate Web3Auth with Auth0's ID token authentication in a React application for EVM-compatible blockchains. It showcases a headless implementation using Web3Auth's no-modal SDK for complete UI customization.

## Features

- 🔐 Auth0 authentication integration
- 🎨 Custom UI implementation
- 🔑 JWT-based authentication flow
- ⛓️ EVM blockchain integration
- 🔄 React hooks for blockchain interactions
- 📱 Responsive and user-friendly interface
- 🛡️ Secure token handling
- 🎨 Fully customizable authentication flow

## Prerequisites

- Node.js 14+ and npm/yarn
- Basic knowledge of React and Auth0
- Auth0 account and application setup
- Web3Auth account and client ID (get one at [Web3Auth Dashboard](https://dashboard.web3auth.io))
- Basic understanding of JWT and OAuth flows

## Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Authentication**: 
  - `@auth0/auth0-react`: Auth0 SDK for React
  - `@web3auth/modal`: Headless Web3Auth SDK
- **Web3 Libraries**: 
  - `wagmi`: React hooks for Ethereum
  - `@tanstack/react-query`: Data synchronization
  - `ethers`: Ethereum library

## Installation

1. Clone the repository:
```bash
npx degit Web3Auth/web3auth-pnp-examples/web/custom-authentication/single-connection/jwt-login/auth0-idtoken-example w3a-example
```

2. Install dependencies:
```bash
cd w3a-example
npm install
```

3. Configure environment variables:
   - Create a `.env` file in the root directory
   - Add your Auth0 and Web3Auth configuration:
   ```
   VITE_AUTH0_DOMAIN=your-auth0-domain
   VITE_AUTH0_CLIENT_ID=your-auth0-client-id
   VITE_WEB3AUTH_CLIENT_ID=your-web3auth-client-id
   VITE_WEB3AUTH_VERIFIER=your-verifier-name
   ```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/     # React components
│   ├── Auth/      # Auth0 related components
│   └── Web3/      # Web3Auth components
├── hooks/         # Custom React hooks
├── config/        # Configuration files
├── services/      # Auth and blockchain services
├── types/         # TypeScript definitions
└── App.tsx        # Main application
```

## Implementation Guide

### 1. Auth0 Configuration
```typescript
// src/config/auth0Config.ts
import { Auth0Provider } from '@auth0/auth0-react'

export const Auth0ProviderConfig = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: `https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/`,
    scope: 'openid profile email'
  }
}
```

### 2. Web3Auth Integration
```typescript
// src/services/web3auth.ts
import { Web3AuthNoModal } from '@web3auth/modal'

export class Web3AuthService {
  private web3auth: Web3AuthNoModal | null = null

  async init() {
    this.web3auth = new Web3AuthNoModal({
      clientId: import.meta.env.VITE_WEB3AUTH_CLIENT_ID,
      web3AuthNetwork: "testnet",
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0x1",
        rpcTarget: "https://rpc.ankr.com/eth"
      }
    })

    await this.web3auth.init()
  }

  async loginWithJWT(idToken: string) {
    if (!this.web3auth) {
      throw new Error('Web3Auth not initialized')
    }

    const provider = await this.web3auth.connectTo('jwt', {
      id_token: idToken,
      verifier: import.meta.env.VITE_WEB3AUTH_VERIFIER
    })

    return provider
  }
}
```

### 3. Custom Authentication Hook
```typescript
// src/hooks/useAuth.ts
import { useAuth0 } from '@auth0/auth0-react'
import { useWeb3Auth } from './useWeb3Auth'
import { useState, useCallback } from 'react'

export function useAuth() {
  const { getIdTokenClaims, loginWithRedirect } = useAuth0()
  const { loginWithJWT } = useWeb3Auth()
  const [isConnecting, setIsConnecting] = useState(false)

  const connect = useCallback(async () => {
    try {
      setIsConnecting(true)
      const claims = await getIdTokenClaims()
      if (!claims) {
        await loginWithRedirect()
        return
      }
      await loginWithJWT(claims.__raw)
    } catch (error) {
      console.error('Authentication failed:', error)
    } finally {
      setIsConnecting(false)
    }
  }, [getIdTokenClaims, loginWithRedirect, loginWithJWT])

  return { connect, isConnecting }
}
```

### 4. Component Implementation
```tsx
// src/components/Auth/LoginButton.tsx
import { useAuth } from '../../hooks/useAuth'

export function LoginButton() {
  const { connect, isConnecting } = useAuth()

  return (
    <button 
      onClick={connect}
      disabled={isConnecting}
    >
      {isConnecting ? 'Connecting...' : 'Connect with Auth0'}
    </button>
  )
}
```

## Auth0 Setup Guide

1. Create an Auth0 Application:
   - Go to Auth0 Dashboard
   - Create a new Single Page Application
   - Configure allowed callback URLs
   - Note down domain and client ID

2. Configure Auth0 Rules:
   - Create a new rule for custom claims
   - Configure token lifetime
   - Set up appropriate scopes

3. Web3Auth Configuration:
   - Create a custom verifier in Web3Auth Dashboard
   - Configure JWT validation
   - Set up Auth0 as an authentication method

## Common Issues and Solutions

1. **Token Handling**
   - Ensure proper token format
   - Handle token expiration
   - Implement token refresh logic

2. **Auth0 Configuration**
   - Verify callback URLs
   - Check scope configuration
   - Handle CORS issues

3. **Integration Issues**
   - Validate JWT format
   - Check verifier configuration
   - Handle authentication state properly

## Security Best Practices

- Never expose tokens in URLs
- Implement proper token validation
- Use secure storage methods
- Handle authentication state securely
- Regular security audits
- Follow Auth0 security guidelines

## Resources

- [Web3Auth Documentation](https://web3auth.io/docs)
- [Auth0 Documentation](https://auth0.com/docs)
- [JWT Integration Guide](https://web3auth.io/docs/custom-authentication/jwt)
- [React Integration Guide](https://web3auth.io/docs/sdk/pnp/web/no-modal)
- [Web3Auth Dashboard](https://dashboard.web3auth.io)
- [Discord Support](https://discord.gg/web3auth)

## Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

## License

This example is available under the MIT License. See the LICENSE file for more info.
