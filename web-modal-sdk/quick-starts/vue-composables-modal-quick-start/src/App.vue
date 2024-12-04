<script lang="ts">
import { defineComponent } from "vue";
import Home from "./Home.vue";
import { Web3AuthProvider } from "@web3auth/modal-vue-composables";
import useWeb3AuthConfig from "./web3authContext";

const { configs } = useWeb3AuthConfig();

export default defineComponent({
  name: "App",
  components: {
    Home,
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<template>
  <div class="min-h-screen flex flex-col">
    <Web3AuthProvider :config="configs">
      <Home msg="Welcome to Your Vue.js + TypeScript App" />
    </Web3AuthProvider>
  </div>
</template>
