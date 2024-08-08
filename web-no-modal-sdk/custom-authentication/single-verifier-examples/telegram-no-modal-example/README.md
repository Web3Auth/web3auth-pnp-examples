# Web3Auth (`@web3auth/no-modal`) x Telegram Login x React x Express

[![Web3Auth](https://img.shields.io/badge/Web3Auth-SDK-blue)](https://web3auth.io/docs/sdk/pnp/web/no-modal)
[![Web3Auth](https://img.shields.io/badge/Web3Auth-Community-cyan)](https://community.web3auth.io)

[Join our Community Portal](https://community.web3auth.io/) to get support and stay up to date with the latest news and updates.

This example demonstrates how to use Web3Auth with Telegram Login x React x Express.

## How to Use

### One-Click Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FWeb3Auth%2Fweb3auth-pnp-examples%2Ftree%2Fmain%2Fweb-no-modal-sdk%2Fcustom-authentication%2Fsingle-verifier-examples%2Ftelegram-no-modal-example&project-name=w3a-telegram-no-modal-example&repository-name=w3a-telegram-no-modal-example)

### Download Manually

```bash
npx degit Web3Auth/web3auth-pnp-examples/web-no-modal-sdk/custom-authentication/single-verifier-examples/telegram-no-modal-example w3a-example
```

### Setup

1. Create a `.env` file in the `server` directory with the following content:

```bash
TELEGRAM_BOT_TOKEN= #token from telegram bot (complete)
TELEGRAM_BOT_NAME= #name from telegram bot
SERVER_HOST_URL= # get URL from running  ngrok http 5005
PRIVATE_KEY_FILE_NAME=privateKey.pem
```

Follow the guide [here](https://web3auth.io/docs/guides/telegram-oauth) to setup the Telegram bot and Telegram verifier.

Install & Run:

```bash
cd w3a-example/server
npm install
## start server
# server will be running on localhost:8080
npm run start
## start client
cd ..
npm install
npm run start
# client will be running on localhost:3000
```

## Important Links

- [Website](https://web3auth.io)
- [Docs](https://web3auth.io/docs)
- [Guides](https://web3auth.io/docs/guides)
- [SDK / API References](https://web3auth.io/docs/sdk)
- [Pricing](https://web3auth.io/pricing.html)
- [Community Portal](https://community.web3auth.io)
