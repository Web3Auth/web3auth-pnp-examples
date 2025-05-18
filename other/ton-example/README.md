# Web3Auth TON Integration Example

[![Web3Auth](https://img.shields.io/badge/Web3Auth-SDK-blue)](https://web3auth.io/docs/sdk/pnp/web/modal)
[![Web3Auth](https://img.shields.io/badge/Web3Auth-Community-cyan)](https://community.web3auth.io)

This example demonstrates how to integrate Web3Auth with The Open Network (TON) blockchain in a React application, enabling secure wallet creation and TON network interactions.

## Features

- 🔐 Social login support (Google, Facebook, Twitter, etc.)
- 🌐 Web3Auth Modal UI for seamless authentication
- ⛓️ TON blockchain integration
- 💰 Toncoin management
- 🔑 Smart contract interactions
- 📝 Transaction signing
- 🔄 Account management
- 🎨 Customizable UI components
- 🚀 React hooks for TON operations

## Prerequisites

- Node.js 14+ and npm/yarn
- Basic knowledge of React and Web3
- Understanding of TON blockchain concepts
- A Web3Auth account and client ID (get one at [Web3Auth Dashboard](https://dashboard.web3auth.io))
- Basic understanding of FunC (TON Smart Contract Language)

## Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Web3 Libraries**: 
  - `@web3auth/modal`: Core Web3Auth functionality
  - `@tonconnect/sdk`: TON Connect SDK
  - `ton`: TON Client
  - `ton-core`: TON Core types and utilities
  - `ton-crypto`: Cryptographic utilities

## Installation

1. Clone the repository:
```bash
npx degit Web3Auth/web3auth-pnp-examples/web/other/ton-example w3a-ton-example
```

2. Install dependencies:
```bash
cd w3a-ton-example
npm install
```

3. Configure environment variables:
   - Create a `.env` file in the root directory
   - Add your Web3Auth client ID and TON configuration:
   ```
   VITE_WEB3AUTH_CLIENT_ID=your-client-id
   VITE_TON_NETWORK=mainnet  # or testnet
   VITE_TON_ENDPOINT=your-endpoint  # Optional custom endpoint
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
│   ├── useTon.ts         # TON operations
│   └── useContract.ts    # Smart contract operations
├── config/        # Configuration files
├── contracts/     # Smart contract sources
├── services/      # Blockchain services
├── types/         # TypeScript definitions
└── App.tsx        # Main application
```

## Implementation Guide

### 1. Initialize Web3Auth with TON Configuration

```typescript
const web3auth = new Web3Auth({
  clientId: import.meta.env.VITE_WEB3AUTH_CLIENT_ID,
  web3AuthNetwork: "testnet",
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.OTHER,
    chainId: "0x1", // TON mainnet
    rpcTarget: import.meta.env.VITE_TON_ENDPOINT
  }
})
```

### 2. Create TON Provider

```typescript
import { TonClient } from 'ton'

const client = new TonClient({
  endpoint: import.meta.env.VITE_TON_ENDPOINT,
  apiKey: 'your-api-key'  // if using a service provider
})
```

### 3. Handle TON Transactions

```typescript
async function transferTon(
  recipient: string,
  amount: bigint
): Promise<string> {
  const wallet = client.open(await WalletContract.create({
    publicKey: keyPair.publicKey,
    workchain: 0
  }))
  
  const transfer = await wallet.sendTransfer({
    secretKey: keyPair.secretKey,
    toAddress: recipient,
    amount: amount,
    seqno: await wallet.getSeqno()
  })
  
  return transfer.hash
}
```

### 4. Interact with Smart Contracts

```typescript
async function deployContract(
  code: Cell,
  data: Cell,
  amount: bigint
): Promise<string> {
  const contract = client.open(Contract.create({
    code,
    data,
    workchain: 0
  }))
  
  const deploy = await contract.deploy({
    value: amount
  })
  
  return deploy.hash
}
```

## TON Network Setup

1. Choose Network:
   - Mainnet: Production environment
   - Testnet: Testing environment

2. Configure Endpoints:
   - Use public endpoints
   - Or set up your own node
   - Handle rate limiting

3. Smart Contract Development:
   - Set up FunC compiler
   - Configure contract deployment
   - Handle contract upgrades

## Common Issues and Solutions

1. **Network Issues**
   - Verify endpoint availability
   - Handle rate limiting
   - Check network status

2. **Transaction Issues**
   - Ensure sufficient TON balance
   - Validate message format
   - Handle transaction failures

3. **Smart Contract Issues**
   - Verify contract code
   - Handle initialization
   - Debug contract calls

## Security Best Practices

- Secure private key storage
- Validate all transactions
- Handle errors gracefully
- Implement proper input validation
- Regular security audits
- Follow TON security guidelines
- Monitor for suspicious activities
- Implement rate limiting

## Resources

- [Web3Auth Documentation](https://web3auth.io/docs)
- [TON Developer Portal](https://ton.org/dev)
- [TON Documentation](https://docs.ton.org)
- [FunC Documentation](https://docs.ton.org/develop/smart-contracts)
- [TON Connect](https://github.com/ton-connect/sdk)
- [Web3Auth Dashboard](https://dashboard.web3auth.io)
- [Community Portal](https://community.web3auth.io)
- [Discord Support](https://discord.gg/web3auth)

## Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

## License

This example is available under the MIT License. See the LICENSE file for more info.
