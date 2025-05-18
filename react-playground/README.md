# Web3Auth React Playground

This comprehensive example demonstrates the full capabilities of Web3Auth integration in a React application. It serves as a playground to explore various features and configurations of Web3Auth.

## Features

- 🎮 Interactive playground environment
- 🔐 Multiple authentication methods demonstration
- ⛓️ Multi-chain support and switching
- 🎨 Customizable UI components
- 🔧 Advanced configuration options
- 📱 Responsive design patterns

## Prerequisites

- Node.js 14+ and npm/yarn
- Basic knowledge of React and Web3
- A Web3Auth account and client ID (get one at [Web3Auth Dashboard](https://dashboard.web3auth.io))

## Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite
- **State Management**: React Context API
- **Web3 Libraries**: 
  - `@web3auth/modal`: Core Web3Auth functionality
  - `@web3auth/base`: Base Web3Auth features
  - `ethers`: Ethereum library
  - Multiple blockchain providers

## Installation

1. Clone the repository:
```bash
npx degit Web3Auth/web3auth-pnp-examples/web/react-playground w3a-example
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

## Playground Features

### 1. Authentication Methods
- Social logins (Google, Facebook, Twitter, etc.)
- Email passwordless login
- Custom JWT authentication
- Multi-factor authentication (MFA)

### 2. Blockchain Interactions
- Multiple chain support (Ethereum, Polygon, Solana, etc.)
- Chain switching functionality
- Transaction demonstrations
- Smart contract interactions

### 3. UI Components
- Customizable login modal
- User profile management
- Wallet information display
- Transaction history

### 4. Advanced Features
- Custom authentication flows
- Private key management
- Network configuration
- Error handling patterns

## Project Structure

```
src/
├── components/          # Reusable UI components
├── config/             # Configuration files
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── services/           # Web3Auth and blockchain services
├── styles/             # CSS and styling
├── types/              # TypeScript definitions
└── App.tsx            # Main application component
```

## Customization Guide

### 1. Authentication Configuration
```typescript
const web3auth = new Web3Auth({
  clientId: import.meta.env.VITE_WEB3AUTH_CLIENT_ID,
  web3AuthNetwork: "testnet",
  chainConfig: {
    // Customize chain configuration
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x1",
    rpcTarget: "https://rpc.ankr.com/eth"
  },
  // Add custom authentication parameters
  authMode: "DAPP",
  uiConfig: {
    // Customize UI theme
    theme: "dark",
    loginMethodsOrder: ["google", "facebook"]
  }
});
```

### 2. Chain Configuration
Modify the chain settings in `src/config/chainConfig.ts`:
```typescript
export const chains = {
  ethereum: {
    chainId: "0x1",
    rpcTarget: "https://rpc.ankr.com/eth",
    // Add more chain-specific settings
  },
  // Add more chains
};
```

## Common Issues and Solutions

1. **Authentication Flow Issues**
   - Verify correct client ID configuration
   - Check browser console for detailed errors
   - Ensure proper network connectivity

2. **Chain Connection Problems**
   - Validate RPC endpoint availability
   - Check chain configuration parameters
   - Verify network compatibility

3. **UI Customization**
   - Review theme configuration
   - Check CSS overrides
   - Verify responsive design settings

## Security Best Practices

- Implement proper key management
- Use environment variables for sensitive data
- Add appropriate error boundaries
- Implement proper session management
- Regular security audits

## Resources

- [Web3Auth Documentation](https://web3auth.io/docs)
- [React Integration Guide](https://web3auth.io/docs/sdk/pnp/web/modal/)
- [API Reference](https://web3auth.io/docs/sdk/pnp/web/modal/#api-reference)
- [Web3Auth Dashboard](https://dashboard.web3auth.io)
- [Discord Support](https://discord.gg/web3auth)

## Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

## License

This example is available under the MIT License. See the LICENSE file for more info.
