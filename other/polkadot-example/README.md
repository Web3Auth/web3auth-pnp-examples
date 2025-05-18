# Web3Auth (`@web3auth/no-modal`) with React and Polkadot

This example demonstrates how to use Web3Auth with React for connecting to the Polkadot blockchain ecosystem.

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **Web3 Libraries**: 
  - `@web3auth/no-modal`: Core Web3Auth functionality without UI (headless)
  - `@polkadot/api`: JavaScript API for Polkadot and Substrate-based chains
  - `@polkadot/util`: Utility functions for Polkadot
  - `@polkadot/util-crypto`: Cryptographic utilities for Polkadot
- **Additional Polyfills**: Various browser polyfills for compatibility with Node.js crypto libraries

This example shows how to integrate Web3Auth's no-modal SDK into a React application for interacting with the Polkadot ecosystem. It demonstrates how to:

1. Authenticate users with Web3Auth
2. Generate Polkadot compatible key pairs
3. Connect to Polkadot networks (mainnet, testnet, or parachains)
4. Check balances and account information
5. Execute transactions and interact with smart contracts

The example provides a foundation for building decentralized applications on Polkadot with a seamless authentication experience.

## How to Use

### Download Manually

```bash
npx degit Web3Auth/web3auth-pnp-examples/web/other/polkadot-example w3a-example
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
