<script setup lang="ts">
import { useSignMessage } from "@web3auth/modal/vue/solana";

const { data: hash, error, loading: isPending, signMessage } = useSignMessage();

function submit(event: Event) {
  event.preventDefault();
  const formData = new FormData(event.target as HTMLFormElement);
  const message = formData.get('message');
  signMessage(message!.toString());
}
</script>

<template>
  <div>
    <h2>Sign Message</h2>
    <form @submit.prevent="submit">
      <input name="message" placeholder="Message" required />
      <button :disabled="isPending" type="submit">
        {{ isPending ? 'Signing...' : 'Sign' }}
      </button>
    </form>
    <div v-if="hash" class="hash">Message Hash: {{ hash }}</div>
    <div v-if="error" class="error">
      Error: {{ error.message }}
    </div>
  </div>
</template>
