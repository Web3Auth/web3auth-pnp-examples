<script setup lang="ts">
import { useAccount, useBalance } from '@wagmi/vue';
import { formatUnits } from 'viem';

const { address } = useAccount();
const { data, isLoading, error } = useBalance({ address });
</script>

<template>
  <div class="container">
    <div class="stack">
      <h2>Balance</h2>
      <div class="row">
        <div>
          <span v-if="data?.value !== undefined" class="text">
            {{ formatUnits(data.value, data.decimals) }} {{ data.symbol }}
          </span>
          <span v-if="isLoading" class="loading">Loading...</span>
          <span v-if="error" class="error">Error: {{ error.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template> 