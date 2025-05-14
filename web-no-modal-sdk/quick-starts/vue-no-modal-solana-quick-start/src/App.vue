<script setup lang="ts">
import Home from "./Home.vue";
// IMP START - Setup Web3Auth Provider
import { Web3AuthProvider } from "@web3auth/no-modal/vue";
// IMP END - Setup Web3Auth Provider
import web3AuthContextConfig from "./web3authContext";

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