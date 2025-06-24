# Web3Auth Plug and Play Examples

[Web3Auth](https://web3auth.io) is a pluggable auth infrastructure for Web3 wallets and applications. It streamlines onboarding for both mainstream and crypto-native users within minutes by providing familiar authentication experiences.

This repository contains ready-to-use examples for integrating Web3Auth across various frameworks, blockchains, and authentication providers.

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm
- A Web3Auth Client ID from the [Web3Auth Dashboard](https://dashboard.web3auth.io)

### Quick Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/Web3Auth/web3auth-examples.git
    cd web3auth-examples
    ```

2. Choose an example that matches your tech stack

3. Setup the example:
    ```bash
    cd <example-directory>
    cp .env.example .env
    # Update .env with your Web3Auth Client ID
    ```

4. Install dependencies and run:
    ```bash
    npm install
    npm start
    ```

## 🧩 Example Directory

### Quick Starts

| Framework    | Example | Description |
|-------------|---------|-------------|
| **React**    | [React Quick Start](quick-starts/react-quick-start) | Basic EVM integration with React |
| **Next.js**  | [Next.js Quick Start](quick-starts/nextjs-quick-start) | Server-side rendering with Next.js |
| **Vue.js**   | [Vue Quick Start](quick-starts/vue-quick-start) | Vue.js integration with Web3Auth |
| **Angular**  | [Angular Quick Start](quick-starts/angular-quick-start) | Angular framework integration |
| **VanillaJS**| [VanillaJS Quick Start](quick-starts/vanillajs-quick-start) | Plain JavaScript implementation |
 
## 📘 Understanding the Examples

Each example follows a similar structure:

1. **Setup**: Initialize Web3Auth with your Client ID
2. **Authentication**: Implement login/logout functionality
3. **Blockchain Integration**: Connect to the specific blockchain
4. **User Operations**: Perform blockchain operations like transactions

## 📚 Resources

- [Web3Auth Documentation](https://web3auth.io/docs)
- [SDK References](https://web3auth.io/docs/sdk)
- [Developer Dashboard](https://dashboard.web3auth.io)
- [Web3Auth Community](https://web3auth.io/community)

## 📄 License

MIT
