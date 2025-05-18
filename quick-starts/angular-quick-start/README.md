# Web3Auth Angular Quick Start Example (EVM)

This example demonstrates how to integrate Web3Auth into an Angular application for Ethereum Virtual Machine (EVM) based blockchains. It provides a comprehensive starting point for adding Web3Auth authentication to your Angular dApp.

## Features

- 🔐 Social login with multiple providers (Google, Facebook, Discord, etc.)
- 🌐 Web3Auth Modal UI for seamless authentication
- ⛓️ EVM blockchain integration
- 🔄 Angular services for blockchain interactions
- 📱 Responsive and user-friendly interface
- 🎨 Modern Angular patterns and best practices
- 🔧 Dependency injection for Web3Auth services
- 📦 Modular architecture

## Prerequisites

- Node.js 14+ and npm/yarn
- Basic knowledge of Angular and Web3
- A Web3Auth account and client ID (get one at [Web3Auth Dashboard](https://dashboard.web3auth.io))
- Angular CLI installed globally (`npm install -g @angular/cli`)

## Tech Stack

- **Frontend**: Angular 15+ with TypeScript
- **Build Tool**: Angular CLI
- **State Management**: Angular Services + RxJS
- **Web3 Libraries**: 
  - `@web3auth/modal`: Core Web3Auth functionality
  - `ethers`: Ethereum JavaScript library
  - `viem`: TypeScript interface for Ethereum
  - `rxjs`: Reactive Extensions Library

## Installation

1. Clone the repository:
```bash
npx degit Web3Auth/web3auth-pnp-examples/web/quick-starts/angular-quick-start w3a-example
```

2. Install dependencies:
```bash
cd w3a-example
npm install
```

3. Configure environment variables:
   - Create `src/environments/environment.ts` and `environment.prod.ts`
   - Add your Web3Auth client ID and configuration:
   ```typescript
   export const environment = {
     production: false, // true for prod
     web3AuthClientId: 'your-client-id',
     chainConfig: {
       chainId: '0x1', // Ethereum mainnet
       rpcTarget: 'https://rpc.ankr.com/eth'
     }
   };
   ```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── app/
│   ├── components/     # Angular components
│   ├── services/       # Angular services
│   │   ├── web3-auth/  # Web3Auth service
│   │   └── blockchain/ # Blockchain services
│   ├── models/        # TypeScript interfaces
│   └── app.module.ts  # Main module
├── environments/      # Environment configuration
├── assets/           # Static assets
└── index.html        # Entry HTML
```

## Implementation Guide

### 1. Web3Auth Service
```typescript
// src/app/services/web3-auth/web3-auth.service.ts
import { Injectable } from '@angular/core';
import { Web3Auth } from '@web3auth/modal';
import { CHAIN_NAMESPACES } from '@web3auth/base';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Web3AuthService {
  private web3auth: Web3Auth | null = null;
  private provider$ = new BehaviorSubject<any>(null);

  constructor() {
    this.initWeb3Auth();
  }

  private async initWeb3Auth() {
    this.web3auth = new Web3Auth({
      clientId: environment.web3AuthClientId,
      web3AuthNetwork: "testnet",
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: environment.chainConfig.chainId,
        rpcTarget: environment.chainConfig.rpcTarget
      }
    });

    await this.web3auth.initModal();
  }

  async login() {
    if (!this.web3auth) {
      throw new Error('Web3Auth not initialized');
    }
    const provider = await this.web3auth.connect();
    this.provider$.next(provider);
  }

  async logout() {
    if (!this.web3auth) {
      throw new Error('Web3Auth not initialized');
    }
    await this.web3auth.logout();
    this.provider$.next(null);
  }

  getProvider() {
    return this.provider$.asObservable();
  }
}
```

### 2. Blockchain Service
```typescript
// src/app/services/blockchain/blockchain.service.ts
import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { Web3AuthService } from '../web3-auth/web3-auth.service';

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {
  private provider: any;

  constructor(private web3AuthService: Web3AuthService) {
    this.web3AuthService.getProvider().subscribe(provider => {
      this.provider = provider;
    });
  }

  async getBalance(address: string): Promise<string> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }
    const ethersProvider = new ethers.providers.Web3Provider(this.provider);
    const balance = await ethersProvider.getBalance(address);
    return ethers.utils.formatEther(balance);
  }

  async sendTransaction(to: string, amount: string) {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }
    const ethersProvider = new ethers.providers.Web3Provider(this.provider);
    const signer = ethersProvider.getSigner();
    const tx = await signer.sendTransaction({
      to,
      value: ethers.utils.parseEther(amount)
    });
    return tx;
  }
}
```

### 3. Component Implementation
```typescript
// src/app/components/wallet/wallet.component.ts
import { Component, OnInit } from '@angular/core';
import { Web3AuthService } from '../../services/web3-auth/web3-auth.service';
import { BlockchainService } from '../../services/blockchain/blockchain.service';

@Component({
  selector: 'app-wallet',
  template: `
    <div class="wallet-container">
      <button *ngIf="!isConnected" (click)="connect()">
        Connect Wallet
      </button>
      <div *ngIf="isConnected" class="wallet-info">
        <p>Balance: {{ balance }} ETH</p>
        <div class="transfer-form">
          <input [(ngModel)]="recipientAddress" placeholder="Recipient Address">
          <input [(ngModel)]="amount" type="number" placeholder="Amount">
          <button (click)="sendTransaction()">Send ETH</button>
        </div>
      </div>
    </div>
  `
})
export class WalletComponent implements OnInit {
  isConnected = false;
  balance = '0';
  recipientAddress = '';
  amount = '';

  constructor(
    private web3AuthService: Web3AuthService,
    private blockchainService: BlockchainService
  ) {}

  async connect() {
    try {
      await this.web3AuthService.login();
      this.isConnected = true;
      this.updateBalance();
    } catch (error) {
      console.error('Connection failed:', error);
    }
  }

  async updateBalance() {
    try {
      const address = await this.getAddress();
      this.balance = await this.blockchainService.getBalance(address);
    } catch (error) {
      console.error('Failed to get balance:', error);
    }
  }

  async sendTransaction() {
    if (!this.recipientAddress || !this.amount) return;
    try {
      await this.blockchainService.sendTransaction(
        this.recipientAddress,
        this.amount
      );
      await this.updateBalance();
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  }
}
```

## Common Issues and Solutions

1. **Angular Integration**
   - Handle async operations properly with RxJS
   - Manage component lifecycle correctly
   - Implement proper error boundaries

2. **Provider Management**
   - Handle provider initialization
   - Manage provider state changes
   - Implement proper cleanup

3. **Transaction Issues**
   - Handle gas estimation
   - Implement proper error handling
   - Manage transaction state

## Security Best Practices

- Use Angular's built-in XSS protection
- Implement proper error handling
- Validate all user inputs
- Handle authentication state securely
- Regular security audits
- Follow Angular security guidelines

## Performance Optimization

- Use Angular's ChangeDetectionStrategy
- Implement proper RxJS operators
- Optimize Web3Auth initialization
- Use lazy loading for modules
- Implement proper caching strategies

## Resources

- [Web3Auth Documentation](https://web3auth.io/docs)
- [Angular Integration Guide](https://web3auth.io/docs/sdk/pnp/web/modal/)
- [EVM Integration Guide](https://web3auth.io/docs/connect-blockchain/evm)
- [Angular Documentation](https://angular.io/docs)
- [Web3Auth Dashboard](https://dashboard.web3auth.io)
- [Discord Support](https://discord.gg/web3auth)

## Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

## License

This example is available under the MIT License. See the LICENSE file for more info.
