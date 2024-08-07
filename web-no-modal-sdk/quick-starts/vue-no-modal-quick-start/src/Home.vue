<!-- eslint-disable vue/no-ref-as-operand -->
<template>
  <div id="app">
    <h2>
      <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/no-modal" rel="noreferrer"> Web3Auth </a>
      Vue.js Quick Start
    </h2>

    <button v-if="!loggedIn" class="card" @click="login" style="cursor: pointer">Login</button>

    <div v-if="loggedIn">
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
          <button class="card" @click="logout" style="cursor: pointer">Logout</button>
        </div>
      </div>
    </div>
    <div id="console" style="white-space: pre-line">
      <p style="white-space: pre-line"></p>
    </div>

    <footer class="footer">
      <a
        href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-no-modal-sdk/quick-starts/vue-no-modal-quick-start"
        target="_blank"
        rel="noopener noreferrer"
      >
        Source code
      </a>
      <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FWeb3Auth%2Fweb3auth-pnp-examples%2Ftree%2Fmain%2Fweb-no-modal-sdk%2Fquick-starts%2Fvue-no-modal-quick-start&project-name=w3a-vue-no-modal&repository-name=w3a-vue-no-modal">
        <img src="https://vercel.com/button" alt="Deploy with Vercel" />
      </a>
    </footer>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
// IMP START - Quick Start
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { CHAIN_NAMESPACES, IProvider, UX_MODE, WALLET_ADAPTERS, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
// IMP END - Quick Start
// import RPC from "./ethersRPC";
// import RPC from "./viemRPC";
import RPC from "./web3RPC";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Home",
  props: {
    msg: String,
  },
  setup() {
    const loggedIn = ref<boolean>(false);
    let provider: IProvider | null = null;

    // IMP START - SDK Initialization
    // IMP START - Dashboard Registration
    const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // get from https://dashboard.web3auth.io
    // IMP END - Dashboard Registration

    const chainConfig = {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: "0xaa36a7", // Please use 0x1 for Mainnet, 11155111(0xaa36a7) for Sepolia Testnet
      rpcTarget: "https://rpc.ankr.com/eth_sepolia",
      displayName: "Sepolia Testnet",
      blockExplorerUrl: "https://sepolia.etherscan.io/",
      ticker: "ETH",
      tickerName: "Ethereum",
      logo: "https://openlogin.com/images/ethereum.png",
    };

    const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

    const web3auth = new Web3AuthNoModal({
      clientId,
      web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
      privateKeyProvider,
    });

    const openloginAdapter = new OpenloginAdapter();
    web3auth.configureAdapter(openloginAdapter);
    // IMP END - SDK Initialization

    onMounted(async () => {
      const init = async () => {
        try {
          // IMP START - SDK Initialization
          await web3auth.init();
          // IMP END - SDK Initialization
          provider = web3auth.provider;

          if (web3auth.connected) {
            loggedIn.value = true;
          }
        } catch (error) {
          console.error(error);
        }
      };

      init();
    });

    const login = async () => {
      // IMP START - Login
      provider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
        loginProvider: "google",
      });
      // IMP END - Login

      if (web3auth.connected) {
        loggedIn.value = true;
      }
    };

    const getUserInfo = async () => {
      // IMP START - Get User Information
      const user = await web3auth.getUserInfo();
      // IMP END - Get User Information
      uiConsole(user);
    };

    const logout = async () => {
      // IMP START - Logout
      await web3auth.logout();
      // IMP END - Logout
      provider = null;
      loggedIn.value = false;
      uiConsole("logged out");
    };

    // IMP START - Blockchain Calls
    const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const address = await RPC.getAccounts(provider);
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const balance = await RPC.getBalance(provider);
    uiConsole(balance);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const signedMessage = await RPC.signMessage(provider);
    uiConsole(signedMessage);
  };


  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    uiConsole("Sending Transaction...");
    const transactionReceipt = await RPC.sendTransaction(provider);
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

    return {
      loggedIn,
      provider,
      web3auth,
      login,
      logout,
      getUserInfo,
      getAccounts,
      getBalance,
      signMessage,
      sendTransaction,
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
