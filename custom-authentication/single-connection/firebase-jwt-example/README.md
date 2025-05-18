# Web3Auth Firebase JWT Authentication Example

This example demonstrates how to integrate Web3Auth with Firebase Authentication using JWT tokens, enabling secure and seamless authentication for your Web3 application.

## Features

- 🔥 Firebase Authentication integration
- 🔐 JWT token-based authentication
- 🌐 Web3Auth Modal UI
- ⛓️ Blockchain wallet creation
- 🔄 Session management
- 📱 Responsive design

## Prerequisites

- Node.js 14+ and npm/yarn
- Basic knowledge of React and Firebase
- Firebase project with Authentication enabled
- Web3Auth account and client ID (get one at [Web3Auth Dashboard](https://dashboard.web3auth.io))

## Tech Stack

- **Frontend**: React with TypeScript
- **Build Tool**: Vite
- **Authentication**: Firebase Authentication
- **Web3 Libraries**: 
  - `@web3auth/modal`: Core Web3Auth functionality
  - `firebase`: Firebase SDK
  - `ethers`: Ethereum library

## Installation

1. Clone the repository:
```bash
npx degit Web3Auth/web3auth-pnp-examples/web/custom-authentication/single-connection/jwt-login/firebase-example w3a-example
```

2. Install dependencies:
```bash
cd w3a-example
npm install
```

3. Configure Firebase:
   - Create a Firebase project in the [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication and desired providers (Google, Email, etc.)
   - Add a web app to your project and get the configuration
   - Create `.env` file and add your Firebase config:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_WEB3AUTH_CLIENT_ID=your-web3auth-client-id
   ```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/          # React components
├── config/             # Configuration files
│   ├── firebaseConfig.ts   # Firebase setup
│   └── web3AuthConfig.ts   # Web3Auth setup
├── services/           # Authentication services
├── hooks/             # Custom React hooks
└── App.tsx            # Main application
```

## Implementation Guide

### 1. Firebase Configuration
```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // ... other config
};

initializeApp(firebaseConfig);
```

### 2. Web3Auth Integration
```typescript
const web3auth = new Web3Auth({
  clientId: import.meta.env.VITE_WEB3AUTH_CLIENT_ID,
  web3AuthNetwork: "testnet",
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x1",
    rpcTarget: "https://rpc.ankr.com/eth"
  }
});
```

### 3. JWT Authentication Flow
```typescript
// Get Firebase ID token
const idToken = await getAuth().currentUser?.getIdToken();

// Use token with Web3Auth
await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
  loginProvider: "jwt",
  extraLoginOptions: {
    id_token: idToken,
    verifierIdField: "sub"
  }
});
```

## Common Issues and Solutions

1. **Firebase Configuration**
   - Ensure all environment variables are correctly set
   - Check Firebase Authentication is enabled
   - Verify allowed domains in Firebase Console

2. **JWT Token Issues**
   - Verify token format and expiration
   - Check Firebase rules configuration
   - Ensure proper error handling for token refresh

3. **Web3Auth Connection**
   - Validate client ID configuration
   - Check network connectivity
   - Verify JWT verifier setup in Web3Auth Dashboard

## Security Best Practices

- Keep Firebase configuration secure
- Implement proper token validation
- Use environment variables for sensitive data
- Regular security audits
- Implement proper error handling
- Set up proper Firebase Security Rules

## Resources

- [Web3Auth Documentation](https://web3auth.io/docs)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
- [JWT Authentication Guide](https://web3auth.io/docs/custom-authentication/jwt)
- [Web3Auth Dashboard](https://dashboard.web3auth.io)
- [Firebase Console](https://console.firebase.google.com)
- [Discord Support](https://discord.gg/web3auth)

## Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

## License

This example is available under the MIT License. See the LICENSE file for more info.
