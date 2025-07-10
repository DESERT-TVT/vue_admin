<template>
  <div>
    <img v-if="[MessageState.failed].includes(status)" :src="SendFailUrl" class="icon" />
    <img v-else-if="[MessageState.sending].includes(status)" :src="loadingUrl" class="icon transform" />
  </div>
</template>

<script lang="ts" setup>
import SendFailUrl from '@/im-sdk/assets/sendFail.svg';
import loadingUrl from '@/im-sdk/assets/loading.svg';
import { MessageState } from '../types';
const { status } = defineProps<{
  status: number;
}>();

</script>

<style lang="scss" scoped>
.icon {
  width: 18px;
  height: 18px;
}
.transform{
  animation: spin 1s linear infinite ;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}
</style>
