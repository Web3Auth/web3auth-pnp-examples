# Web3Auth VanillaJS Quick Start Example

This example demonstrates how to integrate Web3Auth's Plug and Play Modal SDK with plain JavaScript without any framework dependencies. It provides a simple, production-ready starting point for adding Web3Auth authentication to your vanilla JavaScript application.

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
cd web3auth-pnp-examples/quick-starts/vanillajs-quick-start
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
- EVM blockchain integration (Ethereum, Polygon, etc.)
- Pure JavaScript implementation with no framework dependencies
- User wallet management
- Basic blockchain interactions
- Send and receive transactions
- Get user's Ethereum address and balance

## Project Structure
- `src/index.html`: Main HTML file
- `src/js/`: JavaScript files
- `src/css/`: Stylesheet files
- `src/assets/`: Static assets

## Important Links
- [Website](https://web3auth.io)
- [Documentation](https://web3auth.io/docs)
- [Guides](https://web3auth.io/docs/guides)
- [SDK / API References](https://web3auth.io/docs/sdk)
- [Pricing](https://web3auth.io/pricing.html)
- [Support](https://discord.gg/web3auth)

## Support and Feedback
- [Discord](https://discord.gg/web3auth)
- [GitHub Issues](https://github.com/Web3Auth/web3auth-pnp-examples/issues)
- [Documentation](https://web3auth.io/docs/connect-blockchain/evm)

## License
MIT
