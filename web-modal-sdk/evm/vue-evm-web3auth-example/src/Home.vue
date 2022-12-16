<template>
  <div id="app">
    <h2>
      <a target="_blank" href="http://web3auth.io/" rel="noreferrer"> Web3Auth </a>
      Vue.js Ethereum Example
    </h2>

    <button v-if="!loggedin" class="card" @click="login" style="cursor: pointer">Login</button>

    <div v-if="loggedin">
      <div class="flex-container">
        <div>
          <button class="card" @click="getUserInfo" style="cursor: pointer">Get User Info</button>
        </div>
        <div>
          <button class="card" @click="authenticateUser" style="cursor: pointer">Get ID Token</button>
        </div>
        <div>
          <button class="card" @click="getChainId" style="cursor: pointer">Get Chain ID</button>
        </div>
        <div>
          <button class="card" @click="getAccounts" style="cursor: pointer">Get Accounts</button>
        </div>
        <div>
          <button class="card" @click="getBalance" style="cursor: pointer">Get Balance</button>
        </div>
        <div>
          <button class="card" @click="sendTransaction" style="cursor: pointer">Send Transaction</button>
        </div>
        <div>
          <button class="card" @click="signMessage" style="cursor: pointer">Sign Message</button>
        </div>
        <div>
          <button class="card" @click="getPrivateKey" style="cursor: pointer">Get Private Key</button>
        </div>
        <div>
          <button class="card" @click="logout" style="cursor: pointer">Logout</button>
        </div>
      </div>
      <div id="console" style="white-space: pre-line">
        <p style="white-space: pre-line"></p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import RPC from "./web3RPC";

// Plugins
import { TorusWalletConnectorPlugin } from "@web3auth/torus-wallet-connector-plugin";

// Adapters
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { WalletConnectV1Adapter } from "@web3auth/wallet-connect-v1-adapter";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";
import { TorusWalletAdapter } from "@web3auth/torus-evm-adapter";

