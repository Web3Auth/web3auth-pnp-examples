# Web3Auth (`@web3auth/modal`) with React and Bitcoin

This example demonstrates how to use Web3Auth without a modal UI for connecting to the Bitcoin blockchain.

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **Web3 Libraries**: 
  - `@web3auth/modal`: Core Web3Auth functionality without UI (headless)
  - `bitcoinjs-lib`: Bitcoin JavaScript library
  - `ecpair`: Library for Bitcoin cryptographic key pairs
  - `@bitcoinerlab/secp256k1`: Implementation of secp256k1 curve used in Bitcoin
  - `axios`: HTTP client for making API requests to Bitcoin services
- **Additional Polyfills**: Various browser polyfills for compatibility with Node.js crypto libraries

This example shows how to integrate Web3Auth's no-modal SDK into a React application for interacting with the Bitcoin blockchain. It demonstrates how to create a Bitcoin wallet, check balances, and perform transactions on the Bitcoin network after authenticating with Web3Auth. It uses the headless (no UI) version of Web3Auth for custom UI implementations.

## How to Use

### Download Manually

```bash
npx degit Web3Auth/web3auth-pnp-examples/web/other/bitcoin-example w3a-example
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
