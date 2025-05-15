<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useSolanaWallet } from "@web3auth/modal/vue/solana";
import { useWeb3Auth } from "@web3auth/modal/vue";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

const { web3Auth } = useWeb3Auth();
const { accounts, connection } = useSolanaWallet();
const balance = ref<number | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

const fetchBalance = async () => {
  if (!web3Auth.value?.connected) {
    error.value = "Please connect your wallet first";
    return;
  }
    try {
      isLoading.value = true;
      error.value = null;
      // Check if accounts exist and have values before creating PublicKey
      if (!accounts.value || accounts.value.length === 0) {
        console.error("No accounts found. Please connect your wallet.", accounts.value);
        throw new Error("No accounts found. Please connect your wallet.");
      }
      const publicKey = new PublicKey(accounts.value[0]);
      const balanceResult = await connection.value!.getBalance(publicKey);
      balance.value = balanceResult;
    } catch (err) {
      console.error("Error fetching balance:", err);
      error.value = err instanceof Error ? err.message : "Unknown error";
      balance.value = null;
    } finally {
      isLoading.value = false;
    }
};

// Fetch balance when connection or accounts change
watch([connection, accounts], () => {
  if (web3Auth.value?.connected) {
    fetchBalance();
  }
});

// Initial fetch on component mount
onMounted(() => {
  if (web3Auth.value?.connected) {
    fetchBalance();
  }
});
</script>

<template>
  <div>
    <h2>Balance</h2>
    <div v-if="balance !== null">
      <span>{{ balance / LAMPORTS_PER_SOL }} SOL</span>
    </div>
    <div v-if="isLoading" class="loading">Loading...</div>
    <div v-if="error" class="error">Error: {{ error }}</div>
    <button @click="fetchBalance" type="button" class="card" :disabled="isLoading">
      Fetch Balance
    </button>
  </div>
</template> 