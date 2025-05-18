# Web3Auth Vue.js Solana Quick Start Example

This example demonstrates how to integrate Web3Auth with Solana blockchain in a Vue.js application, enabling secure wallet creation and Solana network interactions using Vue.js's reactive capabilities.

## Features

- 🔐 Social login with multiple providers (Google, Facebook, Discord, etc.)
- 🌐 Web3Auth Modal UI for seamless authentication
- ⛓️ Solana blockchain integration
- 💰 SOL token management
- 🔑 SPL token support
- 📝 Transaction signing
- 🔄 Vue.js composables for blockchain interactions
- 📱 Responsive and user-friendly interface
- 🎨 Vue 3 Composition API support

## Prerequisites

- Node.js 14+ and npm/yarn
- Basic knowledge of Vue.js and Solana
- A Web3Auth account and client ID (get one at [Web3Auth Dashboard](https://dashboard.web3auth.io))
- Basic understanding of Solana concepts (accounts, programs, SOL, SPL tokens)

## Tech Stack

- **Frontend**: Vue.js 3 with TypeScript
- **Build Tool**: Vite
- **State Management**: Vue.js Composition API
- **Web3 Libraries**: 
  - `@web3auth/modal`: Core Web3Auth functionality
  - `@solana/web3.js`: Solana JavaScript API
  - `@solana/spl-token`: SPL Token functionality
  - `bs58`: Base58 encoding/decoding
  - `vue-demi`: Vue 2/3 compatibility layer

## Installation

1. Clone the repository:
```bash
npx degit Web3Auth/web3auth-pnp-examples/web/quick-starts/vue-solana-quick-start w3a-example
```

2. Install dependencies:
```bash
cd w3a-example
npm install
```

3. Configure environment variables:
   - Create a `.env` file in the root directory
   - Add your Web3Auth client ID and Solana configuration:
   ```
   VITE_WEB3AUTH_CLIENT_ID=your-client-id
   VITE_SOLANA_NETWORK=devnet  # or mainnet-beta
   VITE_RPC_URL=your-rpc-url   # Optional custom RPC
   ```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/     # Vue components
├── composables/    # Vue composables
│   ├── useWeb3Auth.ts     # Web3Auth integration
│   ├── useSolana.ts       # Solana operations
│   └── useSPLToken.ts     # SPL token operations
├── config/        # Configuration files
├── services/      # Blockchain services
├── types/         # TypeScript definitions
└── App.vue        # Main application component
```

## Implementation Guide

### 1. Web3Auth Configuration with Solana
```typescript
// src/config/web3AuthConfig.ts
import { Web3Auth } from '@web3auth/modal'
import { CHAIN_NAMESPACES } from '@web3auth/base'

export const web3auth = new Web3Auth({
  clientId: import.meta.env.VITE_WEB3AUTH_CLIENT_ID,
  web3AuthNetwork: "testnet",
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.SOLANA,
    chainId: "0x1", // Mainnet
    rpcTarget: "https://api.mainnet-beta.solana.com"
  }
})
```

### 2. Create Solana Composable
```typescript
// src/composables/useSolana.ts
import { ref, computed } from 'vue'
import { Connection, PublicKey, Transaction } from '@solana/web3.js'
import { useWeb3Auth } from './useWeb3Auth'

export function useSolana() {
  const { provider } = useWeb3Auth()
  const connection = new Connection(import.meta.env.VITE_RPC_URL)
  const balance = ref(0)

  async function getBalance(address: string) {
    try {
      const pubKey = new PublicKey(address)
      balance.value = await connection.getBalance(pubKey)
    } catch (error) {
      console.error('Error getting balance:', error)
    }
  }

  async function sendTransaction(to: string, amount: number) {
    try {
      // Implementation for sending SOL
    } catch (error) {
      console.error('Error sending transaction:', error)
    }
  }

  return {
    balance,
    getBalance,
    sendTransaction
  }
}
```

### 3. Use in Components
```vue
<template>
  <div>
    <button v-if="!isAuthenticated" @click="login">Connect Wallet</button>
    <div v-else>
      <p>SOL Balance: {{ formatBalance(balance) }}</p>
      <div class="transfer-form">
        <input v-model="recipient" placeholder="Recipient address" />
        <input v-model="amount" type="number" placeholder="Amount" />
        <button @click="handleTransfer">Send SOL</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useWeb3Auth } from '@/composables/useWeb3Auth'
import { useSolana } from '@/composables/useSolana'

const { isAuthenticated, login } = useWeb3Auth()
const { balance, sendTransaction } = useSolana()
const recipient = ref('')
const amount = ref(0)

const handleTransfer = () => {
  if (recipient.value && amount.value) {
    sendTransaction(recipient.value, amount.value)
  }
}
</script>
```

## Common Issues and Solutions

1. **Solana Network Issues**
   - Verify RPC endpoint availability
   - Handle rate limiting appropriately
   - Check network status (devnet/testnet/mainnet)

2. **Transaction Issues**
   - Ensure sufficient SOL for fees
   - Validate address formats
   - Handle transaction timeouts

3. **Integration Issues**
   - Check Web3Auth network configuration
   - Verify Solana connection settings
   - Handle provider initialization properly

## Security Best Practices

- Never expose private keys
- Validate all input addresses
- Implement proper error handling
- Handle transaction signing securely
- Regular security audits
- Follow Solana security guidelines

## Resources

- [Web3Auth Documentation](https://web3auth.io/docs)
- [Vue.js Integration Guide](https://web3auth.io/docs/sdk/pnp/web/modal/)
- [Solana Integration Guide](https://web3auth.io/docs/connect-blockchain/solana)
- [Solana Documentation](https://docs.solana.com)
- [Vue.js Documentation](https://vuejs.org/)
- [Web3Auth Dashboard](https://dashboard.web3auth.io)
- [Discord Support](https://discord.gg/web3auth)

## Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

## License

This example is available under the MIT License. See the LICENSE file for more info.
