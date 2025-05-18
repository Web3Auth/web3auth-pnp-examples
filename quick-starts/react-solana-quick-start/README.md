# Web3Auth React Solana Quick Start Example

This example demonstrates how to integrate Web3Auth's Plug and Play Modal SDK with React for Solana blockchain integration. It provides a simple, production-ready starting point for adding Web3Auth authentication to your Solana dApp.

## Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/Web3Auth/web3auth-pnp-examples.git
```

### 2. Navigate to the example
```bash
cd web3auth-pnp-examples/quick-starts/react-solana-quick-start
```

### 3. Install dependencies
```bash
npm install
# or
yarn
```

### 4. Configure environment variables
Create a `.env` file and add your Web3Auth Client ID and Solana configuration:
```bash
VITE_WEB3AUTH_CLIENT_ID=your-client-id
VITE_SOLANA_NETWORK=devnet  # or mainnet-beta
VITE_RPC_URL=your-rpc-url   # Optional custom RPC
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
- Blockchain: Solana
- Solana SDK: `@solana/web3.js`, `@solana/spl-token`
- Package Manager: npm/yarn
- Build Tool: Vite

### Key Features
- Social login with Web3Auth Modal UI
- Solana blockchain integration with `@solana/web3.js`
- Example blockchain interactions:
  - Get user's Solana address
  - Get SOL balance
  - Send SOL transactions
  - SPL token operations
  - Sign messages and transactions
- TypeScript support
- Vite for fast development and building
- Custom React hooks for Solana operations

### Code Structure
```
src/
├── components/     # React components
├── hooks/         # Custom React hooks for Web3Auth and Solana
├── config/        # Configuration files
├── services/      # Blockchain services
└── App.tsx        # Main application component
```

### Web3Auth Configuration
```typescript
const web3AuthConfig = {
  clientId: import.meta.env.VITE_WEB3AUTH_CLIENT_ID,
  web3AuthNetwork: "sapphire_devnet",
  chainConfig: {
    chainNamespace: "solana",
    chainId: "0x1", // Solana Mainnet
    rpcTarget: "https://api.mainnet-beta.solana.com"
  }
};
```

### Solana Integration
```typescript
import { Connection, PublicKey } from '@solana/web3.js';

// Initialize Solana connection
const connection = new Connection(import.meta.env.VITE_RPC_URL);

// Get SOL balance
const getBalance = async (address: string) => {
  const pubKey = new PublicKey(address);
  const balance = await connection.getBalance(pubKey);
  return balance / 1e9; // Convert lamports to SOL
};
```

## Security Considerations
- Keep your Web3Auth Client ID secure and never commit it to version control
- Implement proper error handling for authentication and blockchain interactions
- Follow Solana security best practices when handling transactions
- Consider implementing rate limiting for authentication attempts
- Validate all user inputs and transaction parameters
- Use environment variables for sensitive configuration
- Handle Solana RPC rate limits appropriately
- Verify transaction signatures and confirmations

## Support and Feedback
- [Discord](https://discord.gg/web3auth)
- [GitHub Issues](https://github.com/Web3Auth/web3auth-pnp-examples/issues)
- [Documentation](https://web3auth.io/docs/connect-blockchain/solana)

## License
MIT
