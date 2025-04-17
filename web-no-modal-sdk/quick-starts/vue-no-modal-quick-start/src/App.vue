<script setup lang="ts">
import Home from "./Home.vue";
// IMP START - Setup Web3Auth Provider
import { Web3AuthProvider } from "@web3auth/no-modal-vue-composables"
import web3AuthContextConfig from "./web3authContext";
// IMP END - Setup Web3Auth Provider
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- IMP START - Setup Web3Auth Provider -->
    <Web3AuthProvider :config="web3AuthContextConfig">
      <component :is="Home" />
    </Web3AuthProvider>
    <!-- IMP END - Setup Web3Auth Provider -->
  </div>
</template>

<style>
:root {
	--primary-color: #0070f3;
	--primary-hover: #0051a8;
	--bg-color: #ffffff;
	--bg-light: #f9fafb;
	--bg-hover: #f1f5f9;
	--border-color: #e2e8f0;
	--text-color: #1e293b;
	--text-muted: #64748b;
	--radius: 8px;
	--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
	--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
	--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

* {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}

body {
	font-family: var(--font-sans);
	color: var(--text-color);
	background-color: var(--bg-color);
	line-height: 1.6;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>