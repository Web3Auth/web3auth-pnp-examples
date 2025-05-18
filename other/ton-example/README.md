# Web3Auth TON Integration Example

This example demonstrates how to integrate Web3Auth's Plug and Play Modal SDK with React for TON (The Open Network) blockchain integration. It provides a simple, production-ready starting point for adding Web3Auth authentication to your TON dApp.

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
cd web3auth-pnp-examples/other/ton-example
```

### 3. Install dependencies
```bash
npm install
# or
yarn
```

### 4. Configure environment variables
Create a `.env` file and add your Web3Auth Client ID and TON configuration:
```bash
VITE_WEB3AUTH_CLIENT_ID=your-client-id
VITE_TON_NETWORK=mainnet  # or testnet
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
- TON blockchain integration
- Toncoin management
- Smart contract interactions
- Transaction signing
- Account management
- Get user's TON address
- Get Toncoin balance
- Send Toncoin transactions
- Deploy and interact with TON smart contracts

## Project Structure
- `src/components/`: React components
- `src/hooks/`: Custom React hooks for Web3Auth and TON
- `src/config/`: Configuration files
- `src/contracts/`: Smart contract sources
- `src/services/`: Blockchain services
- `src/types/`: TypeScript definitions

## Important Links
- [Website](https://web3auth.io)
- [Documentation](https://web3auth.io/docs)
- [Guides](https://web3auth.io/docs/guides)
- [SDK / API References](https://web3auth.io/docs/sdk)
- [Pricing](https://web3auth.io/pricing.html)
- [Support](https://discord.gg/web3auth)
- [TON Documentation](https://docs.ton.org)

## Support and Feedback
- [Discord](https://discord.gg/web3auth)
- [GitHub Issues](https://github.com/Web3Auth/web3auth-pnp-examples/issues)
- [Documentation](https://web3auth.io/docs/connect-blockchain)

## License
MIT
