# Web3Auth (`@web3auth/single-factor-auth`) Auth.js ( fka NextAuth ) Next.js Example

[![Web3Auth](https://img.shields.io/badge/Web3Auth-SDK-blue)](https://web3auth.io/docs/sdk/core-kit/sfa-web)
[![Web3Auth](https://img.shields.io/badge/Web3Auth-Community-cyan)](https://community.web3auth.io)

[Join our Community Portal](https://community.web3auth.io/) to get support and stay up to date with the latest news and updates.

This example demonstrates how to use Web3Auth with Google Login in a Next.js app that uses NextAuth.

## How to Use

### Download Manually

```bash
npx degit Web3Auth/web3auth-core-kit-examples/single-factor-auth-web/sfa-web-nextauth-example w3a-sfa-web-nextauth-example
```

### Setup

1. Create a `.env.local` file in the root of your directory with the following content:

```bash
AUTH_SECRET="" # Added by `npx auth`. Read more: https://cli.authjs.dev
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=""
NEXT_PUBLIC_WEB3AUTH_VERIFIER=""
```

Install & Run:

```bash
cd w3a-sfa-web-nextauth-example
npm install
npm run dev
```

## Important Links

- [Website](https://web3auth.io)
- [Docs](https://web3auth.io/docs)
- [Guides](https://web3auth.io/docs/guides)
- [SDK / API References](https://web3auth.io/docs/sdk)
- [Pricing](https://web3auth.io/pricing.html)
- [Community Portal](https://community.web3auth.io)
