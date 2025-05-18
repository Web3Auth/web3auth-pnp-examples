# Web3Auth React Playground

This comprehensive example demonstrates the full capabilities of Web3Auth integration in a React application. It serves as a playground to explore various features and configurations of Web3Auth.

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
cd web3auth-pnp-examples/react-playground
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
- Interactive playground environment
- Multiple authentication methods demonstration
- Multi-chain support and switching
- Customizable UI components
- Advanced configuration options
- Social logins (Google, Facebook, Twitter, etc.)
- Email passwordless login
- Custom JWT authentication
- Multi-factor authentication (MFA)
- Transaction demonstrations
- Smart contract interactions

## Project Structure
- `src/components/`: Reusable UI components
- `src/config/`: Configuration files
- `src/contexts/`: React contexts
- `src/hooks/`: Custom React hooks
- `src/services/`: Web3Auth and blockchain services
- `src/styles/`: CSS and styling
- `src/types/`: TypeScript definitions

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
