<!-- eslint-disable vue/no-ref-as-operand -->
<template>
  <div class="container">
    <main class="main">
      <h2 class="title">
        <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/modal" rel="noreferrer">
          Web3Auth
        </a>
        Vue Composables No Modal Quick Start
      </h2>

      <div v-if="!isConnected" class="card-container">
        <button class="card" @click="connect(WALLET_CONNECTORS.AUTH, { authConnection: AUTH_CONNECTION.GOOGLE })">
          Login
        </button>
        <div v-if="connectLoading" class="loading">Connecting...</div>
        <div v-if="connectError" class="error">{{ connectError.message }}</div>
      </div>

      <div v-if="isConnected" class="flex-col">
        <h2>Connected to {{ connectorName }}</h2>
        <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(150px, 1fr))">
          <div>
            <button class="card" @click="uiConsole(userInfo)">
              Get User Info
            </button>
          </div>
          <div>
            <button class="card" @click="disconnect()">
              Log Out
            </button>
            <div v-if="disconnectLoading" class="loading">Disconnecting...</div>
            <div v-if="disconnectError" class="error">{{ disconnectError.message }}</div>
          </div>
        </div>
      </div>
      <Account v-if="isConnected" />
      <SendTransaction v-if="isConnected" />
      <Balance v-if="isConnected" />
      <SwitchNetwork v-if="isConnected" />
      
      <div id="console">
        <p></p>
      </div>

      <footer class="footer">
        <a href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-no-modal-sdk/quick-starts/vue-composables-no-modal-quick-start"
          target="_blank" rel="noopener noreferrer">
          Source code
        </a>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useWeb3AuthConnect, useWeb3AuthDisconnect, useWeb3AuthUser } from "@web3auth/no-modal/vue";
import { WALLET_CONNECTORS, AUTH_CONNECTION } from "@web3auth/no-modal";
import Account from './components/Account.vue';
import SendTransaction from './components/SendTransaction.vue';
import Balance from './components/Balance.vue';
import SwitchNetwork from './components/SwitchNetwork.vue';
// Web3Auth hooks (direct from library)
const { 
  connect, 
  isConnected, 
  connectorName, 
  loading: connectLoading, 
  error: connectError 
} = useWeb3AuthConnect();

const { 
  disconnect, 
  loading: disconnectLoading, 
  error: disconnectError 
} = useWeb3AuthDisconnect();

const { userInfo } = useWeb3AuthUser();

// Helper function for logging
const uiConsole = (...args: any[]): void => {
  const el = document.querySelector("#console>p");
  if (el) {
    el.innerHTML = JSON.stringify(args || {}, null, 2);
    console.log(...args);
  }
};
</script>
