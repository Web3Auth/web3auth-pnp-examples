# Web3Auth Next.js Quick Start Example (EVM)

This example demonstrates how to integrate Web3Auth into a Next.js application for Ethereum Virtual Machine (EVM) based blockchains. It provides a server-side rendered solution with optimal performance and SEO capabilities.

## Features

- 🔐 Social login with multiple providers (Google, Facebook, Discord, etc.)
- 🌐 Web3Auth Modal UI for seamless authentication
- ⛓️ EVM blockchain integration
- 🔄 React hooks for blockchain interactions
- 📱 Responsive and user-friendly interface
- 🖥️ Server-side rendering support
- 🎨 Modern Next.js features and patterns
- 🚀 Optimized performance with SSR/SSG

## Prerequisites

- Node.js 14+ and npm/yarn
- Basic knowledge of Next.js and Web3
- A Web3Auth account and client ID (get one at [Web3Auth Dashboard](https://dashboard.web3auth.io))

## Tech Stack

- **Frontend**: Next.js 13+ with TypeScript
- **Build Tool**: Next.js build system
- **State Management**: React Context + Hooks
- **Web3 Libraries**: 
  - `@web3auth/modal`: Core Web3Auth functionality
  - `wagmi`: React hooks for Ethereum
  - `@tanstack/react-query`: Data synchronization
  - `ethers`: Ethereum library
  - `next-auth`: (Optional) Authentication integration

## Installation

1. Clone the repository:
```bash
npx degit Web3Auth/web3auth-pnp-examples/web/quick-starts/nextjs-quick-start w3a-example
```

2. Install dependencies:
```bash
cd w3a-example
npm install
```

3. Configure environment variables:
   - Create a `.env.local` file in the root directory
   - Add your Web3Auth client ID and configuration:
   ```
   NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=your-client-id
   NEXT_PUBLIC_CHAIN_ID=0x1
   NEXT_PUBLIC_RPC_TARGET=your-rpc-url
   ```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/     # React components
│   ├── Web3Auth/  # Web3Auth specific components
│   └── ui/        # Common UI components
├── hooks/         # Custom React hooks
├── config/        # Configuration files
├── pages/         # Next.js pages
│   ├── api/       # API routes
│   └── _app.tsx   # App entry
├── services/      # Web3Auth and blockchain services
├── styles/        # CSS and styling
└── types/         # TypeScript definitions
```

## Implementation Guide

### 1. Web3Auth Configuration
```typescript
// src/config/web3AuthConfig.ts
import { Web3Auth } from '@web3auth/modal'
import { CHAIN_NAMESPACES } from '@web3auth/base'

export function initWeb3Auth() {
  return new Web3Auth({
    clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!,
    web3AuthNetwork: "testnet",
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: process.env.NEXT_PUBLIC_CHAIN_ID!,
      rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET
    }
  })
}
```

### 2. Create Web3Auth Provider
```typescript
// src/components/Web3Auth/Web3AuthProvider.tsx
import { createContext, useContext, useEffect, useState } from 'react'
import { Web3Auth } from '@web3auth/modal'
import { initWeb3Auth } from '@/config/web3AuthConfig'

const Web3AuthContext = createContext<{
  web3auth: Web3Auth | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}>({
  web3auth: null,
  isLoading: true,
  isAuthenticated: false,
})

export function Web3AuthProvider({ children }) {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = initWeb3Auth()
        await web3auth.initModal()
        setWeb3auth(web3auth)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [])

  return (
    <Web3AuthContext.Provider value={{
      web3auth,
      isLoading,
      isAuthenticated: !!web3auth?.provider
    }}>
      {children}
    </Web3AuthContext.Provider>
  )
}
```

### 3. Integrate in Pages
```typescript
// src/pages/index.tsx
import { useWeb3Auth } from '@/hooks/useWeb3Auth'
import { useEffect, useState } from 'react'

export default function Home() {
  const { web3auth, isAuthenticated, login } = useWeb3Auth()
  const [balance, setBalance] = useState('0')

  useEffect(() => {
    if (isAuthenticated) {
      // Initialize blockchain interactions
    }
  }, [isAuthenticated])

  return (
    <div>
      {!isAuthenticated ? (
        <button onClick={login}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected!</p>
          <p>Balance: {balance} ETH</p>
        </div>
      )}
    </div>
  )
}
```

## Common Issues and Solutions

1. **Server-Side Rendering**
   - Handle Web3Auth initialization properly
   - Use dynamic imports for client-side only code
   - Implement proper hydration strategies

2. **Environment Variables**
   - Ensure proper Next.js environment variable prefixing
   - Verify variables in both development and production
   - Handle build-time vs runtime configuration

3. **Integration Issues**
   - Check Web3Auth network configuration
   - Verify provider initialization
   - Handle authentication state properly

## Security Best Practices

- Implement proper CSP headers
- Secure API routes
- Handle authentication state securely
- Use environment variables for sensitive data
- Regular security audits
- Follow Next.js security guidelines

## Performance Optimization

- Implement proper code splitting
- Use Next.js Image component
- Optimize Web3Auth initialization
- Implement proper caching strategies
- Use static generation where possible

## Resources

- [Web3Auth Documentation](https://web3auth.io/docs)
- [Next.js Integration Guide](https://web3auth.io/docs/sdk/pnp/web/modal/)
- [EVM Integration Guide](https://web3auth.io/docs/connect-blockchain/evm)
- [Next.js Documentation](https://nextjs.org/docs)
- [Web3Auth Dashboard](https://dashboard.web3auth.io)
- [Discord Support](https://discord.gg/web3auth)

## Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

## License

This example is available under the MIT License. See the LICENSE file for more info.
