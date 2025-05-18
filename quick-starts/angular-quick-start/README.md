# Web3Auth Angular Quick Start Example

This example demonstrates how to integrate Web3Auth's Plug and Play Modal SDK with Angular for EVM (Ethereum Virtual Machine) integration. It provides a simple, production-ready starting point for adding Web3Auth authentication to your Angular application.

## Prerequisites
- Node.js 14+
- npm/yarn
- Angular CLI
- A Web3Auth Client ID (get one from [Web3Auth Dashboard](https://dashboard.web3auth.io))

## Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/Web3Auth/web3auth-pnp-examples.git
```

### 2. Navigate to the example
```bash
cd web3auth-pnp-examples/quick-starts/angular-quick-start
```

### 3. Install dependencies
```bash
npm install
# or
yarn
```

### 4. Configure environment variables
Create or modify `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  web3AuthClientId: 'your-client-id'
};
```

### 5. Run the application
```bash
npm run start
# or
ng serve
```

Visit `http://localhost:4200` in your browser to see the application running.

## Features
- Social login with Web3Auth Modal UI
- EVM blockchain integration (Ethereum, Polygon, etc.)
- Angular services for Web3Auth integration
- User wallet management
- Basic blockchain interactions
- Reactive state management with RxJS
- Dependency injection for Web3Auth services
- Modular architecture

## Project Structure
- `src/app/components/`: Angular components
- `src/app/services/`: Angular services for Web3Auth and blockchain
- `src/app/models/`: TypeScript interfaces
- `src/environments/`: Environment configuration

## Important Links
- [Website](https://web3auth.io)
- [Documentation](https://web3auth.io/docs)
- [Guides](https://web3auth.io/docs/guides)
- [SDK / API References](https://web3auth.io/docs/sdk)
- [Pricing](https://web3auth.io/pricing.html)
- [Support](https://discord.gg/web3auth)
- [Angular Documentation](https://angular.io/docs)

## Support and Feedback
- [Discord](https://discord.gg/web3auth)
- [GitHub Issues](https://github.com/Web3Auth/web3auth-pnp-examples/issues)
- [Documentation](https://web3auth.io/docs/connect-blockchain/evm)

## License
MIT
