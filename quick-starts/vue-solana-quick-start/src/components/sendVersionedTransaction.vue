<script setup lang="ts">
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { useSolanaWallet, useSignAndSendTransaction } from "@web3auth/modal/vue/solana";

const { data: hash, error, loading: isPending, signAndSendTransaction } = useSignAndSendTransaction();
const { accounts, connection } = useSolanaWallet();

async function submit(event: Event) {
  event.preventDefault();
  const formData = new FormData(event.target as HTMLFormElement);
  const to = formData.get('address') as string;
  const value = formData.get('value') as string;

  const connectionValue = connection.value;
  const accountsValue = accounts.value;
  
  if (!connectionValue || !accountsValue || accountsValue.length === 0) {
    console.error("Connection or accounts not available");
    return;
  }

  const block = await connectionValue.getLatestBlockhash();
  const TransactionInstruction = SystemProgram.transfer({
    fromPubkey: new PublicKey(accountsValue[0]),
    toPubkey: new PublicKey(to),
    lamports: Number(value) * LAMPORTS_PER_SOL,
  });

  const transactionMessage = new TransactionMessage({
    recentBlockhash: block.blockhash,
    instructions: [TransactionInstruction],
    payerKey: new PublicKey(accountsValue[0]),
  });

  const transaction = new VersionedTransaction(transactionMessage.compileToV0Message());
  signAndSendTransaction(transaction);
}
</script>

<template>
  <div>
    <h2>Send Versioned Transaction</h2>
    <form @submit.prevent="submit">
      <input name="address" placeholder="Address" required />
      <input
        name="value"
        placeholder="Amount (SOL)"
        type="number"
        step="0.01"
        required
      />
      <button :disabled="isPending" type="submit">
        {{ isPending ? 'Confirming...' : 'Send' }}
      </button>
    </form>
    <div v-if="hash">Transaction Hash: {{ hash }}</div>
    <div v-if="error">Error: {{ error.message }}</div>
  </div>
</template>
