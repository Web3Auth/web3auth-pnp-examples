<script setup lang="ts">
import { useChainId, useSwitchChain } from '@wagmi/vue';

const chainId = useChainId();
const { chains, error, switchChain } = useSwitchChain();
</script>

<template>
  <div class="container">
    <div class="stack">
      <h2>Switch Chain</h2>
      <h3 class="text">Connected to {{ chainId }}</h3>
      <div class="set">
        <button
          v-for="chain in chains"
          :key="chain.id"
          :disabled="chainId === chain.id"
          @click="switchChain({ chainId: chain.id })"
          type="button"
          class="card"
        >
          {{ chain.name }}
        </button>
      </div>
      <div v-if="error" class="error">{{ error.message }}</div>
    </div>
  </div>
</template> 