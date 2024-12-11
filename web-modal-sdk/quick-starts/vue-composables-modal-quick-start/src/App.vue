<script setup lang="ts">
import Home from "./Home.vue";
// IMP START - Setup Web3Auth Provider
import { Web3AuthProvider } from "@web3auth/modal-vue-composables"
import web3AuthContextConfig from "./web3authContext";
// IMP END - Setup Web3Auth Provider
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- IMP START - Setup Web3Auth Provider -->
    <Web3AuthProvider :config="web3AuthContextConfig">
      <Home />
    </Web3AuthProvider>
    <!-- IMP END - Setup Web3Auth Provider -->
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