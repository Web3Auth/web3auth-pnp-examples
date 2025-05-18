# Web3Auth React Quick Start Example (EVM)

This example demonstrates how to integrate Web3Auth into a React application for Ethereum Virtual Machine (EVM) based blockchains. It provides a simple, yet comprehensive starting point for adding Web3Auth authentication to your React dApp.

## Features

- 🔐 Social login with multiple providers (Google, Facebook, Discord, etc.)
- 🌐 Web3Auth Modal UI for seamless authentication
- ⛓️ EVM blockchain integration
- 🔄 React hooks for blockchain interactions
- 📱 Responsive and user-friendly interface

## Prerequisites

- Node.js 14+ and npm/yarn
- Basic knowledge of React and Web3
- A Web3Auth account and client ID (get one at [Web3Auth Dashboard](https://dashboard.web3auth.io))

## Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Web3 Libraries**: 
  - `@web3auth/modal`: Core Web3Auth functionality with Modal UI
  - `wagmi`: React hooks for Ethereum
  - `@tanstack/react-query`: Data synchronization
  - `ethers`: Ethereum library for blockchain interactions

## Installation

1. Clone the repository:
```bash
npx degit Web3Auth/web3auth-pnp-examples/web/quick-starts/react-quick-start w3a-example
```

2. Install dependencies:
```bash
cd w3a-example
npm install
```

3. Configure environment variables:
   - Create a `.env` file in the root directory
   - Add your Web3Auth client ID:
   ```
   VITE_WEB3AUTH_CLIENT_ID=your-client-id
   ```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/     # React components
├── config/        # Configuration files
├── hooks/         # Custom React hooks
├── services/      # Web3Auth and blockchain services
└── App.tsx        # Main application component
```

## Key Features Implementation

### 1. Web3Auth Initialization
```typescript
const web3auth = new Web3Auth({
  clientId: import.meta.env.VITE_WEB3AUTH_CLIENT_ID,
  web3AuthNetwork: "testnet",
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x1", // Ethereum mainnet
    rpcTarget: "https://rpc.ankr.com/eth"
  }
});
```

### 2. Social Login Integration
The example demonstrates how to implement social login with various providers:
- Google
- Facebook
- Twitter
- Discord
- GitHub
- Email passwordless

### 3. Blockchain Interactions
Examples of basic blockchain interactions are included:
- Get user's address and balance
- Send transactions
- Sign messages
- Connect to smart contracts

## Customization

1. **Chain Configuration**: Modify `chainConfig` in `src/config/web3AuthConfig.ts` to connect to different EVM chains
2. **UI Customization**: Update the Modal UI theme in `src/config/web3AuthConfig.ts`
3. **RPC Configuration**: Change RPC endpoints in the chain configuration

## Common Issues and Solutions

1. **Invalid Client ID**: Ensure you've added the correct Web3Auth client ID in your `.env` file
2. **Network Issues**: Check if you're using the correct RPC endpoint for your chosen network
3. **Initialization Errors**: Make sure Web3Auth is properly initialized before use

## Security Considerations

- Never commit your `.env` file or expose your client ID
- Implement proper error handling for failed authentication
- Validate all blockchain transactions before sending
- Consider implementing rate limiting for authentication attempts

## Resources

- [Web3Auth Documentation](https://web3auth.io/docs)
- [React Integration Guide](https://web3auth.io/docs/sdk/pnp/web/modal/)
- [EVM Integration Guide](https://web3auth.io/docs/connect-blockchain/evm)
- [Web3Auth Dashboard](https://dashboard.web3auth.io)
- [Discord Support](https://discord.gg/web3auth)

## Contributing

Feel free to submit issues and enhancement requests!

## License

This example is available under the MIT License. See the LICENSE file for more info.
