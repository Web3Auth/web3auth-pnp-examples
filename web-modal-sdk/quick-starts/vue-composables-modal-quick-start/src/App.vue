<script setup lang="ts">
import Home from "./Home.vue";
import { Web3AuthProvider } from "@web3auth/modal-vue-composables"
import web3AuthContextConfig from "./web3authContext";
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Web3AuthProvider :config="web3AuthContextConfig">
      <Home />
    </Web3AuthProvider>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>