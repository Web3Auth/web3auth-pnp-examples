<script setup lang="ts">
import {
  useAccount,
  useConfig,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from '@wagmi/vue';
import { computed } from 'vue';

const config = useConfig();

const { address, connector } = useAccount();
const { disconnect } = useDisconnect();
const { data: ensName } = useEnsName({ address });
const { data: ensAvatar } = useEnsAvatar({ name: ensName });

const formattedAddress = computed(() => {
  if (!address.value) return null;
  return `${address.value}`;
});
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="inline">
        <img
          v-if="ensAvatar"
          alt="ENS Avatar"
          className="avatar"
          :src="ensAvatar"
        />
        <div v-else className="avatar" />

        <div class="stack">
          <div v-if="ensName" class="text">
            {{ ensName }} ({{ formattedAddress }})
          </div>
          <div v-else-if="formattedAddress" class="text">
            {{ formattedAddress }}
          </div>
          <div class="subtext">
            Connected to {{ connector?.name }} Connector
          </div>
        </div>
      </div>
      <button class="button" @click="disconnect()" type="button">
        Disconnect
      </button>
    </div>
  </div>
</template>
