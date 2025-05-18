# Web3Auth React Quick Start Example

This example demonstrates how to integrate Web3Auth's Plug and Play Modal SDK with React for EVM (Ethereum Virtual Machine) integration. It provides a simple, production-ready starting point for adding Web3Auth authentication to your React application.

## Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/Web3Auth/web3auth-pnp-examples.git
```

### 2. Navigate to the example
```bash
cd web3auth-pnp-examples/quick-starts/react-quick-start
```

### 3. Install dependencies
```bash
npm install
# or
yarn
```

### 4. Configure environment variables
Create a `.env` file and add your Web3Auth Client ID (get one from [Web3Auth Dashboard](https://dashboard.web3auth.io))
```bash
VITE_WEB3AUTH_CLIENT_ID=your-client-id
```

### 5. Run the application
```bash
npm run dev
# or
yarn dev
```

## Important Links
- [Website](https://web3auth.io)
- [Documentation](https://web3auth.io/docs)
- [Guides](https://web3auth.io/docs/guides)
- [SDK / API References](https://web3auth.io/docs/sdk)
- [Pricing](https://web3auth.io/pricing.html)
- [Support](https://discord.gg/web3auth)

## Technical Details

### Stack
- Framework: React 18+
- Web3Auth SDK: `@web3auth/modal@7.x`
- Blockchain: EVM (Ethereum, Polygon, etc.)
- Package Manager: npm/yarn
- Build Tool: Vite

### Key Features
- Social login with Web3Auth Modal UI
- EVM blockchain integration with ethers.js
- Example blockchain interactions:
  - Get user's Ethereum address
  - Get user's ETH balance
  - Sign messages
  - Send transactions
  - Connect to smart contracts
- TypeScript support
- Vite for fast development and building

### Code Structure
```
src/
├── components/     # React components
├── config/        # Configuration files
├── services/      # Web3Auth and blockchain services
└── App.tsx        # Main application component
```

### Web3Auth Configuration
```typescript
const web3AuthConfig = {
  clientId: import.meta.env.VITE_WEB3AUTH_CLIENT_ID,
  web3AuthNetwork: "sapphire_devnet",
  chainConfig: {
    chainNamespace: "eip155",
    chainId: "0x1", // Ethereum Mainnet
    rpcTarget: "https://rpc.ankr.com/eth"
  }
};
```

## Security Considerations
- Keep your Web3Auth Client ID secure and never commit it to version control
- Implement proper error handling for authentication and blockchain interactions
- Follow blockchain security best practices when handling transactions
- Consider implementing rate limiting for authentication attempts
- Validate all user inputs and transaction parameters
- Use environment variables for sensitive configuration

## Support and Feedback
- [Discord](https://discord.gg/web3auth)
- [GitHub Issues](https://github.com/Web3Auth/web3auth-pnp-examples/issues)
- [Documentation](https://web3auth.io/docs/connect-blockchain/evm)

## License
MIT
