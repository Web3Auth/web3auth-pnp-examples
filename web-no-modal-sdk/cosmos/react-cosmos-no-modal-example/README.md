# How to set up Twitter login via Auth0 using Web3Auth for a Cosmos blockchain app

![Image](https://i.imgur.com/xSbakDX.png#img1)

This tutorial will walk you through the steps to create a simple web application on the Cosmos blockchain and cover the fundamentals of setting up your Web3Auth SDK and Twitter Login using Auth0 for custom authentication.

Repository: https://github.com/ihsraham/auth0-react-cosmos

App hosted on Vercel: https://auth0-react-cosmos-git-new-ihsraham.vercel.app/

## Quick Start
```
git clone https://github.com/ihsraham/auth0-react-cosmos.git
cd auth0-react-cosmos
npm install
npm run start
```

## How it works?
When combining Web3Auth with Auth0 SPA, the flow looks like this:
![](https://i.imgur.com/03O30ft.png)
*Photo from Web3Auth docs*
* When a user logs in with Auth0, Auth0 sends a JWT `id_token` to the app. This JWT token is sent to the Web3Auth SDK's login function.
* Finally, on successful validation of the JWT token, Web3Auth SDK will generate a private key for the user, in a self custodial way, resulting in easy onboarding for your user to the application.

## Prerequisites
* A basic knowledge of JavaScript is required to use Web3Auth SDK.
* Create a Web3Auth account on the Web3Auth Dashboard
* Create an Auth0 tenant and configure a Single Page Web Application on React  from Auth0 Console for Twitter login.
* A Twitter account
* Please note that Regular Web Applications are also supported as mentioned in the flows above. However for this guide, we’re preferring SPA since its implicit flow doesn’t require an application to host a backend server.

## Setup your Auth0 Tenant
* Add the following URLs for your app to the Allowed Web Origins field when configuring your Auth0 Application.
    * Additional to your own URLs for the application, please add
        * https://beta.openlogin.com/auth (for Web3Auth testnet used in demo applications, and I have used this for my application) and
        * https://app.openlogin.com/auth (for Web3Auth mainnet used in production applications).

![](https://i.imgur.com/OzxBEuk.png)
* You will require `domain` and `clientId` of the newly created application which you can copy from [Auth0 Console](https://manage.auth0.com/).
  ![](https://i.imgur.com/xFL7dsI.png)

### Enable Twitter login
* Enable `Twitter` on the `Authentication > Social page` of your Auth0 Dashboard.

![](https://i.imgur.com/MsZzg9I.png)
* Vist https://auth0.com/learn/social-login to learn more.

## Setup your Web3Auth Dashboard
* Create a Project from the Plug and Play Section of the [Web3Auth Developer Dashboard](https://dashboard.web3auth.io/).

![](https://i.imgur.com/0dRgflG.png)

* Enter your desired Project name
* Select the Web3Auth Network as `testnet`. It is recommended to create a project in the testnet network during development. And while moving to a production environment, make sure to convert your project to mainnet, aqua, celeste or cyan network, otherwise you'll end up losing users and keys.
* Select the blockchain you'll be building this project on i.e. Cosmos. If you have noticed by now, there's no option for Cosmos in the dropdown. You can select `Any other chain` for this example.
  ![](https://i.imgur.com/8Zw8Y2G.png)
* Finally, once you create the project, you've the option to whitelist your URLs for the project. **Please whitelist the domains where your project will be hosted** (i.e. Vercel, Netlify, etc.). P.S. - You don't need to whitelist for your local environment.

### Create Auth0 Verifiers
* Create a Verifier from the **Custom Auth** Section of the Developer Dashboard with the following configuration:
    * Choose a name of your choice for the verifier identifier. eg. `cosmos-auth0-project`
    * Select `Auth0` from the **Login Provider**.
    * Choose your Authentication Type as `Twitter`.
    * Paste the `Client ID` and `Auth0 Domain` from the Auth0 SPA you created in the above steps. This will be used to validate the JWT token issued by Auth0.
    * Click on `Create` button to create your verifier. It may take up to 10-20 minutes to deploy verifier on `testnet`. You'll receive an email once it's complete.

![](https://i.imgur.com/KOkNrMy.png)

:::info
:information_source: You will require the `verifierName` of the newly created verifier and `clientId` of the Plug and Play Project.
:::

## Using the Web3Auth SDK
To use the Web3Auth SDK, you need to add the dependency of the respective platform SDK of Web3Auth to your project. To know more about the available SDKs, please have a look at the [Web3Auth documentation page](https://web3auth.io/docs/sdk).

For this guide here, we will be talking through the [Web3Auth Plug and Play Core SDK](https://web3auth.io/docs/sdk/web/core) and using the [OpenLogin Provider](https://web3auth.io/docs/sdk/web/openlogin) alongside it to enable Custom Authentication through Auth0.

#### Setting up your base project for using Web3 libraries:
If you are starting from scratch, to set up this project locally, you will need to create a base Web application, where you can install the required dependencies. However, while working with Web3, there are a few base libraries, which need additional configuration. This is because certain packages are not available in the browser environment, and we need to polyfill them manually. You can follow [this documentation](https://web3auth.io/docs/troubleshooting/webpack-issues) from Web3Auth docs where they mention the configuration changes for some popular frameworks for your reference.

### Installation
For this project, you need to add the following Web3Auth dependencies to your package.json

`npm install --save @web3auth/no-modal @web3auth/openlogin-adapter @web3auth/base @cosmjs/stargate @cosmjs/proto-signing`

#### Understanding the Dependencies
##### Web3Auth Dependencies
**`@web3auth/no-modal`**
This is the main Core package that contains the Web3Auth SDK.
`npm install --save @web3auth/no-modal`

**`@web3auth/openlogin-adapter`**
For using Custom Authentication, we need to use the OpenLogin Adapter, where we can initialise the authentication details.
`npm install --save @web3auth/openlogin-adapter`

**`@web3auth/base`**
Since we're using typescript, we need the @web3auth/base package to provide types of the different variables we'll be using throughout the app building process. This reduces errors to a very large extent.
`npm install --save @web3auth/base`

##### CosmJS Libraries
**`@cosmjs/stargate`**
A client library for the Cosmos SDK 0.40+. Provides a high level client for querying, signing and broadcasting. This is an npm library that provides a JavaScript/TypeScript interface to interact with the Cosmos SDK blockchain via the Tendermint RPC interface.
`npm install --save @cosmjs/stargate`

**`@cosmjs/proto-signing`**
It is an npm library for signing messages using protobuf serialization, which is commonly used in Cosmos SDK-based blockchains. It provides a simple API for generating and verifying signatures using different algorithms and key types.
`npm install --save @cosmjs/proto-signing`

### Initialization
Once installed, your Web3Auth application needs to be initialized. Initialization is a 4 step process where we add all the config details for Web3Auth:

1. Instantiation
2. Configuration of Adapters
3. Configuration of Plugins
4. Initialization of the Web3Auth

Please make sure all of this is happening in your application constructor. This makes sure that Web3Auth is initialised when your application starts up.

For this guide, we're only focusing on the Instantiation, Configuration for the Openlogin Adapter (the default adapter that enables social logins) and Initialization of the Web3Auth SDK. To know more about the other things you can do with Web3Auth, checkout it's [SDK Reference](https://web3auth.io/docs/sdk/web/core).

#### Instantiating Web3Auth
##### Importing the packages
```
import { Web3AuthCore } from "@web3auth/core";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider, WALLET_ADAPTERS } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
```

Alongside the `Web3Auth` and `OpenloginAdapter` you need the above mentioned packages from `@web3auth/base` for different initialisations mentioned further in this guide.

##### Instantiate the Web3Auth SDK
```
import { Web3AuthCore } from "@web3auth/core";
import { CHAIN_NAMESPACES } from "@web3auth/base";

const web3auth = new Web3AuthCore({
  clientId: "YOUR_WEB3AUTH_CLIENT_ID",
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.OTHER,
  },
  web3AuthNetwork: "testnet"
});
```
Here, we're using the `chainConfig` property to set the chainNamespace. The chainNamespace is  the namespace of the chain you're connecting to, here, Cosmos. Since Cosmos is a non-EVM chain I've initialised it as `OTHER` for this guide. You can find the list of available providers [here](https://web3auth.io/docs/sdk/web/providers/) to select from.

##### Initialising the Openlogin Adapter
```
const openloginAdapter = new OpenloginAdapter({
  adapterSettings: {
    clientId: "YOUR-WEB3AUTH-CLIENT-ID", //Optional - Provide only if you haven't provided it in the Web3Auth Instantiation Code
    uxMode: "popup",
    loginConfig: {
      jwt: {
        verifier: "YOUR-VERIFIER-NAME-ON-WEB3AUTH-DASHBOARD",
        typeOfLogin: "jwt",
        clientId: "YOUR-AUTH0-CLIENT-ID-FROM-AUTH0-DASHBOARD",
      },
    },
  },
});

web3auth.configureAdapter(openloginAdapter);
```
Here, you need to pass over your Web3Auth `clientId` in the adapterSettings object and your Custom Auth `verifierName` and Auth0 `clientId` in the loginConfig object. This makes sure that the Openlogin Adapter can connect to the correct verifier and Auth0 server.

##### Initialising the Web3Auth SDK
```
await web3auth.init();
```

### Login
Once initialized, you can use the `connectTo()` function to authenticate the user when they click the login button.

```
import { WALLET_ADAPTERS, CHAIN_NAMESPACES } from "@web3auth/base";

await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
  loginProvider: "jwt",
  extraLoginOptions: {
    domain: "https://YOUR-AUTH0-DOMAIN", // Please append "https://" before your domain
    verifierIdField: "sub", 
  },
});
```
When connecting, your `connectTo` function takes the arguments for the adapter you want to connect to and the options for the login. The major thing to note here is the `domain` option in the `extraLoginOptions` object. This is the domain of your Auth0 tenant so that you can be redirected to login there directly from the Web3Auth Plug and Play Core SDK.

### Get the User Profile
```
const user = await web3auth.getUserInfo();
console.log("User info", user);
```
Using the `getUserInfo` function, you can get the details of the logged in user. Please note that these details are not stored anywhere in Web3Auth network, but are fetched from the id_token you received from Auth0 and lives in the frontend context.

### Logout
```
await web3auth.logout();
```
Logging out your user is as simple as calling the `logout` function.

## Interacting with the Blockchain
So if you have completed this far, it means that you have successfully authenticated your user. Now, you can use the provider returned by Web3Auth as `web3auth.provider` to interact with your blockchain.
Web3Auth is chain agnostic, ie. depending on whatever blockchain or layer-2 you use, Web3Auth can easily support that. Web3Auth has native providers for EVM and Solana blockchains and for others, you can get the private key in the user scope and make RPC calls. For standardising the type of provider, Web3Auth Base provides a `SafeEventEmitterProvider` from which you can create your own provider.
* [Ethereum Provider](https://web3auth.io/docs/sdk/web/providers/evm) gives you the capability of making RPC calls to the EVM compatible blockchains.
* [Solana Provider](https://web3auth.io/docs/sdk/web/providers/solana) gives you the capability of making RPC calls to the Solana blockchain.
* If you want to use any other chain except Solana or EVM chains, for ex: Starknet, you can specify the value of `chainNamespace` field as other in the Web3Auth SDK Constructor.
  :::info
  :information_source: NOTE
* On using `other` chainNamespace, the returned provider only exposed one RPC method (i.e 'private_key') to get the private key of logged in user.
* Other `chainConfig` fields except `chainNamespace` are not required while using `other` chainNamespace.
* Currently only `OpenloginAdapter` is supported with `other` chainNamespace.
  :::

On connection, you can use web3auth.provider as a private key provider to expose user's private key in the frontend context
```
//Assuming user is already logged in.
async getPrivateKey() {
    const privateKey = await web3auth.provider.request({
        method: "private_key"
    });
    //Do something with privateKey
}
```
### Connecting to Cosmos Testnet
For Cosmos, there are two kinds of testnets:
1. **Theta Upgrade testnet**: This testnet is intended for validators that want to test their upgrade readiness with Theta prior to the mainnet's debut. It mimics the state of mainnet previously with adjustments to an exported genesis to enable liveness and with suitable settings to emulate a governance permissioned software update.
2. **Theta DevNet**: This testnet targets developers who want to test applications against testnet gaia nodes. Unlike the upgrade testnets, this testnet doesn't mirror the state of the mainnet.

For our guide, we will be using `rpc.sentry-01.theta-testnet.polypore.xyz:26657` as our RPC endpoint.

`const rpc = "rpc.sentry-01.theta-testnet.polypore.xyz:26657";
`

### About ATOM
Atom (**ATOM**) (not to be confused with the defunct project Atomic Coin (ATOM)) is the primary cryptocurrency running on top of the Cosmos platform.
1 ATOM = 10^6^ uATOM

If you need ATOMs for testing, visit the discord for Cosmos [here](https://discord.gg/cosmosnetwork). You can request for ATOMs for the theta testnet over here. In the channel `testnet-faucet`, a bot will send you 10 ATOMs. The format for requesting for an address on theta testnet is as follows:
```
$request YOUR-COSMOS-ADDRESS theta
```
:::info
:information_source: Just a reminder!
Don't forget to prefix your address with `cosmos`. For example, **`cosmos13a3p36w0c39zq0unefp6q9t0y82gq2n3afl4rj`**
:::

### Necessary imports
```
import type {SafeEventEmitterProvider} from "@web3auth/base";
import {SigningStargateClient, StargateClient} from "@cosmjs/stargate";
import {DirectSecp256k1Wallet, OfflineDirectSigner} from "@cosmjs/proto-signing";
```

### Get ChainId
```
async getChainId(): Promise<string> {
    try {
        const client = await StargateClient.connect(rpc);

        // Get the connected Chain's ID
        const chainId = await client.getChainId();

        return chainId.toString();
    } catch (error) {
        return error as string;
    }
}
```

### Get Accounts
```
async getAccounts(): Promise<any> {
    try {
        const privateKey = Buffer.from(await this.getPrivateKey(), 'hex');
        const walletPromise = await DirectSecp256k1Wallet.fromKey(privateKey, "cosmos");
        return (await walletPromise.getAccounts())[0].address;
    } catch (error) {
        return error;
    }
}
```

### Get Balance
```
async getBalance(): Promise<any> {
    try {
        const client = await StargateClient.connect(rpc);

        const privateKey = Buffer.from(await this.getPrivateKey(), 'hex');
        const walletPromise = await DirectSecp256k1Wallet.fromKey(privateKey, "cosmos");
        const address = (await walletPromise.getAccounts())[0].address;
        // Get user's balance in uAtom
        return await client.getAllBalances(address);
    } catch (error) {
        return error as string;
    }
}
```

### Send transaction

```
async sendTransaction(): Promise<any> {
    try {
        await StargateClient.connect(rpc);
        const privateKey = Buffer.from(await this.getPrivateKey(), 'hex');
        const walletPromise = await DirectSecp256k1Wallet.fromKey(privateKey, "cosmos");
        const fromAddress = (await walletPromise.getAccounts())[0].address;

        const destination = "cosmos15aptdqmm7ddgtcrjvc5hs988rlrkze40l4q0he";

        const getSignerFromKey = async (): Promise<OfflineDirectSigner> => {
            return DirectSecp256k1Wallet.fromKey(privateKey, "cosmos");
        }
        const signer: OfflineDirectSigner = await getSignerFromKey();

        const signingClient = await SigningStargateClient.connectWithSigner(rpc, signer);

        const result = await signingClient.sendTokens(
            fromAddress,
            destination,
            [{denom: "uatom", amount: "250"}],
            {
                amount: [{denom: "uatom", amount: "250"}],
                gas: "100000",
            },
        )
        const transactionHash = result.transactionHash;
        const height = result.height;
        return {transactionHash, height};
    } catch (error) {
        return error as string;
    }
}
```
## On closing
### Example code
The full code for this sample application can be found in this [GitHub repository](https://github.com/ihsraham/auth0-react-cosmos) . Check it out and try running it locally yourself!

### Questions? Feedback?
Feel free to ask any questions you may have on [Web3Auth’s GitHub Discussion Board](https://github.com/orgs/Web3Auth/discussions).

