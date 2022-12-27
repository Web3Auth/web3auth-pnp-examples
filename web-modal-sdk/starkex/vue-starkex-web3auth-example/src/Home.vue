<template>
  <div id="app">
    <h2>
      <a target="_blank" href="http://web3auth.io/" rel="noreferrer">
        Web3Auth
      </a>
      Vue.js StarkEx Example
    </h2>

    <button
      v-if="!loggedin"
      class="card"
      @click="login"
      style="cursor: pointer"
    >
      Login
    </button>

    <div v-if="loggedin">
      <div class="flex-container">
        <div>
          <button class="card" @click="getUserInfo" style="cursor: pointer">
            Get User Info
          </button>
        </div>
        <div>
          <button
            class="card"
            @click="authenticateUser"
            style="cursor: pointer"
          >
            Get ID Token
          </button>
        </div>
        <div>
          <button
            class="card"
            @click="onGetStarkAccount"
            style="cursor: pointer"
          >
            Get Stark Accounts
          </button>
        </div>
        <div>
          <button class="card" @click="getStarkKey" style="cursor: pointer">
            Get Stark Key
          </button>
        </div>
        <div>
          <button class="card" @click="onMintRequest" style="cursor: pointer">
            Mint Request
          </button>
        </div>
        <div>
          <button
            class="card"
            @click="onDepositRequest"
            style="cursor: pointer"
          >
            Deposit Request
          </button>
        </div>
        <div>
          <button
            class="card"
            @click="onWithdrawalRequest"
            style="cursor: pointer"
          >
            Withdraw Request
          </button>
        </div>
        <div>
          <button class="card" @click="logout" style="cursor: pointer">
            Logout
          </button>
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
import {
  WALLET_ADAPTERS,
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
} from "@web3auth/base";
import RPC from "./starkexRPC";

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
    let provider = ref<SafeEventEmitterProvider | any>(null);
    const clientId =
      "BEglQSgt4cUWcj6SKRdu5QkOXTsePmMcusG5EAoyjyOYKlVRjIF1iCNnMOTfpzCiunHRrMui8TIwQPXdkQ8Yxuk"; // get from https://dashboard.web3auth.io

    const web3auth = new Web3Auth({
      clientId,
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.OTHER,
      },
      web3AuthNetwork: "cyan",
    });

    onMounted(async () => {
      try {
        loading.value = true;
        loggedin.value = false;

        await web3auth.initModal();
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

    const onGetStarkAccount = async () => {
      if (!provider) {
        uiConsole("provider not initialized yet");
        return;
      }
      const rpc = new RPC(provider as SafeEventEmitterProvider);
      const starkaccounts = await rpc.getStarkAccount();
      uiConsole(starkaccounts);
    };

    const getStarkKey = async () => {
      if (!provider) {
        uiConsole("provider not initialized yet");
        return;
      }
      const rpc = new RPC(provider as SafeEventEmitterProvider);
      const starkKey = await rpc.getStarkKey();
      uiConsole(starkKey);
    };

    const onMintRequest = async () => {
      if (!provider) {
        uiConsole("provider not initialized yet");
        return;
      }
      const rpc = new RPC(provider as SafeEventEmitterProvider);
      const request = await rpc.onMintRequest();
      uiConsole(request);
    };

    const onDepositRequest = async () => {
      if (!provider) {
        uiConsole("provider not initialized yet");
        return;
      }
      const rpc = new RPC(provider as SafeEventEmitterProvider);
      const request = await rpc.onDepositRequest();
      uiConsole(request);
    };

    const onWithdrawalRequest = async () => {
      if (!provider) {
        uiConsole("provider not initialized yet");
        return;
      }
      const rpc = new RPC(provider as SafeEventEmitterProvider);
      const request = await rpc.onWithdrawalRequest();
      uiConsole(request);
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
      onGetStarkAccount,
      getStarkKey,
      onMintRequest,
      onDepositRequest,
      onWithdrawalRequest,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#app {
  width: 70%;
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
