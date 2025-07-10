<template>
  <div
    class="textMessage"
    :style="{ flexDirection: isSelf ? 'row-reverse' : 'row' }"
  >
    <CacheImg :src="isSelf ? self.mine?.avatar : user?.avatar" class="avatar" @click="onViewUser(isSelf ? self.mine! : user!)"/> 
    <div class="msg_box" :style="{ alignItems: isSelf ? 'end' : 'start' }">
      <div class="content_box">
        <SendStatus :status="data.state" v-if="isSelf" />
        <div
          class="content"
          :style="
            isSelf
              ? {
                  backgroundColor: '#F0F0F0',
                  borderRadius: '12px 4px 12px 12px',
                }
              : {
                  backgroundColor: '#FFF',
                  borderRadius: '4px 12px 12px 12px',
                }
          "
        >
          {{ (data as TxtContent).msg }}
        </div>
      </div>
      <TimeCost :message="data" :self_message="isSelf"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CacheImg from '@/im-sdk/components/CacheImg.vue';
import SendStatus from '@/im-sdk/widget/SendStatus.vue';
import TimeCost from '@/im-sdk/widget/TimeCost.vue';
import { ImUserData, MessageData, TxtContent } from '@/im-sdk/types';
import ImDataCenter from '@/im-sdk/ImDataCenter';
import { useRoute } from 'vue-router';
import { textAlign } from 'html2canvas/dist/types/css/property-descriptors/text-align';
import config from '@/im-sdk/config';
const { data, isSelf } = defineProps<{
  data: MessageData;
  isSelf: boolean;
}>();
const route = useRoute();

// 对方信息
const controller = ImDataCenter.getConversation(String(route.query.id), true);
const user = controller!.conversation.user;

// 个人信息
const self = ImDataCenter.data;

// 跳转用户详情
const onViewUser = (user: ImUserData) => {
    config.onViewUser?.(user);
};

</script>

<style lang="scss" scoped>
.textMessage {
  display: flex;
  align-items: start;
  gap: 12px;
  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
  }
  .msg_box {
    display: flex;
    flex-direction: column;
    .content_box {
      display: flex;
      align-items: end;
      gap: 8px;
      max-width: 232px;
      word-break: break-all;
   ß   .content {
        padding: 8px 12px;
        border-radius: 12px 4px 12px 12px;
      }
    }
  }
}
</style>