export default {
  name: "Home",
  props: {
    msg: String,
  },
  setup() {
    const loggedin = ref<boolean>(false);
    const loading = ref<boolean>(false);
    const loginButtonStatus = ref<string>("");
    const connecting = ref<boolean>(false);
    let provider = ref<SafeEventEmitterProvider | any>(false);
    const clientId = "BEglQSgt4cUWcj6SKRdu5QkOXTsePmMcusG5EAoyjyOYKlVRjIF1iCNnMOTfpzCiunHRrMui8TIwQPXdkQ8Yxuk"; // get from https://dashboard.web3auth.io

    const web3auth = new Web3Auth({
      clientId,
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0x1",

        rpcTarget: "https://rpc.ankr.com/eth", // This is the public RPC we have added, please pass on your own endpoint while creating an app
      },
      uiConfig: {
        defaultLanguage: "en",
      },
    });

    const openloginAdapter = new OpenloginAdapter({
      adapterSettings: {
        network: "cyan",
      },
    });
    web3auth.configureAdapter(openloginAdapter);

    // plugins and adapters are optional and can be added as per your requirement
    // read more about plugins here: https://web3auth.io/docs/sdk/web/plugins/

    // adding torus wallet connector plugin

    const torusPlugin = new TorusWalletConnectorPlugin({
      torusWalletOpts: {},
      walletInitOptions: {
        whiteLabel: {
          theme: { isDark: true, colors: { primary: "#00a8ff" } },
          logoDark: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
          logoLight: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
        },
        useWalletConnect: true,
        enableLogging: true,
      },
    });

    // read more about adapters here: https://web3auth.io/docs/sdk/web/adapters/

    // adding wallet connect v1 adapter

    const walletConnectV1Adapter = new WalletConnectV1Adapter({
      adapterSettings: {
        bridge: "https://bridge.walletconnect.org",
      },
      clientId,
    });

    web3auth.configureAdapter(walletConnectV1Adapter);

    // adding metamask adapter

    const metamaskAdapter = new MetamaskAdapter({
      clientId,
      sessionTime: 3600, // 1 hour in seconds
      web3AuthNetwork: "cyan",
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0x1",
        rpcTarget: "https://rpc.ankr.com/eth", // This is the public RPC we have added, please pass on your own endpoint while creating an app
      },
    });
    // we can change the above settings using this function
    metamaskAdapter.setAdapterSettings({
      sessionTime: 86400, // 1 day in seconds
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0x89",
        rpcTarget: "https://rpc-mainnet.matic.network", // This is the public RPC we have added, please pass on your own endpoint while creating an app
      },
      web3AuthNetwork: "cyan",
    });

    // it will add/update  the metamask adapter in to web3auth class
    web3auth.configureAdapter(metamaskAdapter);

    const torusWalletAdapter = new TorusWalletAdapter({
      clientId,
    });

    // it will add/update  the torus-evm adapter in to web3auth class
    web3auth.configureAdapter(torusWalletAdapter);

    onMounted(async () => {
      try {
        loading.value = true;
        loggedin.value = false;
        await web3auth.initModal();
        await web3auth.addPlugin(torusPlugin);
        if (web3auth.provider) {
          provider = web3auth.provider;
          loggedin.value = true;
        }
      } catch (error) {
        uiConsole("error", error);
      } finally {
        loading.value = false;
      }
    });

    const login = async () => {
      if (!web3auth) {
        uiConsole("web3auth not initialized yet");
        return;
      }
      provider = await web3auth.connect();
      loggedin.value = true;
      uiConsole("Logged in Successfully!");
    };

    const authenticateUser = async () => {
      if (!web3auth) {
        uiConsole("web3auth not initialized yet");
        return;
      }
      const idToken = await web3auth.authenticateUser();
      uiConsole(idToken);
    };

    const getUserInfo = async () => {
      if (!web3auth) {
        uiConsole("web3auth not initialized yet");
        return;
      }
      const user = await web3auth.getUserInfo();
      uiConsole(user);
    };

    const logout = async () => {
      if (!web3auth) {
        uiConsole("web3auth not initialized yet");
        return;
      }
      await web3auth.logout();
      provider = null;
      loggedin.value = false;
    };

    const getChainId = async () => {
      if (!provider) {
        uiConsole("provider not initialized yet");
        return;
      }
      const rpc = new RPC(provider);
      const chainId = await rpc.getChainId();
      uiConsole(chainId);
    };
    const getAccounts = async () => {
      if (!provider) {
        uiConsole("provider not initialized yet");
        return;
      }
      const rpc = new RPC(provider);
      const address = await rpc.getAccounts();
      uiConsole(address);
    };

    const getBalance = async () => {
      if (!provider) {
        uiConsole("provider not initialized yet");
        return;
      }
      const rpc = new RPC(provider);
      const balance = await rpc.getBalance();
      uiConsole(balance);
    };

    const sendTransaction = async () => {
      if (!provider) {
        uiConsole("provider not initialized yet");
        return;
      }
      const rpc = new RPC(provider);
      const receipt = await rpc.sendTransaction();
      uiConsole(receipt);
    };

    const signMessage = async () => {
      if (!provider) {
        uiConsole("provider not initialized yet");
        return;
      }
      const rpc = new RPC(provider);
      const signedMessage = await rpc.signMessage();
      uiConsole(signedMessage);
    };

    const getPrivateKey = async () => {
      if (!provider) {
        uiConsole("provider not initialized yet");
        return;
      }
      const rpc = new RPC(provider);
      const privateKey = await rpc.getPrivateKey();
      uiConsole(privateKey);
    };

    function uiConsole(...args: any[]): void {
      const el = document.querySelector("#console>p");
      if (el) {
        el.innerHTML = JSON.stringify(args || {}, null, 2);
      }
    }

    return {
      loggedin,
      loading,
      loginButtonStatus,
      connecting,
      provider,
      web3auth,
      login,
      authenticateUser,
      logout,
      getUserInfo,
      getChainId,
      getAccounts,
      getBalance,
      sendTransaction,
      signMessage,
      getPrivateKey,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#app {
  width: 80%;
  margin: auto;
  padding: 0 2rem;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.card {
  margin: 0.5rem;
  padding: 0.7rem;
  text-align: center;
  color: #0070f3;
  background-color: #fafafa;
  text-decoration: none;
  border: 1px solid #0070f3;
  border-radius: 10px;
  transition: color 0.15s ease, border-color 0.15s ease;
  width: 100%;
}

.card:hover,
.card:focus,
.card:active {
  cursor: pointer;
  background-color: #f1f1f1;
}

.flex-container {
  display: flex;
  flex-flow: row wrap;
}

.flex-container > div {
  width: 100px;
  margin: 10px;
  text-align: center;
  line-height: 75px;
  font-size: 30px;
}

#console {
  width: 100%;
  height: 100%;
  overflow: auto;
  word-wrap: break-word;
  font-size: 16px;
  font-family: monospace;
  text-align: left;
}
</style>
