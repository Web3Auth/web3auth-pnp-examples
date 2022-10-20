<template>
  <div id="app">
    <h2>Web3Auth X Vue.js</h2>
    <section
      style="
         {
          fontsize: '12px';
        }
      "
    >
      <button class="rpcBtn" @click="login" style="cursor: pointer">
        Login
      </button>
      <button class="rpcBtn" @click="getUserInfo" style="cursor: pointer">
        Get User Info
      </button>
      <button class="rpcBtn" @click="onGetStarkAccount" style="cursor: pointer">
        Get Stark Accounts
      </button>
      <button class="rpcBtn" @click="getStarkKey" style="cursor: pointer">
        Get Stark Key
      </button>
      <button class="rpcBtn" @click="onMintRequest" style="cursor: pointer">
        Mint Request
      </button>
      <button class="rpcBtn" @click="onDepositRequest" style="cursor: pointer">
        Deposit Request
      </button>
      <button
        class="rpcBtn"
        @click="onWithdrawalRequest"
        style="cursor: pointer"
      >
        Withdraw Request
      </button>
      <button class="rpcBtn" @click="logout" style="cursor: pointer">
        Logout
      </button>
    </section>
    <div id="console" style="white-space: pre-line">
      <p style="white-space: pre-line"></p>
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
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import RPC from "./starkexRPC";

export default {
  name: "Home",
  props: {
    msg: String,
  },
  setup() {
    const loading = ref<boolean>(false);
    const loginButtonStatus = ref<string>("");
    const connecting = ref<boolean>(false);
    let provider = ref<SafeEventEmitterProvider | any>(null);
    const clientId = "YOUR_CLIENT_ID"; // get from https://dashboard.web3auth.io

    const web3auth = new Web3Auth({
      clientId,
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.OTHER,
      },
    });

    onMounted(async () => {
      try {
        loading.value = true;

        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: {
            clientId,
            network: "testnet",
            uxMode: "popup",
          },
        });
        web3auth.configureAdapter(openloginAdapter);

        await web3auth.initModal();
        if (web3auth.provider) {
          provider = web3auth.provider;
        }
      } catch (error) {
        console.log("error", error);
        console.log("error", error);
      } finally {
        loading.value = false;
      }
    });

    const login = async () => {
      if (!web3auth) {
        console.log("web3auth not initialized yet");
        return;
      }
      provider = await web3auth.connect();
    };

    const getUserInfo = async () => {
      if (!web3auth) {
        console.log("web3auth not initialized yet");
        return;
      }
      const user = await web3auth.getUserInfo();
      console.log(user);
    };

    const logout = async () => {
      if (!web3auth) {
        console.log("web3auth not initialized yet");
        return;
      }
      await web3auth.logout();
      provider = null;
    };

    const onGetStarkAccount = async () => {
      if (!provider) {
        console.log("provider not initialized yet");
        return;
      }
      const rpc = new RPC(provider as SafeEventEmitterProvider);
      const starkaccounts = await rpc.getStarkAccount();
      console.log(starkaccounts);
    };

    const getStarkKey = async () => {
      if (!provider) {
        console.log("provider not initialized yet");
        return;
      }
      const rpc = new RPC(provider as SafeEventEmitterProvider);
      const starkKey = await rpc.getStarkKey();
      console.log(starkKey);
    };

    const onMintRequest = async () => {
      if (!provider) {
        console.log("provider not initialized yet");
        return;
      }
      const rpc = new RPC(provider as SafeEventEmitterProvider);
      const request = await rpc.onMintRequest();
      console.log(request);
    };

    const onDepositRequest = async () => {
      if (!provider) {
        console.log("provider not initialized yet");
        return;
      }
      const rpc = new RPC(provider as SafeEventEmitterProvider);
      const request = await rpc.onDepositRequest();
      console.log(request);
    };

    const onWithdrawalRequest = async () => {
      if (!provider) {
        console.log("provider not initialized yet");
        return;
      }
      const rpc = new RPC(provider as SafeEventEmitterProvider);
      const request = await rpc.onWithdrawalRequest();
      console.log(request);
    };
    return {
      loading,
      loginButtonStatus,
      connecting,
      provider,
      web3auth,
      login,
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
</style>
