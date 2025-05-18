# Web3Auth Sui Integration Example

[![Web3Auth](https://img.shields.io/badge/Web3Auth-SDK-blue)](https://web3auth.io/docs/sdk/pnp/web/modal)
[![Web3Auth](https://img.shields.io/badge/Web3Auth-Community-cyan)](https://community.web3auth.io)

This example demonstrates how to integrate Web3Auth with the Sui blockchain in a React application, enabling secure wallet creation and Sui network interactions.

## Features

- 🔐 Social login support (Google, Facebook, Twitter, etc.)
- 🌐 Web3Auth Modal UI for seamless authentication
- ⛓️ Sui blockchain integration
- 💰 SUI token management
- 🔑 Move module interactions
- 📝 Transaction signing
- 🔄 Account management
- 🎨 Customizable UI components
- 🚀 React hooks for Sui operations

## Prerequisites

- Node.js 14+ and npm/yarn
- Basic knowledge of React and Web3
- Understanding of Sui blockchain concepts
- A Web3Auth account and client ID (get one at [Web3Auth Dashboard](https://dashboard.web3auth.io))
- Basic understanding of Move programming language

## Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Web3 Libraries**: 
  - `@web3auth/modal`: Core Web3Auth functionality
  - `@mysten/sui.js`: Sui JavaScript SDK
  - `@mysten/wallet-standard`: Sui Wallet Standard
  - `buffer`: Buffer utilities

## Installation

1. Clone the repository:
```bash
npx degit Web3Auth/web3auth-pnp-examples/web/other/sui-example w3a-sui-example
```

2. Install dependencies:
```bash
cd w3a-sui-example
npm install
```

3. Configure environment variables:
   - Create a `.env` file in the root directory
   - Add your Web3Auth client ID and Sui configuration:
   ```
   VITE_WEB3AUTH_CLIENT_ID=your-client-id
   VITE_SUI_NETWORK=devnet  # or testnet/mainnet
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
│   ├── useSui.ts         # Sui operations
│   └── useMove.ts        # Move operations
├── config/        # Configuration files
├── services/      # Blockchain services
├── types/         # TypeScript definitions
└── App.tsx        # Main application
```

## Implementation Guide

### 1. Initialize Web3Auth with Sui Configuration

```typescript
const web3auth = new Web3Auth({
  clientId: import.meta.env.VITE_WEB3AUTH_CLIENT_ID,
  web3AuthNetwork: "testnet",
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.OTHER,
    chainId: "0x1", // Sui mainnet
    rpcTarget: "https://fullnode.mainnet.sui.io"
  }
})
```

### 2. Create Sui Provider

```typescript
import { JsonRpcProvider } from '@mysten/sui.js'

const provider = new JsonRpcProvider({
  fullnode: "https://fullnode.mainnet.sui.io",
  websocket: "wss://fullnode.mainnet.sui.io:443"
})
```

### 3. Handle Sui Transactions

```typescript
async function transferSUI(
  recipient: string,
  amount: bigint
): Promise<string> {
  const tx = new TransactionBlock()
  tx.transferObjects([
    tx.splitCoins(tx.gas, [tx.pure(amount)])
  ], tx.pure(recipient))
  
  const result = await suiClient.signAndExecuteTransactionBlock({
    transactionBlock: tx
  })
  
  return result.digest
}
```

### 4. Interact with Move Modules

```typescript
async function executeMove(
  packageId: string,
  module: string,
  function: string,
  typeArguments: string[],
  arguments: any[]
): Promise<string> {
  const tx = new TransactionBlock()
  tx.moveCall({
    target: `${packageId}::${module}::${function}`,
    typeArguments,
    arguments
  })
  
  const result = await suiClient.signAndExecuteTransactionBlock({
    transactionBlock: tx
  })
  
  return result.digest
}
```

## Sui Network Setup

1. Choose Network:
   - Mainnet: Production environment
   - Testnet: Testing environment
   - Devnet: Development environment

2. Configure RPC Endpoints:
   - Use official endpoints
   - Or set up your own node
   - Handle rate limiting

3. Move Development:
   - Set up Move compiler
   - Configure package publishing
   - Handle module upgrades

## Common Issues and Solutions

1. **Network Issues**
   - Verify RPC endpoint availability
   - Handle rate limiting
   - Check network status

2. **Transaction Issues**
   - Ensure sufficient SUI balance
   - Validate object ownership
   - Handle transaction failures

3. **Move Module Issues**
   - Verify package compatibility
   - Handle version upgrades
   - Debug module calls

## Security Best Practices

- Secure private key storage
- Validate all transactions
- Handle errors gracefully
- Implement proper input validation
- Regular security audits
- Follow Sui security guidelines
- Monitor for suspicious activities
- Implement rate limiting

## Resources

- [Web3Auth Documentation](https://web3auth.io/docs)
- [Sui Developer Portal](https://docs.sui.io)
- [Move Programming](https://docs.sui.io/move)
- [Sui JavaScript SDK](https://github.com/MystenLabs/sui/tree/main/sdk/typescript)
- [Web3Auth Dashboard](https://dashboard.web3auth.io)
- [Community Portal](https://community.web3auth.io)
- [Discord Support](https://discord.gg/web3auth)

## Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

## License

This example is available under the MIT License. See the LICENSE file for more info.
