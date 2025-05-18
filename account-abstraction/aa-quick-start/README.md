# Web3Auth with React and Account Abstraction

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Web3 Libraries**: 
  - `@web3auth/modal`: Core Web3Auth functionality with Modal UI
  - `wagmi`: React hooks for Ethereum
  - `viem`: TypeScript interface for Ethereum
  - `@tanstack/react-query`: Data synchronization for React applications

This example shows how to integrate Web3Auth with ERC-4337 Account Abstraction standard, allowing users to:

1. Create smart contract wallets instead of EOAs (Externally Owned Accounts)
2. Pay for gas fees in ERC-20 tokens instead of the native token
3. Batch multiple transactions together
4. Enable advanced security features like social recovery
5. Set transaction limits and other security policies

The implementation uses Web3Auth for authentication and the Account Abstraction standard for creating smart contract wallets that enhance the user experience by abstracting away blockchain complexities.

## How to Use

### Download Manually

```bash
npx degit Web3Auth/web3auth-pnp-examples/web/account-abstraction/aa-quick-start w3a-example
```

### Installation

```bash
cd w3a-example
npm install
```

### Run the application

```bash
npm run dev
```

## Important Links

- [Website](https://web3auth.io)
- [Docs](https://web3auth.io/docs)
