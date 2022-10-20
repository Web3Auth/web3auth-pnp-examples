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
      <button class="rpcBtn" @click="getChainId" style="cursor: pointer">
        Get Chain ID
      </button>
      <button class="rpcBtn" @click="getAccounts" style="cursor: pointer">
        Get Accounts
      </button>
      <button class="rpcBtn" @click="getBalance" style="cursor: pointer">
        Get Balance
      </button>
      <button class="rpcBtn" @click="sendTransaction" style="cursor: pointer">
        Send Transaction
      </button>
      <button class="rpcBtn" @click="signMessage" style="cursor: pointer">
        Sign Message
      </button>
      <button class="rpcBtn" @click="getPrivateKey" style="cursor: pointer">
        Get Private Key
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
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import RPC from "./web3RPC";

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
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0x1",

        rpcTarget: "https://rpc.ankr.com/eth", // This is the public RPC we have added, please pass on your own endpoint while creating an app
      },
      uiConfig: {
        defaultLanguage: "en",
      },
    });

    onMounted(async () => {
      try {
        loading.value = true;

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

    const getChainId = async () => {
      if (!provider) {
        console.log("provider not initialized yet");
        return;
      }
      const rpc = new RPC(provider);
      const chainId = await rpc.getChainId();
      console.log(chainId);
    };
    const getAccounts = async () => {
      if (!provider) {
        console.log("provider not initialized yet");
        return;
      }
      const rpc = new RPC(provider);
      const address = await rpc.getAccounts();
      console.log(address);
    };

    const getBalance = async () => {
      if (!provider) {
        console.log("provider not initialized yet");
        return;
      }
      const rpc = new RPC(provider);
      const balance = await rpc.getBalance();
      console.log(balance);
    };

    const sendTransaction = async () => {
      if (!provider) {
        console.log("provider not initialized yet");
        return;
      }
      const rpc = new RPC(provider);
      const receipt = await rpc.sendTransaction();
      console.log(receipt);
    };

    const signMessage = async () => {
      if (!provider) {
        console.log("provider not initialized yet");
        return;
      }
      const rpc = new RPC(provider);
      const signedMessage = await rpc.signMessage();
      console.log(signedMessage);
    };

    const getPrivateKey = async () => {
      if (!provider) {
        console.log("provider not initialized yet");
        return;
      }
      const rpc = new RPC(provider);
      const privateKey = await rpc.getPrivateKey();
      console.log(privateKey);
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
