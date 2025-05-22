<script setup lang="ts">
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useSolanaWallet, useSignTransaction } from "@web3auth/modal/vue/solana";

const { data: signedTransaction, error, loading: isPending, signTransaction } = useSignTransaction();
const { accounts, connection } = useSolanaWallet();

async function submit(event: Event) {
  event.preventDefault();
  const formData = new FormData(event.target as HTMLFormElement);
  const to = formData.get('address') as string;
  const value = formData.get('value') as string;

  if (!connection.value || !accounts.value || accounts.value.length === 0) return;

  const block = await connection.value.getLatestBlockhash();
  const TransactionInstruction = SystemProgram.transfer({
    fromPubkey: new PublicKey(accounts.value[0]),
    toPubkey: new PublicKey(to),
    lamports: Number(value) * LAMPORTS_PER_SOL,
  });

  const transaction = new Transaction({
    blockhash: block.blockhash,
    lastValidBlockHeight: block.lastValidBlockHeight,
    feePayer: new PublicKey(accounts.value[0]),
  }).add(TransactionInstruction);
  
  signTransaction(transaction);
}
</script>

<template>
  <div class="container">
    <div class="stack">
      <h2>Sign Transaction</h2>
      <form class="set" @submit.prevent="submit">
        <input name="address" placeholder="Address" required />
        <input
          name="value"
          placeholder="Amount (SOL)"
          type="number"
          step="0.01"
          required
        />
        <button type="submit" :disabled="isPending">
          {{ isPending ? 'Signing...' : 'Sign' }}
        </button>
      </form>
      <div v-if="signedTransaction">Signed Transaction: {{ signedTransaction }}</div>
      <div v-if="error">
        Error: {{ error.message }}
      </div>
    </div>
  </div>
</template>
