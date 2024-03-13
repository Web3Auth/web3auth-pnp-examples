# Telegram OAuth Server for Web3Auth

This project is a demonstration of integrating Web3Auth with Telegram OAuth for authentication. Web3Auth is a decentralized authentication protocol that allows users to sign in to applications using their Ethereum wallets. In this demo, Telegram OAuth is used to authenticate users, and Web3Auth is employed to provide Ethereum private key access.

## Getting Started

Follow these steps to set up and run the project:

1. Clone the repository:
`git clone https://github.com/web3auth/web3auth-pnp-examples`

2. Install dependencies:
```
cd web3auth-byoa/telegram-oauth-connection
npm install
```

3. Create a `.env` file in the project root and set the following variables:

```env
TELEGRAM_APP_TOKEN=#token from telegram bot (complete) 
TELEGRAM_APP_NAME=#name from telegram bot
SERVER_HOST_URL=# get URL from running  ngrok http 5005
PRIVATE_KEY_FILE_NAME=privateKey.pem
WEB3AUTH_VERIFIER_ID=w3a-telegram-oauth-demo #create a verifier at https://dashboard.web3auth.io
```

4. Run the application in 2 consoles:

   ```bash
   ngrok http 5005 
   ```

   ```bash
   npm start
   ```
4. Add the URL from ngrok to the `.env` file as `SERVER_HOST_URL` and go to the Telegram Father Bot and send `/setdomain` and set the URL from ngrok from the your bot.

5. Open your browser and navigate to `http://<URL>/telegram/login` to initiate the Telegram OAuth flow. 
