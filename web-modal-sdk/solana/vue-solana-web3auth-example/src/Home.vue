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
import RPC from "./solanaRPC";

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
    const clientId = "BHr_dKcxC0ecKn_2dZQmQeNdjPgWykMkcodEHkVvPMo71qzOV6SgtoN8KCvFdLN7bf34JOm89vWQMLFmSfIo84A"; // get from https://dashboard.web3auth.io

    const web3auth = new Web3Auth({
      clientId,
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.SOLANA,
        chainId: "0x1", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
        rpcTarget: "https://api.mainnet-beta.solana.com", // This is the public RPC we have added, please pass on your own endpoint while creating an app
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
        uiConsole("error", error);
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
      const el = document.querySelector("#console>p")
      if (el) {
        el.innerHTML = JSON.stringify(args || {}, null, 2)
      }
    }

    return {
      loading,
      loginButtonStatus,
      connecting,
      provider,
      web3auth,
      login,
      logout,
      getUserInfo,
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
