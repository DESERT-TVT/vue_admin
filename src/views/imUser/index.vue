<template>
<div class="imUser">
  <Conversation class="conversation" @selectedUser="handleSelectUser"/>
  <Chat class="chat" :userId="selectedUser"/>
</div>
</template>

<script lang="ts" setup>
import Chat from '@/im-sdk/components/Chat.vue';
import Conversation from '@/im-sdk/components/Conversation.vue';
import { ref } from 'vue';

const selectedUser = ref('')

function handleSelectUser(user:string) {
  selectedUser.value = user
}
</script>

<style lang="scss" scoped>
.imUser{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  // height: 100%;
  margin-top: 50px;
  gap: 20px;
}
.conversation{
  height: 600px;
  width: 300px;
}
.chat{
  height: 600px;
  width: 700px;
}
</style>