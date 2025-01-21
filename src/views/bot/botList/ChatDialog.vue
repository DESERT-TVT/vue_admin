<template>
  <el-dialog
      v-model="isDialogVisible"
      title="Chat History"
      width="50%"
      @close="handleClose"
  >
    <div ref="chatContainer" class="chat-container" @scroll="handleScroll">
      <div v-for="message in chatData" :key="message.id" class="message-item">
        <div
            :class="message.source === 1 ? 'message-from' : 'message-to'"
            class="message-content"
        >
          {{ message.message }}
        </div>
        <div class="message-time">
          {{ message.createTime }}
        </div>
      </div>
    </div>

    <div :class="isAtBottom ? 'input-container-bottom' : 'input-container-floating'">
      <el-input
          v-model="newMessage"
          placeholder="输入需要手工回复的消息"
          @keyup.enter="sendMessage"
          class="message-input"
      />
      <el-button @click="sendMessage" type="primary">发送</el-button>
    </div>

    <template #footer>
      <el-button @click="isDialogVisible = false">Close</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import ElementPlus, {ElDialog, ElButton, ElInput, ElMessage} from 'element-plus';
import {APIPostMessage, PostMessageParams} from "@/api/ai/aiApi";
import {accessUserWithDraw} from "@/api/payment/withdraw";


const chatData = ref<any>([]);
const isDialogVisible = ref(false);
const newMessage = ref('');
const isAtBottom = ref(true);
const chatContainer = ref(null);
const botId = ref(0);
const userId = ref(0);

const init = (data:any) => {
  chatData.value = data.chatMessage;
  botId.value = data.botId;
  isDialogVisible.value = true;
  userId.value = data.userId
  nextTick(() => scrollToBottom());
};

const handleClose = () => {
  isDialogVisible.value = false;
};

const handleScroll = () => {
  if (chatContainer.value) {
    const { scrollTop, scrollHeight, clientHeight } = chatContainer.value;
    isAtBottom.value = scrollTop + clientHeight >= scrollHeight - 10;
  }
};

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const sendMessage = () => {
  if (newMessage.value.trim() === '') return;
  // 添加消息到 chatData
  chatData.value.push({
    id: Date.now(),
    message: newMessage.value,
    source: 0,  // 假设 source 0 是当前用户
  });


  nextTick(() => scrollToBottom());

  const messageParams: PostMessageParams = {
    userId: userId.value,
    botId: botId.value,
    message: newMessage.value,
  };

  APIPostMessage(messageParams).then((resp: any) => {
    ElMessage.success("指令已发送")
  })
  // 清空输入框并滚动到底部
  newMessage.value = '';
};

defineExpose({
  init
});
</script>

<style scoped>
.chat-container {
  max-height: 400px;
  overflow-y: auto;
  padding: 20px;
}

.message-item {
  margin-bottom: 10px;
}

.message-content {
  padding: 10px;
  border-radius: 5px;
  max-width: 70%;
  word-wrap: break-word;
}

.message-from {
  background-color: #e6f7ff;
  text-align: left;
}

.message-to {
  background-color: #f5f5f5;
  text-align: right;
  align-self: flex-end;
}

.input-container-floating {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 50%;
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #fff;
  border-top: 1px solid #ddd;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.input-container-bottom {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #fff;
  border-top: 1px solid #ddd;
}
.message-time {
  font-size: 12px;
  color: #888;
}

.message-input {
  flex: 1;
  margin-right: 10px;
}
</style>
