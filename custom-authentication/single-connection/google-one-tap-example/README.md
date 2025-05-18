# Web3Auth Google One Tap JWT Integration Example

This example demonstrates how to integrate Web3Auth with Google One Tap authentication in a React application for EVM-compatible blockchains. It showcases a seamless sign-in experience using Google's One Tap feature.

## Features

- 🔐 Google One Tap authentication
- 🎨 Seamless sign-in experience
- 🔑 JWT-based authentication flow
- ⛓️ EVM blockchain integration
- 🔄 React hooks for blockchain interactions
- 📱 Responsive and user-friendly interface
- 🛡️ Secure token handling
- 🚀 Minimal user interaction

## Prerequisites

- Node.js 14+ and npm/yarn
- Basic knowledge of React and Google APIs
- Google Cloud Platform project setup
- Web3Auth account and client ID (get one at [Web3Auth Dashboard](https://dashboard.web3auth.io))
- Basic understanding of JWT and OAuth flows

## Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Authentication**: 
  - `@react-oauth/google`: Google One Tap SDK
  - `@web3auth/modal`: Web3Auth core functionality
- **Web3 Libraries**: 
  - `ethers`: Ethereum library

## Installation

1. Clone the repository:
```bash
npx degit Web3Auth/web3auth-pnp-examples/web/custom-authentication/single-connection/jwt-login/google-one-tap-example w3a-example
```

2. Install dependencies:
```bash
cd w3a-example
npm install
```

3. Configure environment variables:
   - Create a `.env` file in the root directory
   - Add your Google and Web3Auth configuration:
   ```
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
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
│   ├── Auth/      # Google One Tap components
│   └── Web3/      # Web3Auth components
├── hooks/         # Custom React hooks
├── config/        # Configuration files
├── services/      # Auth and blockchain services
├── types/         # TypeScript definitions
└── App.tsx        # Main application
```

## Implementation Guide

### 1. Google One Tap Configuration
```typescript
// src/config/googleConfig.ts
import { GoogleOAuthProvider } from '@react-oauth/google'

export const GoogleConfig = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  oneTapEnabled: true,
  autoSelect: true,
  context: 'signin'
}
```

### 2. Web3Auth Integration
```typescript
// src/services/web3auth.ts
import { Web3Auth } from '@web3auth/modal'

export class Web3AuthService {
  private web3auth: Web3Auth | null = null

  async init() {
    this.web3auth = new Web3Auth({
      clientId: import.meta.env.VITE_WEB3AUTH_CLIENT_ID,
      web3AuthNetwork: "testnet",
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0x1",
        rpcTarget: "https://rpc.ankr.com/eth"
      }
    })

    await this.web3auth.initModal()
  }

  async loginWithJWT(credential: string) {
    if (!this.web3auth) {
      throw new Error('Web3Auth not initialized')
    }

    const provider = await this.web3auth.connectTo('jwt', {
      id_token: credential,
      verifier: import.meta.env.VITE_WEB3AUTH_VERIFIER
    })

    return provider
  }
}
```

### 3. Google One Tap Hook
```typescript
// src/hooks/useGoogleOneTap.ts
import { useGoogleOneTapLogin } from '@react-oauth/google'
import { useWeb3Auth } from './useWeb3Auth'
import { useState } from 'react'

export function useGoogleOneTap() {
  const { loginWithJWT } = useWeb3Auth()
  const [isConnecting, setIsConnecting] = useState(false)

  useGoogleOneTapLogin({
    onSuccess: async (response) => {
      try {
        setIsConnecting(true)
        await loginWithJWT(response.credential)
      } catch (error) {
        console.error('Authentication failed:', error)
      } finally {
        setIsConnecting(false)
      }
    },
    onError: () => {
      console.error('Google One Tap failed')
    }
  })

  return { isConnecting }
}
```

### 4. Component Implementation
```tsx
// src/components/Auth/GoogleOneTap.tsx
import { useGoogleOneTap } from '../../hooks/useGoogleOneTap'

export function GoogleOneTap() {
  const { isConnecting } = useGoogleOneTap()

  return (
    <div className="google-one-tap-container">
      {isConnecting && <div>Connecting...</div>}
    </div>
  )
}
```

## Google Cloud Platform Setup

1. Create a GCP Project:
   - Go to Google Cloud Console
   - Create a new project
   - Enable Google Identity Services API

2. Configure OAuth Consent Screen:
   - Set up OAuth consent screen
   - Add authorized domains
   - Configure scopes

3. Create OAuth 2.0 Client ID:
   - Create Web application type
   - Add authorized JavaScript origins
   - Note down the client ID

## Common Issues and Solutions

1. **One Tap Display**
   - Handle auto-display timing
   - Manage prompt moments
   - Handle user dismissal

2. **Token Handling**
   - Verify token format
   - Handle token expiration
   - Implement proper validation

3. **Integration Issues**
   - Check domain verification
   - Verify OAuth configuration
   - Handle authentication errors

## Security Best Practices

- Validate JWT tokens server-side
- Implement proper error handling
- Use secure token storage
- Handle authentication state securely
- Regular security audits
- Follow Google security guidelines

## Resources

- [Web3Auth Documentation](https://web3auth.io/docs)
- [Google Identity Documentation](https://developers.google.com/identity)
- [JWT Integration Guide](https://web3auth.io/docs/custom-authentication/jwt)
- [Google Cloud Console](https://console.cloud.google.com)
- [Web3Auth Dashboard](https://dashboard.web3auth.io)
- [Discord Support](https://discord.gg/web3auth)

## Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

## License

This example is available under the MIT License. See the LICENSE file for more info.
