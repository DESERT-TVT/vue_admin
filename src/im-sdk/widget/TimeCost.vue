<template>
  <div class="timestamp">
    <div class="deductions" v-if="message.ext?.goldCoins && self_message && !system">
      -{{ message.ext?.goldCoins }}{{ '金币' }}
    </div>
    <div class="text">
      {{ TimeHoursMinters(message.time) }}
    </div>
    <img v-if="message.isRead && self_message" :src="ReadImg" alt="" />
  </div>
</template>

<script lang="ts" setup>
import ReadImg from '@/im-sdk/assets/read.svg';
import { TimeHoursMinters } from '../utils/timestamp';
import { MessageData } from '../types';
const { message, self_message,system } = defineProps<{
  message: MessageData;
  self_message: boolean;
  system?: boolean;
}>();
</script>

<style lang="scss" scoped>
.timestamp {
  font-weight: 400;
  font-size: 12px;
  color: #b1b1b1;
  line-height: 18px;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 4px;
}
</style>
