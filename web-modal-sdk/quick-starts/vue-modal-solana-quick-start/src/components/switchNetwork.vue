<script setup lang="ts">
import { useWeb3Auth, useSwitchChain } from '@web3auth/modal/vue';
import { computed } from 'vue';

const { web3Auth } = useWeb3Auth();
const { switchChain, error } = useSwitchChain();

const filteredChains = computed(() => {
  const chains = web3Auth.value?.coreOptions?.chains || [];
  return chains.filter(
    (chain: any) => chain.chainId === '0x67' || chain.chainId === '0x66' || chain.chainId === '0x65'
  );
});


const currentChainName = computed(() => web3Auth.value?.currentChain?.displayName || '');
</script>

<template>
  <div>
    <h2>Switch Chain</h2>
    <h3>Connected to {{ currentChainName }}</h3>
    <button
      v-for="chain in filteredChains"
      :key="chain.chainId"
      :disabled="web3Auth?.currentChain?.chainId === chain.chainId"
      @click="switchChain({ chainId: chain.chainId })"
      type="button"
      class="card"
    >
      {{ chain.displayName }}
    </button>
    <div v-if="error" class="error">{{ error.message }}</div>
  </div>
</template> 