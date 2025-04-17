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

      <button v-if="status !== ADAPTER_STATUS.CONNECTED" class="card" @click="login">
        Login
      </button>

      <div v-if="status === ADAPTER_STATUS.CONNECTED" class="flex-col">
        <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(150px, 1fr))">
          <div>
            <button class="card" @click="getUserInfo">
              Get User Info
            </button>
          </div>
          <div>
            <button class="card" @click="getAccounts">
              Get Accounts
            </button>
          </div>
          <div>
            <button class="card" @click="getBalance">
              Get Balance
            </button>
          </div>
          <div>
            <button class="card" @click="signMessage">
              Sign Message
            </button>
          </div>
          <div>
            <button class="card" @click="sendTransaction">
              Send Transaction
            </button>
          </div>
          <div>
            <button class="card" @click="logout()">
              Logout
            </button>
          </div>
        </div>
      </div>
      <div id="console">
        <p></p>
      </div>

      <footer class="footer">
        <a href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-no-modal-sdk/quick-starts/vue-composables-no-modal-quick-start"
          target="_blank" rel="noopener noreferrer">
          Source code
        </a>
        <a
          href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FWeb3Auth%2Fweb3auth-pnp-examples%2Ftree%2Fmain%2Fweb-no-modal-sdk%2Fquick-starts%2Fvue-composables-no-modal-quick-start&project-name=w3a-vue-modal&repository-name=w3a-vue-modal">
          <img src="https://vercel.com/button" alt="Deploy with Vercel" />
        </a>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useWeb3Auth } from "@web3auth/no-modal-vue-composables";
import { ADAPTER_STATUS, WALLET_ADAPTERS } from "@web3auth/base";
const { status, connectTo, userInfo, provider, logout } = useWeb3Auth();

const login = async () => {
  // IMP START - Login
  await connectTo(WALLET_ADAPTERS.AUTH, {
    loginProvider: "google",
  });
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

<style scoped>
/* Container layout */
.container {
  width: 100%;
  padding: 0 1rem;
  margin: 0 auto;
}

.main {
  min-height: 100vh;
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Typography */
.title {
  font-size: 1.75rem;
  text-align: center;
  margin: 1.5rem 0;
  line-height: 1.2;
  font-weight: 600;
}

.title a {
  color: var(--primary-color);
  text-decoration: none;
}

/* Buttons and Cards */
button, .card {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.25rem;
  background-color: var(--bg-light);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  color: var(--text-color);
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
  width: 100%;
  margin: 0.5rem 0;
  text-align: center;
}

button:hover, .card:hover {
  background-color: var(--bg-hover);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

/* Utils */
.flex-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  width: 100%;
}

.flex-col {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

.grid {
  display: grid;
  gap: 1rem;
  width: 100%;
}

/* Console output */
#console {
  width: 100%;
  max-height: 250px;
  overflow: auto;
  word-wrap: break-word;
  font-family: monospace;
  font-size: 0.85rem;
  padding: 1rem;
  margin: 1.5rem 0;
  background-color: var(--bg-light);
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
  text-align: left;
}

/* Footer */
.footer {
  width: 100%;
  padding: 2rem 0;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-top: 3rem;
  flex-wrap: wrap;
}

.footer a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s ease;
}

.footer a:hover {
  color: var(--primary-color);
}

/* Responsive */
@media (min-width: 640px) {
  .container {
    max-width: 640px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}
</style>
