<script setup lang="ts">
import Home from "./Home.vue";
// IMP START - Setup Web3Auth Provider
import { Web3AuthProvider } from "@web3auth/modal/vue";
// IMP END - Setup Web3Auth Provider
import { WagmiProvider } from "@web3auth/modal/vue/wagmi";
import web3AuthContextConfig from "./web3authContext";

</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- IMP START - Setup Web3Auth Provider -->
    <Web3AuthProvider :config="web3AuthContextConfig">
		<WagmiProvider>
			<Home />
		</WagmiProvider>
    </Web3AuthProvider>
    <!-- IMP END - Setup Web3Auth Provider -->
  </div>
</template>