# GitHub OAuth Server for Web3Auth

This project is a demonstration of integrating Web3Auth with GitHub OAuth for authentication. Web3Auth is a decentralized authentication protocol that allows users to sign in to applications using their Ethereum wallets. In this demo, GitHub OAuth is used to authenticate users, and Web3Auth is employed to provide Ethereum private key access.

## Features

- GitHub OAuth integration for user authentication.
- Web3Auth integration for Ethereum private key access.
- Generates a JSON Web Token (JWT) containing GitHub user information.
- Provides Ethereum private key and public address associated with the authenticated GitHub user.
- Demonstrates the exchange of GitHub OAuth code for an access token.

## Getting Started

Follow these steps to set up and run the project:

1. Clone the repository:
`git clone https://github.com/web3auth/web3auth-pnp-examples`

2. Install dependencies:
```
cd web3auth-byoa/github-oauth-connection
npm install
```

3. Create a `.env` file in the project root and set the following variables:

```env
GITHUB_CLIENT_ID=##create a github app https://github.com/settings/apps/
GITHUB_CLIENT_SECRET=##create a github app https://github.com/settings/apps/
GITHUB_REDIRECT_URI=http://localhost:5005/github/callback
PRIVATE_KEY_FILE_NAME=privateKey.pem
WEB3AUTH_VERIFIER=#create a verifier at https://dashboard.web3auth.io
```

   Replace `your-github-client-id` and `your-github-client-secret` with your GitHub OAuth application information.

4. Run the application:

   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:5005/github/login` to initiate the GitHub OAuth flow.


Follow the complete guide to run the project in : https://web3auth.io/docs/guides/github-oauth-web3auth-integration


References
- [Custom JWT providers in Web3auth](https://web3auth.io/docs/auth-provider-setup/byo-jwt-providers)
- [Github OAUTH 2.0 flow](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#web-application-flow)


