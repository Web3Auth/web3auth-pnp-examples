# Web3Auth VanillaJS Quick Start Example (EVM)

This example demonstrates how to integrate Web3Auth into a plain JavaScript application without any framework dependencies. It provides a minimal, yet comprehensive implementation for adding Web3Auth authentication to your vanilla JavaScript dApp.

## Features

- 🔐 Social login with multiple providers (Google, Facebook, Discord, etc.)
- 🌐 Web3Auth Modal UI for seamless authentication
- ⛓️ EVM blockchain integration
- 🔄 Pure JavaScript implementation
- 📱 Responsive and user-friendly interface
- 🎨 Clean and minimal design
- 🚀 Framework-agnostic approach
- 📦 Zero framework dependencies

## Prerequisites

- Node.js 14+ and npm/yarn
- Basic knowledge of JavaScript and Web3
- A Web3Auth account and client ID (get one at [Web3Auth Dashboard](https://dashboard.web3auth.io))
- Basic understanding of DOM manipulation and ES6+ features

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Build Tool**: Vite
- **Web3 Libraries**: 
  - `@web3auth/modal`: Core Web3Auth functionality
  - `@web3auth/base`: Base Web3Auth features
  - `ethers`: Ethereum library
  - `buffer`: Buffer utilities

## Installation

1. Clone the repository:
```bash
npx degit Web3Auth/web3auth-pnp-examples/web/quick-starts/vanillajs-quick-start w3a-example
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
├── index.html       # Main HTML file
├── js/
│   ├── main.js     # Entry point
│   ├── web3auth.js # Web3Auth initialization
│   └── utils.js    # Utility functions
├── css/
│   └── style.css   # Styles
└── assets/         # Static assets
```

## Implementation Guide

### 1. HTML Structure
```html
<!-- src/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web3Auth VanillaJS Example</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container">
        <button id="login-button" style="display: none;">
            Connect Wallet
        </button>
        <div id="wallet-info" style="display: none;">
            <p>Address: <span id="address"></span></p>
            <p>Balance: <span id="balance"></span> ETH</p>
            <div class="transfer-form">
                <input id="recipient" placeholder="Recipient Address">
                <input id="amount" type="number" placeholder="Amount">
                <button id="send-button">Send ETH</button>
            </div>
            <button id="logout-button">Disconnect</button>
        </div>
    </div>
    <script type="module" src="js/main.js"></script>
</body>
</html>
```

### 2. Web3Auth Initialization
```javascript
// src/js/web3auth.js
import { Web3Auth } from '@web3auth/modal'
import { CHAIN_NAMESPACES } from '@web3auth/base'

export class Web3AuthService {
  constructor() {
    this.web3auth = null
    this.provider = null
  }

  async init() {
    this.web3auth = new Web3Auth({
      clientId: import.meta.env.VITE_WEB3AUTH_CLIENT_ID,
      web3AuthNetwork: "testnet",
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0x1",
        rpcTarget: "https://rpc.ankr.com/eth"
      }
    })

    await this.web3auth.initModal()
    return this.web3auth
  }

  async connect() {
    if (!this.web3auth) {
      throw new Error('Web3Auth not initialized')
    }
    this.provider = await this.web3auth.connect()
    return this.provider
  }

  async disconnect() {
    if (!this.web3auth) {
      throw new Error('Web3Auth not initialized')
    }
    await this.web3auth.logout()
    this.provider = null
  }
}
```

### 3. Main Application Logic
```javascript
// src/js/main.js
import { Web3AuthService } from './web3auth'
import { ethers } from 'ethers'

class App {
  constructor() {
    this.web3AuthService = new Web3AuthService()
    this.provider = null
    this.init()
  }

  async init() {
    await this.web3AuthService.init()
    this.setupEventListeners()
    this.updateUI()
  }

  setupEventListeners() {
    document.getElementById('login-button')
      .addEventListener('click', () => this.connect())
    document.getElementById('logout-button')
      .addEventListener('click', () => this.disconnect())
    document.getElementById('send-button')
      .addEventListener('click', () => this.sendTransaction())
  }

  async connect() {
    try {
      this.provider = await this.web3AuthService.connect()
      await this.updateUI()
    } catch (error) {
      console.error('Connection failed:', error)
    }
  }

  async updateUI() {
    const loginButton = document.getElementById('login-button')
    const walletInfo = document.getElementById('wallet-info')

    if (this.provider) {
      loginButton.style.display = 'none'
      walletInfo.style.display = 'block'
      await this.updateWalletInfo()
    } else {
      loginButton.style.display = 'block'
      walletInfo.style.display = 'none'
    }
  }

  async updateWalletInfo() {
    const ethersProvider = new ethers.providers.Web3Provider(this.provider)
    const signer = ethersProvider.getSigner()
    const address = await signer.getAddress()
    const balance = await ethersProvider.getBalance(address)

    document.getElementById('address').textContent = address
    document.getElementById('balance').textContent = 
      ethers.utils.formatEther(balance)
  }

  async sendTransaction() {
    const recipient = document.getElementById('recipient').value
    const amount = document.getElementById('amount').value

    if (!recipient || !amount) return

    try {
      const ethersProvider = new ethers.providers.Web3Provider(this.provider)
      const signer = ethersProvider.getSigner()
      const tx = await signer.sendTransaction({
        to: recipient,
        value: ethers.utils.parseEther(amount)
      })
      await tx.wait()
      await this.updateWalletInfo()
    } catch (error) {
      console.error('Transaction failed:', error)
    }
  }
}

// Initialize the application
new App()
```

## Common Issues and Solutions

1. **Browser Compatibility**
   - Use appropriate polyfills
   - Handle older browser versions
   - Test across different browsers

2. **Provider Management**
   - Handle provider initialization
   - Manage connection state
   - Implement proper error handling

3. **Transaction Issues**
   - Validate input values
   - Handle transaction errors
   - Manage transaction state

## Security Best Practices

- Validate all user inputs
- Implement proper error handling
- Secure storage of sensitive data
- Regular security audits
- Follow Web3Auth security guidelines
- Use HTTPS in production

## Performance Optimization

- Minimize DOM operations
- Use event delegation
- Implement proper error boundaries
- Optimize asset loading
- Use async/await properly

## Resources

- [Web3Auth Documentation](https://web3auth.io/docs)
- [VanillaJS Integration Guide](https://web3auth.io/docs/sdk/pnp/web/modal/)
- [EVM Integration Guide](https://web3auth.io/docs/connect-blockchain/evm)
- [JavaScript MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Web3Auth Dashboard](https://dashboard.web3auth.io)
- [Discord Support](https://discord.gg/web3auth)

## Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

## License

This example is available under the MIT License. See the LICENSE file for more info.
