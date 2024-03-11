# microsoft-oauth-for-web3auth

This project integrate Web3Auth with Microsoft OAuth for authentication. Web3Auth is a decentralized authentication protocol that allows users to sign in to applications using their Ethereum wallets. In this demo, Microsoft OAuth is used to authenticate users, and Web3Auth is employed to provide Ethereum private key access and public address.

## Getting Started

Follow these steps to set up and run the project:

### 1. Clone the repository:
`git clone https://github.com/web3auth/web3auth-pnp-examples`

### 2. Install dependencies:
```
cd web3auth-byoa/microsoft-oauth-connection
npm install
```

### 3. Configure the verifier in the [Web3Auth Dashboard](https://dashboard.web3auth.io)

   Choose a name an use it for the ENV Configuration. Then select in Login Provider as "Custom Provider" and configure the other information as you can see in the image.
   
   <img width="711" alt="image" src="https://github.com/rtomas/microsoft-oauth-for-web3auth/assets/944960/fc6c5a10-2d3d-4b58-bbdb-1b01ba1e492b">
   
   Upload the jwks.json to a server. In my example was uploaded to github.

### 4. Configure a new Application in Microsoft Entra.

You'll need the Application (client) ID and the Directory (tenant) ID.
Then you can add a redirect URI (in our example is `http://localhost:5005/ms/callback`)

<img width="980" alt="image" src="https://github.com/rtomas/microsoft-oauth-for-web3auth/assets/944960/25803c18-02a5-488b-85e8-67b948d72799">

Finally in "Certificates & secrets" -> Client Secret -> New client secret and copy the value to the .ENV

### 5. Generate a private key and your jwks.json.

Follow the instructions from this link: https://web3auth.io/docs/auth-provider-setup/byo-jwt-providers#how-to-convert-pem-to-jwks

### 6. Create a `.env` file in the project root and set the following variables:

```
AZURE_CLIENT_ID=## create one in https://entra.microsoft.com/##
AZURE_CLIENT_SECRET=## create one in https://entra.microsoft.com/##
AZURE_TENANT_ID=## create one in https://entra.microsoft.com/##
AZURE_CODE_CHALLENGE=##create pair with CODE_VERIFIER in https://tonyxu-io.github.io/pkce-generator/##
AZURE_CODE_VERIFIER=##create pair with CODE_CHALLENGE in https://tonyxu-io.github.io/pkce-generator/##
PRIVATE_KEY_FILE_NAME=privateKey.pem
JWKS_FILE_NAME=jwks.json
```

### 7. Run the application:

`npm run dev`

Open your browser and navigate to `http://localhost:5005/ms/login` to initiate the Microsoft OAuth flow.

## How it works?

When integrating Web3Auth with Microsoft Login the flow looks something like this:

![Microsoft flow](https://github.com/rtomas/microsoft-oauth-for-web3auth/assets/944960/76b25237-4031-4535-8b3f-67335e430773)


# Reference
+ [Custom JWT providers in Web3auth](https://web3auth.io/docs/auth-provider-setup/byo-jwt-providers)
+ [Microsoft OAUTH 2.0 flow](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow#redeem-a-code-for-an-access-token)
