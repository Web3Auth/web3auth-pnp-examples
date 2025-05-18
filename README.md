# Web3Auth Plug and Play Examples

[Web3Auth](https://web3auth.io) is a pluggable auth infrastructure for Web3 wallets and applications. It streamlines the onboarding of both mainstream and crypto native users under a minute by providing experiences that they're most comfortable with.

## 🚀 Quick Start Examples

Get started quickly with our framework-specific examples:

| Framework    | Example                                                                                                    | Description                                        |
|-------------|------------------------------------------------------------------------------------------------------------|----------------------------------------------------|
| React       | [React Quick Start](quick-starts/react-quick-start)                                                        | Basic EVM integration with React                    |
| Next.js     | [Next.js Quick Start](quick-starts/nextjs-quick-start)                                                    | Server-side rendering with Next.js                  |
| Vue.js      | [Vue Quick Start](quick-starts/vue-quick-start)                                                           | Vue.js integration with Web3Auth                    |
| Angular     | [Angular Quick Start](quick-starts/angular-quick-start)                                                    | Angular framework integration                       |
| VanillaJS   | [VanillaJS Quick Start](quick-starts/vanillajs-quick-start)                                              | Plain JavaScript implementation                     |

## 🔗 Blockchain Examples

Explore blockchain-specific integrations:

| Blockchain | Example                                    | Description                                        |
|------------|--------------------------------------------|----------------------------------------------------|
| Solana     | [Solana Example](other/solana-example)    | Solana blockchain integration                      |
| XRPL       | [XRPL Example](other/xrpl-example)        | XRP Ledger integration                             |
| Aptos      | [Aptos Example](other/aptos-example)      | Aptos blockchain integration                       |
| TON        | [TON Example](other/ton-example)          | The Open Network integration                       |
| TRON       | [TRON Example](other/tron-example)        | TRON blockchain integration                        |
| Tezos      | [Tezos Example](other/tezos-example)      | Tezos blockchain integration                       |
| Algorand   | [Algorand Example](other/algorand-example)| Algorand blockchain integration                    |
| Cosmos     | [Cosmos Example](other/cosmos-example)    | Cosmos blockchain integration                      |
| Polkadot   | [Polkadot Example](other/polkadot-example)| Polkadot blockchain integration                   |
| Bitcoin    | [Bitcoin Example](other/bitcoin-example)  | Bitcoin integration                                |
| Sui        | [Sui Example](other/sui-example)          | Sui blockchain integration                         |

## 🔐 Custom Authentication Examples

Implement custom authentication providers:

### Single Provider Examples
| Provider   | Example                                                                                                     | Description                                        |
|------------|-------------------------------------------------------------------------------------------------------------|----------------------------------------------------|
| Auth0      | [Auth0 Example](custom-authentication/single-connection/auth0-example)                                      | Auth0 social login integration                      |
| Google     | [Google Example](custom-authentication/single-connection/google-example)                                    | Google OAuth integration                            |
| Firebase   | [Firebase Example](custom-authentication/single-connection/firebase-example)                                | Firebase authentication                             |
| Discord    | [Discord Example](custom-authentication/single-connection/discord-example)                                  | Discord OAuth integration                           |
| Facebook   | [Facebook Example](custom-authentication/single-connection/facebook-example)                                | Facebook login integration                          |
| Twitch     | [Twitch Example](custom-authentication/single-connection/twitch-example)                                    | Twitch OAuth integration                            |

### Multi-Provider Examples
| Providers                  | Example                                                                                                           | Description                                        |
|---------------------------|-------------------------------------------------------------------------------------------------------------------|----------------------------------------------------|
| Auth0 + Google            | [Auth0 Google Example](custom-authentication/grouped-connection/auth0-google-example)                             | Combined Auth0 and Google authentication            |
| Firebase + Google         | [Firebase Google Example](custom-authentication/grouped-connection/firebase-google-example)                       | Combined Firebase and Google authentication         |

## 📱 Mobile & Gaming Examples

Native platform integrations:

| Platform      | Example                                           | Description                                        |
|---------------|---------------------------------------------------|----------------------------------------------------|
| iOS           | [iOS Example](ios/ios-quick-start)               | Native iOS integration                             |
| Android       | [Android Example](android/android-quick-start)    | Native Android integration                         |
| React Native  | [React Native Example](react-native/quick-start) | React Native mobile integration                    |
| Flutter       | [Flutter Example](flutter/quick-start)           | Flutter cross-platform integration                 |
| Unity         | [Unity Example](unity/quick-start)               | Unity game engine integration                      |

## 🎮 Advanced Examples

Advanced integration examples:

| Type                    | Example                                                                | Description                                        |
|------------------------|------------------------------------------------------------------------|----------------------------------------------------|
| Multi-Chain            | [Multi-Chain Example](other/multi-chain-example)                      | Multiple blockchain integration                     |
| Server-Side Verification| [SSV Example](other/server-side-verification-example)                | Server-side verification implementation             |
| Smart Account          | [Smart Account Example](other/smart-account-example)                  | Smart contract wallet integration                   |
| XMTP                   | [XMTP Example](other/xmtp-example)                                    | Web3 messaging protocol integration                 |
| Sign Protocol          | [Sign Protocol Example](other/sign-protocol-example)                  | Blockchain signing protocol implementation          |

## 🛠️ Development Setup

### Prerequisites
- Node.js 14+
- npm/yarn
- A Web3Auth Client ID (get one from [Web3Auth Dashboard](https://dashboard.web3auth.io))

### Installation
1. Clone the repository:
```bash
git clone https://github.com/Web3Auth/web3auth-pnp-examples.git
```

2. Navigate to desired example:
```bash
cd web3auth-pnp-examples/<example-directory>
```

3. Create .env file based on .env.example template:
```bash
cp .env.example .env
```

4. Update the .env file with your Web3Auth Client ID (and any other required variables)

5. Install dependencies:
```bash
npm install
# or
yarn
```

For more details on environment setup, see [ENV_SETUP.md](ENV_SETUP.md)

## 📚 Important Links
- [Website](https://web3auth.io)
- [Documentation](https://web3auth.io/docs)
- [Guides](https://web3auth.io/docs/guides)
- [SDK References](https://web3auth.io/docs/sdk)
- [Pricing](https://web3auth.io/pricing.html)

## 💬 Support and Feedback
- [Discord](https://discord.gg/web3auth)
- [GitHub Issues](https://github.com/Web3Auth/web3auth-pnp-examples/issues)
- [GitHub Discussions](https://github.com/orgs/Web3Auth/discussions)

## 📄 License
MIT
