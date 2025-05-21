<script setup lang="ts">
import Home from "./Home.vue";
// IMP START - Setup Web3Auth Provider
import { Web3AuthProvider } from "@web3auth/modal/vue";
// IMP END - Setup Web3Auth Provider
// IMP START - Setup Wagmi Provider
import { WagmiProvider } from "@web3auth/modal/vue/wagmi";
// IMP END - Setup Wagmi Provider
import web3AuthContextConfig from "./web3authContext";

</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- IMP START - Setup Web3Auth Provider -->
    <Web3AuthProvider :config="web3AuthContextConfig">
		<!-- IMP START - Setup Wagmi Provider -->
		<WagmiProvider>
			<Home />
		</WagmiProvider>
    <!-- IMP END - Setup Wagmi Provider -->
    </Web3AuthProvider>
    <!-- IMP END - Setup Web3Auth Provider -->
  </div>
</template>