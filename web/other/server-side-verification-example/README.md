# Web3Auth No Modal SDK with Server-Side Verification x Next.js

[![Web3Auth](https://img.shields.io/badge/Web3Auth-SDK-blue)](https://web3auth.io/docs/sdk/pnp/web/no-modal)
[![Web3Auth](https://img.shields.io/badge/Web3Auth-Community-cyan)](https://community.web3auth.io)

[Join our Community Portal](https://community.web3auth.io/) to get support and stay up to date with the latest news and updates.

This example demonstrates how to use Web3Auth No Modal SDK with Server-Side Token Verification in Next.js (App Router)

## How to Use

### One-Click Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FWeb3Auth%2Fweb3auth-pnp-examples%2Ftree%2Fmain%2Fweb-no-modal-sdk%2Fother%2Fserver-side-verification-no-modal-example&project-name=w3a-ssv-no-modal&repository-name=w3a-ssv-no-modal)

### Download Manually

```bash
npx degit Web3Auth/web3auth-pnp-examples/web-no-modal-sdk/other/server-side-verification-no-modal-example w3a-ssv-example
```

Install & Run:

```bash
cd w3a-ssv-example
npm install
npm run dev
# or
cd w3a-ssv-example
yarn
yarn dev
```

## Server-Side Verification

This example includes an API route at `/api/login` that verifies the Web3Auth JWT token on the server side. The server:

1. Verifies the JWT signature using Web3Auth's JWKS endpoint
2. Checks that the public key in the JWT matches the one from the client
3. Returns a success response if verification passes

On the client side, the app:
1. Gets an ID token from Web3Auth after login
2. Sends the token to the server for verification
3. Continues only if verification is successful

## Important Links

- [Website](https://web3auth.io)
- [Docs](https://web3auth.io/docs)
- [Guides](https://web3auth.io/docs/guides)
- [SDK / API References](https://web3auth.io/docs/sdk)
- [Pricing](https://web3auth.io/pricing.html)
- [Community Portal](https://community.web3auth.io)
