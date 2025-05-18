# Web3Auth Custom JWT Integration Example

This example demonstrates how to integrate Web3Auth with a custom JWT authentication system in a React application for EVM-compatible blockchains. It showcases how to implement your own JWT provider and integrate it with Web3Auth.

## Features

- 🔐 Custom JWT authentication
- 🎨 Flexible authentication flow
- 🔑 JWT token management
- ⛓️ EVM blockchain integration
- 🔄 React hooks for blockchain interactions
- 📱 Responsive and user-friendly interface
- 🛡️ Secure token handling
- 🚀 Customizable authentication logic

## Prerequisites

- Node.js 14+ and npm/yarn
- Basic knowledge of React and JWT
- Understanding of JWT implementation
- Web3Auth account and client ID (get one at [Web3Auth Dashboard](https://dashboard.web3auth.io))
- Basic understanding of JWT and authentication flows

## Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Authentication**: 
  - Custom JWT implementation
  - `jsonwebtoken`: JWT handling
  - `@web3auth/modal`: Web3Auth core functionality
- **Web3 Libraries**: 
  - `ethers`: Ethereum library

## Installation

1. Clone the repository:
```bash
npx degit Web3Auth/web3auth-pnp-examples/web/custom-authentication/single-connection/jwt-login/custom-jwt-example w3a-example
```

2. Install dependencies:
```bash
cd w3a-example
npm install
```

3. Configure environment variables:
   - Create a `.env` file in the root directory
   - Add your configuration:
   ```
   VITE_JWT_SECRET=your-jwt-secret
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
│   ├── Auth/      # JWT authentication components
│   └── Web3/      # Web3Auth components
├── hooks/         # Custom React hooks
├── config/        # Configuration files
├── services/      # Auth and blockchain services
│   ├── jwt/       # JWT implementation
│   └── web3auth/  # Web3Auth services
├── types/         # TypeScript definitions
└── App.tsx        # Main application
```

## Implementation Guide

### 1. JWT Service Implementation
```typescript
// src/services/jwt/jwtService.ts
import jwt from 'jsonwebtoken'

export class JWTService {
  private secret: string

  constructor() {
    this.secret = import.meta.env.VITE_JWT_SECRET
  }

  generateToken(payload: any): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: '1h',
      algorithm: 'HS256'
    })
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.secret)
    } catch (error) {
      throw new Error('Invalid token')
    }
  }
}
```

### 2. Web3Auth Integration
```typescript
// src/services/web3auth/web3AuthService.ts
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

  async loginWithJWT(token: string) {
    if (!this.web3auth) {
      throw new Error('Web3Auth not initialized')
    }

    const provider = await this.web3auth.connectTo('jwt', {
      id_token: token,
      verifier: import.meta.env.VITE_WEB3AUTH_VERIFIER
    })

    return provider
  }
}
```

### 3. Authentication Hook
```typescript
// src/hooks/useAuth.ts
import { useState } from 'react'
import { JWTService } from '../services/jwt/jwtService'
import { Web3AuthService } from '../services/web3auth/web3AuthService'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const jwtService = new JWTService()
  const web3AuthService = new Web3AuthService()

  async function login(credentials: any) {
    try {
      // Generate JWT token
      const token = jwtService.generateToken({
        sub: credentials.id,
        email: credentials.email
      })

      // Verify token
      jwtService.verifyToken(token)

      // Login with Web3Auth
      await web3AuthService.loginWithJWT(token)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Authentication failed:', error)
      throw error
    }
  }

  return { isAuthenticated, login }
}
```

### 4. Component Implementation
```tsx
// src/components/Auth/LoginForm.tsx
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

export function LoginForm() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login({ id: '1', email })
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  )
}
```

## JWT Implementation Guide

1. JWT Token Structure:
   ```typescript
   interface JWTPayload {
     sub: string;        // Subject (user ID)
     email: string;      // User email
     iat?: number;       // Issued at
     exp?: number;       // Expiration time
   }
   ```

2. Required JWT Claims:
   - `sub`: Unique identifier for the user
   - `iat`: Token issuance time
   - `exp`: Token expiration time

3. JWT Security Considerations:
   - Use strong secret keys
   - Implement token expiration
   - Validate token signature
   - Handle token refresh

## Common Issues and Solutions

1. **JWT Configuration**
   - Verify token signing algorithm
   - Check token expiration settings
   - Handle token validation errors

2. **Token Management**
   - Implement proper token storage
   - Handle token refresh flow
   - Manage token expiration

3. **Integration Issues**
   - Validate JWT format
   - Check verifier configuration
   - Handle authentication errors

## Security Best Practices

- Use strong JWT secrets
- Implement proper token validation
- Secure token storage
- Handle authentication state securely
- Regular security audits
- Follow JWT security guidelines

## Resources

- [Web3Auth Documentation](https://web3auth.io/docs)
- [JWT.io](https://jwt.io)
- [JWT Integration Guide](https://web3auth.io/docs/custom-authentication/jwt)
- [JWT Security Best Practices](https://auth0.com/docs/secure/tokens/json-web-tokens/jwt-security-best-practices)
- [Web3Auth Dashboard](https://dashboard.web3auth.io)
- [Discord Support](https://discord.gg/web3auth)

## Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

## License

This example is available under the MIT License. See the LICENSE file for more info.
