# Web3Auth Tezos Integration Example

This example demonstrates how to integrate Web3Auth's Plug and Play Modal SDK with React for Tezos blockchain integration. It provides a simple, production-ready starting point for adding Web3Auth authentication to your Tezos dApp.

## Prerequisites
- Node.js 14+
- npm/yarn
- A Web3Auth Client ID (get one from [Web3Auth Dashboard](https://dashboard.web3auth.io))

## Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/Web3Auth/web3auth-pnp-examples.git
```

### 2. Navigate to the example
```bash
cd web3auth-pnp-examples/other/tezos-example
```

### 3. Install dependencies
```bash
npm install
# or
yarn
```

### 4. Configure environment variables
Create a `.env` file and add your Web3Auth Client ID:
```bash
VITE_WEB3AUTH_CLIENT_ID=your-client-id
```

### 5. Run the application
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:5173` in your browser to see the application running.

## Features
- Social login with Web3Auth Modal UI
- Tezos blockchain integration
- Get user's Tezos address
- Get XTZ balance
- Send XTZ transactions
- Interact with Tezos smart contracts
- Support for FA1.2 and FA2 tokens
- Sign messages and transactions

## Project Structure
- `src/components/`: React components
- `src/config/`: Configuration files
- `src/services/`: Web3Auth and Tezos services

## Important Links
- [Website](https://web3auth.io)
- [Documentation](https://web3auth.io/docs)
- [Guides](https://web3auth.io/docs/guides)
- [SDK / API References](https://web3auth.io/docs/sdk)
- [Pricing](https://web3auth.io/pricing.html)
- [Support](https://discord.gg/web3auth)
- [Tezos Documentation](https://tezos.com/developers/)

## Support and Feedback
- [Discord](https://discord.gg/web3auth)
- [GitHub Issues](https://github.com/Web3Auth/web3auth-pnp-examples/issues)
- [Documentation](https://web3auth.io/docs/connect-blockchain/tezos)

## License
MIT
