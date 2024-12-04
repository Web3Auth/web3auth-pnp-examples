<script setup lang="ts">
import Home from "./Home.vue";
import { Web3AuthProvider } from "@web3auth/no-modal-vue-composables"
import web3AuthContextConfig from "./web3authContext";
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Web3AuthProvider :config="web3AuthContextConfig">
      <Home msg="Welcome to Your Vue.js + TypeScript App" />
    </Web3AuthProvider>
  </div>
</template>

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