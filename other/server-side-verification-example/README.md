# Web3Auth (`@web3auth/no-modal`) with Next.js and Server-Side Verification

This example demonstrates how to implement secure server-side verification of Web3Auth authentication in a Next.js application.

## Tech Stack

- **Frontend Framework**: Next.js (React) with TypeScript
- **Web3 Libraries**: 
  - `@web3auth/no-modal`: Core Web3Auth functionality without UI (headless)
  - `wagmi`: React hooks for Ethereum
  - `@tanstack/react-query`: Data synchronization for React applications
- **UI Components**:
  - `@tanstack/react-table`: Table components for data display
  - `react-toastify`: Toast notifications
- **JWT Handling**:
  - `jose`: JavaScript library for JWK, JWT, and JSON Web Signatures/Encryption

This example shows how to implement secure server-side verification of Web3Auth authentication tokens. It demonstrates:

1. Authenticating users with Web3Auth
2. Issuing and validating JWT tokens securely
3. Implementing server-side verification of user authentication
4. Protecting API routes and sensitive operations
5. Preventing token forgery and authentication bypass

The implementation uses Next.js API routes to verify authentication server-side, adding an additional layer of security to your Web3 application beyond client-side authentication.

## How to Use

### Download Manually

```bash
npx degit Web3Auth/web3auth-pnp-examples/web/other/server-side-verification-example w3a-example
```

### Installation

```bash
cd w3a-example
npm install
```

### Run the application

```bash
npm run dev
```

## Important Links

- [Website](https://web3auth.io)
- [Docs](https://web3auth.io/docs)
