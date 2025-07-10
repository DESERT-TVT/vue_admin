<template>
  <div
    class="textMessage"
    :style="{ flexDirection: isSelf ? 'row-reverse' : 'row' }"
  >
    <CacheImg
      :src="isSelf ? self.mine?.avatar : user?.avatar"
      class="avatar"
      @click="onViewUser(isSelf ? self.mine! : user!)"
    />
    <div class="msg_box" :style="{ alignItems: isSelf ? 'end' : 'start' }">
      <div class="content_box" @click="messageState.onClick">
        <div
          class="content"
          :style="{
            ...(isSelf
              ? {
                  backgroundColor: '#F0F0F0',
                  borderRadius: '.12rem .04rem .12rem .12rem',
                }
              : {
                  backgroundColor: '#FFF',
                  borderRadius: '.04rem .12rem .12rem .12rem',
                }),
            color: messageState.color,
          }"
        >
          {{ messageState.text }}
          <img :src="messageState.image" class="image" />
        </div>
      </div>
      <TimeCost :message="data" :self_message="isSelf" :system="true" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import CacheImg from '@/im-sdk/components/CacheImg.vue';
import TimeCost from '@/im-sdk/widget/TimeCost.vue';
import ConnectedCallImg from '@/im-sdk/assets/ConnectedCall.svg';
import NotConnectedCallImg from '@/im-sdk/assets/NotConnectedCall.svg';
import ConnectedVideoImg from '@/im-sdk/assets/ConnectedVideo.svg';
import NotConnectedVideoImg from '@/im-sdk/assets/NotConnectedVideo.svg';
import { CallContent, ImUserData, MessageData } from '@/im-sdk/types';
import ImDataCenter from '@/im-sdk/ImDataCenter';
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { formatDuration } from '@/im-sdk/utils/timestamp';
import callDataCenter from '@/im-sdk/callDataCenter';
import callEvent from '@/third/huanxin/CallEvent';
import config from '@/im-sdk/config';
type CallMessageData = MessageData & CallContent;
const { data, isSelf } = defineProps<{
  data: CallMessageData;
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

// 消息状态处理
const messageState = computed(() => {
  switch (data.result) {
    case 'calling':
      return {
        text: '正在呼叫中...',
        image: data.callType == 'video' ? ConnectedVideoImg : ConnectedCallImg,
        color: '#222222',
        onClick: () => {},
      };
    case 'ring':
      return {
        text: '对方正在邀请你通话...',
        image: data.callType == 'video' ? ConnectedVideoImg : ConnectedCallImg,
        color: '#222222',
        onClick: () => {},
      };
    case 'cancel':
      return {
        text: '已取消',
        image:
          data.callType == 'video' ? NotConnectedVideoImg : NotConnectedCallImg,
        color: '#FF3B67',
        onClick: () =>
          callEvent.startVideoChat(String(route.query.id), data.callType),
      };
    case 'refuse':
      return {
        text: isSelf ? '对方已拒绝' : '已拒绝',
        image:
          data.callType == 'video' ? NotConnectedVideoImg : NotConnectedCallImg,
        color: '#FF3B67',
        onClick: () =>
          callEvent.startVideoChat(String(route.query.id), data.callType),
      };
    case 'busy':
      return {
        text: '对方正在通话中',
        image:
          data.callType == 'video' ? NotConnectedVideoImg : NotConnectedCallImg,
        color: '#FF3B67',
        onClick: () =>
          callEvent.startVideoChat(String(route.query.id), data.callType),
      };
    case 'wait':
      return {
        text: '等待对方接听',
        image: data.callType == 'video' ? ConnectedVideoImg : ConnectedCallImg,
        color: '#222222',
        onClick: () => {},
      };
    case 'success':
      return {
        text:
          '通话时长' +
          (data.end ? formatDuration((data.end ?? 0) - (data.start ?? 0)) : ''),
        image: data.callType == 'video' ? ConnectedVideoImg : ConnectedCallImg,
        color: '#222222',
        onClick: () => {},
      };
    case 'finish':
      return {
        text:
          '通话时长' +
          (data.end ? formatDuration((data.end ?? 0) - (data.start ?? 0)) : ''),
        image: data.callType == 'video' ? ConnectedVideoImg : ConnectedCallImg,
        color: '#222222',
        onClick: () => {},
      };
    case 'abort':
      return {
        text:
          '通话异常中止' +
          (data.end ? formatDuration((data.end ?? 0) - (data.start ?? 0)) : ''),
        image:
          data.callType == 'video' ? NotConnectedVideoImg : NotConnectedCallImg,
        color: '#FF3B67',
        onClick: () =>
          callEvent.startVideoChat(String(route.query.id), data.callType),
      };
    case 'failed':
      return {
        text: '通话失败',
        image:
          data.callType == 'video' ? NotConnectedVideoImg : NotConnectedCallImg,
        color: '#FF3B67',
        onClick: () =>
          callEvent.startVideoChat(String(route.query.id), data.callType),
      };
  }
});
</script>

<style lang="scss" scoped>
.textMessage {
  display: flex;
  align-items: start;
  gap: 0.12rem;
  .avatar {
    width: 0.48rem;
    height: 0.48rem;
    border-radius: 50%;
    overflow: hidden;
  }
  .msg_box {
    display: flex;
    flex-direction: column;
    .content_box {
      display: flex;
      align-items: end;
      gap: 0.08rem;
      max-width: 2.32rem;
      .content {
        padding: 0.08rem 0.12rem;
        border-radius: 0.12rem 0.04rem 0.12rem 0.12rem;
        display: flex;
        align-items: center;
        gap: 0.04rem;
        font-weight: 400;
        font-size: 0.16rem;
        color: #ff3b67;
        line-height: 0.22rem;
        .image {
          width: 0.18rem;
          height: 0.18rem;
        }
      }
    }
  }
}
</style>
