# Web3Auth Vue.js Quick Start Example (EVM)

This example demonstrates how to integrate Web3Auth into a Vue.js application for Ethereum Virtual Machine (EVM) based blockchains. It provides a simple, yet comprehensive starting point for adding Web3Auth authentication to your Vue.js dApp.

## Features

- 🔐 Social login with multiple providers (Google, Facebook, Discord, etc.)
- 🌐 Web3Auth Modal UI for seamless authentication
- ⛓️ EVM blockchain integration
- 🔄 Vue.js composables for blockchain interactions
- 📱 Responsive and user-friendly interface
- 🎨 Vue 3 Composition API support

## Prerequisites

- Node.js 14+ and npm/yarn
- Basic knowledge of Vue.js and Web3
- A Web3Auth account and client ID (get one at [Web3Auth Dashboard](https://dashboard.web3auth.io))

## Tech Stack

- **Frontend**: Vue.js 3 with TypeScript
- **Build Tool**: Vite
- **State Management**: Vue.js Composition API
- **Web3 Libraries**: 
  - `@web3auth/modal`: Core Web3Auth functionality with Modal UI
  - `@wagmi/vue`: Vue.js hooks for Ethereum
  - `@tanstack/vue-query`: Data synchronization
  - `ethers`: Ethereum library for blockchain interactions
  - `vue-demi`: Vue 2/3 compatibility layer

## Installation

1. Clone the repository:
```bash
npx degit Web3Auth/web3auth-pnp-examples/web/quick-starts/vue-quick-start w3a-example
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
├── components/     # Vue components
├── composables/    # Vue composables
├── config/        # Configuration files
├── services/      # Web3Auth and blockchain services
├── types/         # TypeScript definitions
└── App.vue        # Main application component
```

## Implementation Guide

### 1. Web3Auth Configuration
```typescript
// src/config/web3AuthConfig.ts
import { Web3Auth } from '@web3auth/modal'
import { CHAIN_NAMESPACES } from '@web3auth/base'

export const web3auth = new Web3Auth({
  clientId: import.meta.env.VITE_WEB3AUTH_CLIENT_ID,
  web3AuthNetwork: "testnet",
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x1", // Ethereum mainnet
    rpcTarget: "https://rpc.ankr.com/eth"
  }
})
```

### 2. Create Web3Auth Composable
```typescript
// src/composables/useWeb3Auth.ts
import { ref } from 'vue'
import { web3auth } from '@/config/web3AuthConfig'

export function useWeb3Auth() {
  const isAuthenticated = ref(false)
  const provider = ref(null)

  async function login() {
    try {
      provider.value = await web3auth.connect()
      isAuthenticated.value = true
    } catch (error) {
      console.error('Error during login:', error)
    }
  }

  async function logout() {
    try {
      await web3auth.logout()
      provider.value = null
      isAuthenticated.value = false
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  return {
    isAuthenticated,
    provider,
    login,
    logout
  }
}
```

### 3. Use in Components
```vue
<template>
  <div>
    <button v-if="!isAuthenticated" @click="login">Login</button>
    <button v-else @click="logout">Logout</button>
    
    <div v-if="isAuthenticated">
      <p>Address: {{ address }}</p>
      <p>Balance: {{ balance }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWeb3Auth } from '@/composables/useWeb3Auth'
import { ref, onMounted } from 'vue'

const { isAuthenticated, provider, login, logout } = useWeb3Auth()
const address = ref('')
const balance = ref('')

onMounted(async () => {
  if (provider.value) {
    // Initialize blockchain interactions
  }
})
</script>
```

## Common Issues and Solutions

1. **Vue.js Version Compatibility**
   - Ensure Vue.js version matches the requirements
   - Check Vue Router configuration
   - Verify Composition API usage

2. **Web3Auth Integration**
   - Verify client ID configuration
   - Check network settings
   - Handle authentication errors properly

3. **Blockchain Interactions**
   - Validate provider connection
   - Handle transaction errors
   - Implement proper error boundaries

## Security Best Practices

- Never commit your `.env` file
- Implement proper error handling
- Validate all user inputs
- Handle authentication state securely
- Regular security audits
- Follow Vue.js security guidelines

## Resources

- [Web3Auth Documentation](https://web3auth.io/docs)
- [Vue.js Integration Guide](https://web3auth.io/docs/sdk/pnp/web/modal/)
- [EVM Integration Guide](https://web3auth.io/docs/connect-blockchain/evm)
- [Vue.js Documentation](https://vuejs.org/)
- [Web3Auth Dashboard](https://dashboard.web3auth.io)
- [Discord Support](https://discord.gg/web3auth)

## Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

## License

This example is available under the MIT License. See the LICENSE file for more info.
