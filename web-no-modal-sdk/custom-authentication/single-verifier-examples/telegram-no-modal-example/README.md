# Web3Auth x Telegram Login x React Vite x Express Example

[![Web3Auth](https://img.shields.io/badge/Web3Auth-SDK-blue)](https://web3auth.io/docs/sdk/pnp/web/no-modal)
[![Web3Auth](https://img.shields.io/badge/Web3Auth-Community-cyan)](https://community.web3auth.io)

[Join our Community Portal](https://community.web3auth.io/) to get support and stay up to date with the latest news and updates.

This example demonstrates how to use Web3Auth with Telegram Login in a React Vite frontend. Express is used to create the Telegram OAuth server that issues JWT tokens for the Web3Auth SDK.

## How to Use

### One-Click Deploy to Vercel

#### Frontend

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FWeb3Auth%2Fweb3auth-pnp-examples%2Ftree%2Fmain%2Fweb-no-modal-sdk%2Fcustom-authentication%2Fsingle-verifier-examples%2Ftelegram-no-modal-example&project-name=w3a-telegram-no-modal-example&repository-name=w3a-telegram-no-modal-example)

#### Backend

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FWeb3Auth%2Fweb3auth-pnp-examples%2Ftree%2Fmain%2Fweb-no-modal-sdk%2Fcustom-authentication%2Fsingle-verifier-examples%2Ftelegram-no-modal-example%2Fserver&project-name=w3a-telegram-no-modal-example-server&repository-name=w3a-telegram-no-modal-example-server)

### Download Manually

```bash
npx degit Web3Auth/web3auth-pnp-examples/web-no-modal-sdk/custom-authentication/single-verifier-examples/telegram-no-modal-example w3a-telegram-example
```

### Setup

1. Create a `.env` file in the `server/api` directory with the following content:

```bash
TELEGRAM_BOT_NAME="" # e.g. @your_bot_name
TELEGRAM_BOT_TOKEN="" # e.g. 1234567890:ABCDEF
SERVER_URL="" # e.g. http://localhost:3000
CLIENT_URL="" # e.g. http://localhost:5173
JWT_KEY_ID="" # e.g. your_key_id
```

2. Create a `.env.local` file in the root directory with the following content:

```bash
VITE_SERVER_URL="" # e.g. http://localhost:3000
VITE_W3A_VERIFIER_NAME="" # e.g. w3a-telegram-demo
```

Follow [this Telegram guide](https://web3auth.io/docs/guides/telegram) to follow along.

Install & Run:

```bash
cd w3a-example/server
npm install
## start server
# server will be running on localhost:8080
cd api
node index.js
# use ngrok to expose the server to the internet
# ngrok http 3000
# copy the ngrok url and update the SERVER_URL in the .env file
# also update the telegram bot domain to the ngrok url


## now, start the client
cd ..
npm install
npm run start
# client will be running on localhost:5173
```

## Important Links

- [Website](https://web3auth.io)
- [Docs](https://web3auth.io/docs)
- [Guides](https://web3auth.io/docs/guides)
- [SDK / API References](https://web3auth.io/docs/sdk)
- [Pricing](https://web3auth.io/pricing.html)
- [Community Portal](https://community.web3auth.io)
