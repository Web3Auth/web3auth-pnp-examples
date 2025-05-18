# Web3Auth React Solana Quick Start Example

This example demonstrates how to integrate Web3Auth with Solana blockchain in a React application, enabling secure wallet creation and Solana network interactions using React's modern features.

## Features

- 🔐 Social login with multiple providers (Google, Facebook, Discord, etc.)
- 🌐 Web3Auth Modal UI for seamless authentication
- ⛓️ Solana blockchain integration
- 💰 SOL token management
- 🔑 SPL token support
- 📝 Transaction signing
- 🔄 React hooks for blockchain interactions
- 📱 Responsive and user-friendly interface
- 🎨 Modern React patterns and best practices

## Prerequisites

- Node.js 14+ and npm/yarn
- Basic knowledge of React and Solana
- A Web3Auth account and client ID (get one at [Web3Auth Dashboard](https://dashboard.web3auth.io))
- Basic understanding of Solana concepts (accounts, programs, SOL, SPL tokens)

## Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite
- **State Management**: React Context + Hooks
- **Web3 Libraries**: 
  - `@web3auth/modal`: Core Web3Auth functionality
  - `@solana/web3.js`: Solana JavaScript API
  - `@solana/spl-token`: SPL Token functionality
  - `bs58`: Base58 encoding/decoding
  - `buffer`: Buffer utilities

## Installation

1. Clone the repository:
```bash
npx degit Web3Auth/web3auth-pnp-examples/web/quick-starts/react-solana-quick-start w3a-example
```

2. Install dependencies:
```bash
cd w3a-example
npm install
```

3. Configure environment variables:
   - Create a `.env` file in the root directory
   - Add your Web3Auth client ID and Solana configuration:
   ```
   VITE_WEB3AUTH_CLIENT_ID=your-client-id
   VITE_SOLANA_NETWORK=devnet  # or mainnet-beta
   VITE_RPC_URL=your-rpc-url   # Optional custom RPC
   ```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/     # React components
├── hooks/         # Custom React hooks
│   ├── useWeb3Auth.ts     # Web3Auth integration
│   ├── useSolana.ts       # Solana operations
│   └── useSPLToken.ts     # SPL token operations
├── config/        # Configuration files
├── services/      # Blockchain services
├── types/         # TypeScript definitions
└── App.tsx        # Main application component
```

## Implementation Guide

### 1. Web3Auth Configuration with Solana
```typescript
// src/config/web3AuthConfig.ts
import { Web3Auth } from '@web3auth/modal'
import { CHAIN_NAMESPACES } from '@web3auth/base'

export const web3auth = new Web3Auth({
  clientId: import.meta.env.VITE_WEB3AUTH_CLIENT_ID,
  web3AuthNetwork: "testnet",
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.SOLANA,
    chainId: "0x1", // Mainnet
    rpcTarget: "https://api.mainnet-beta.solana.com"
  }
})
```

### 2. Create Solana Hook
```typescript
// src/hooks/useSolana.ts
import { useState, useCallback } from 'react'
import { Connection, PublicKey, Transaction } from '@solana/web3.js'
import { useWeb3Auth } from './useWeb3Auth'

export function useSolana() {
  const { provider } = useWeb3Auth()
  const [balance, setBalance] = useState<number>(0)
  const connection = new Connection(import.meta.env.VITE_RPC_URL)

  const getBalance = useCallback(async (address: string) => {
    try {
      const pubKey = new PublicKey(address)
      const balance = await connection.getBalance(pubKey)
      setBalance(balance)
      return balance
    } catch (error) {
      console.error('Error getting balance:', error)
      return 0
    }
  }, [connection])

  const sendTransaction = useCallback(async (to: string, amount: number) => {
    try {
      // Implementation for sending SOL
      const transaction = new Transaction()
      // Add transfer instruction
      // Sign and send transaction
    } catch (error) {
      console.error('Error sending transaction:', error)
    }
  }, [provider, connection])

  return {
    balance,
    getBalance,
    sendTransaction
  }
}
```

### 3. Use in Components
```tsx
import React, { useState } from 'react'
import { useWeb3Auth } from '../hooks/useWeb3Auth'
import { useSolana } from '../hooks/useSolana'

export const WalletComponent: React.FC = () => {
  const { isAuthenticated, login } = useWeb3Auth()
  const { balance, sendTransaction } = useSolana()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState(0)

  const handleTransfer = async () => {
    if (recipient && amount) {
      await sendTransaction(recipient, amount)
    }
  }

  return (
    <div>
      {!isAuthenticated ? (
        <button onClick={login}>Connect Wallet</button>
      ) : (
        <div>
          <p>SOL Balance: {balance / 1e9} SOL</p>
          <div className="transfer-form">
            <input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Recipient address"
            />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Amount"
            />
            <button onClick={handleTransfer}>Send SOL</button>
          </div>
        </div>
      )}
    </div>
  )
}
```

## Common Issues and Solutions

1. **Solana Network Issues**
   - Verify RPC endpoint availability
   - Handle rate limiting appropriately
   - Check network status (devnet/testnet/mainnet)

2. **Transaction Issues**
   - Ensure sufficient SOL for fees
   - Validate address formats
   - Handle transaction timeouts

3. **Integration Issues**
   - Check Web3Auth network configuration
   - Verify Solana connection settings
   - Handle provider initialization properly

## Security Best Practices

- Never expose private keys
- Validate all input addresses
- Implement proper error handling
- Handle transaction signing securely
- Regular security audits
- Follow Solana security guidelines

## Resources

- [Web3Auth Documentation](https://web3auth.io/docs)
- [React Integration Guide](https://web3auth.io/docs/sdk/pnp/web/modal/)
- [Solana Integration Guide](https://web3auth.io/docs/connect-blockchain/solana)
- [Solana Documentation](https://docs.solana.com)
- [React Documentation](https://react.dev)
- [Web3Auth Dashboard](https://dashboard.web3auth.io)
- [Discord Support](https://discord.gg/web3auth)

## Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

## License

This example is available under the MIT License. See the LICENSE file for more info.
