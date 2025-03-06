<!-- eslint-disable vue/no-ref-as-operand -->
<template>
  <div id="app">
    <h2>
      <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/modal" rel="noreferrer"> Web3Auth </a>
      Vue Composables Modal Quick Start
    </h2>

    <button v-if="status !== ADAPTER_STATUS.CONNECTED" class="card" @click="login" style="cursor: pointer">Login</button>

    <div v-if="status === ADAPTER_STATUS.CONNECTED">
      <div class="flex-container">
        <div>
          <button class="card" @click="getUserInfo" style="cursor: pointer">Get User Info</button>
        </div>
        <div>
          <button class="card" @click="getAccounts" style="cursor: pointer">Get Accounts</button>
        </div>
        <div>
          <button class="card" @click="getBalance" style="cursor: pointer">Get Balance</button>
        </div>
        <div>
          <button class="card" @click="signMessage" style="cursor: pointer">Sign Message</button>
        </div>
        <div>
          <button class="card" @click="sendTransaction" style="cursor: pointer">Send Transaction</button>
        </div>
        <div>
          <button class="card" @click="logout()" style="cursor: pointer">Logout</button>
        </div>
      </div>
    </div>
    <div id="console" style="white-space: pre-line">
      <p style="white-space: pre-line"></p>
    </div>

    <footer class="footer">
      <a
        href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-modal-sdk/quick-starts/vue-composables-modal-quick-start"
        target="_blank"
        rel="noopener noreferrer"
      >
        Source code
      </a>
      <a
        href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FWeb3Auth%2Fweb3auth-pnp-examples%2Ftree%2Fmain%2Fweb-modal-sdk%2Fquick-starts%2Fvue-composables-modal-quick-start&project-name=w3a-vue-modal&repository-name=w3a-vue-modal"
      >
        <img src="https://vercel.com/button" alt="Deploy with Vercel" />
      </a>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useWeb3Auth } from "@web3auth/modal-vue-composables";
// IMP START - Blockchain Calls
import RPC from "./ethersRPC";
import { ADAPTER_STATUS } from "@web3auth/base";
// import RPC from "./viemRPC";
// import RPC from "./web3RPC";
// IMP END - Blockchain Calls
const { status, connect, userInfo, provider, logout } = useWeb3Auth();

const login = async () => {
  // IMP START - Login
  connect();
  // IMP END - Login
};

const getUserInfo = async () => {
  // IMP START - Get User Information
  uiConsole(userInfo.value);
  // IMP END - Get User Information
};

// IMP START - Blockchain Calls
const getAccounts = async () => {
  if (!provider) {
    uiConsole("provider not initialized yet");
    return;
  }
  const address = await RPC.getAccounts(provider.value!);
  uiConsole(address);
};

const getBalance = async () => {
  if (!provider) {
    uiConsole("provider not initialized yet");
    return;
  }
  const balance = await RPC.getBalance(provider.value!);
  uiConsole(balance);
};

const signMessage = async () => {
  if (!provider) {
    uiConsole("provider not initialized yet");
    return;
  }
  const signedMessage = await RPC.signMessage(provider.value!);
  uiConsole(signedMessage);
};

const sendTransaction = async () => {
  if (!provider) {
    uiConsole("provider not initialized yet");
    return;
  }
  uiConsole("Sending Transaction...");
  const transactionReceipt = await RPC.sendTransaction(provider.value!);
  uiConsole(transactionReceipt);
};
// IMP END - Blockchain Calls

function uiConsole(...args: any[]): void {
  const el = document.querySelector("#console>p");
  if (el) {
    el.innerHTML = JSON.stringify(args || {}, null, 2);
  }
  console.log(...args);
}
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
