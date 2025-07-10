<template>
  <div
    class="videoMessage"
    :style="{ flexDirection: isSelf ? 'row-reverse' : 'row' }"
  >
    <CacheImg
      :src="isSelf ? self.mine?.avatar : user?.avatar"
      class="avatar"
      @click="onViewUser(isSelf ? self.mine! : user!)"
    />
    <div class="msg_box" :style="{ alignItems: isSelf ? 'end' : 'start' }">
      <div class="content_box">
        <SendStatus :status="data.state" v-if="isSelf" />
        <div
          class="video-cover-wrapper"
          :style="{ height: videoHeight(data.width, data.height) + 'px' }"
        >
          <!-- 视频封面图 -->
          <img
            ref="smallVideo"
            :src="data.cover"
            class="video-cover"
            @click="visible = !visible"
          />

          <!-- 播放按钮 -->
          <img
            :src="PlayVideoImg"
            class="play-button"
            @click.stop="visible = !visible"
          />
        </div>
      </div>
      <TimeCost :message="data" :self_message="isSelf" />
      <VideoPreview :url="[data.url]" v-if="visible" v-model="visible" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import TimeCost from '@/im-sdk/widget/TimeCost.vue';
import SendStatus from '@/im-sdk/widget/SendStatus.vue';
import { ImUserData, MessageCommon, VideoContent } from '@/im-sdk/types';
import CacheImg from '@/im-sdk/components/CacheImg.vue';
import PlayVideoImg from '@/im-sdk/assets/playVideo.svg';
import ImDataCenter from '@/im-sdk/ImDataCenter';
import { useRoute } from 'vue-router';
import config from '@/im-sdk/config';
import { ref } from 'vue';
type VideoMessage = MessageCommon & VideoContent;
const { data, isSelf } = defineProps<{
  data: VideoMessage;
  isSelf: boolean;
}>();
//预览
const visible = ref(false);

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

// 计算高度
const videoHeight = (width: number, height: number) => {
  return width < 148 ? height : height * (148 / width);
};
</script>

<style lang="scss" scoped>
.videoMessage {
  display: flex;
  align-items: start;
  gap: 0.12rem;
  .avatar {
    width: 0.48rem;
    height: 0.48rem;
    border-radius: 50%;
    overflow: hidden;
  }
  .video-cover-wrapper {
    position: relative;
    display: inline-block;
    width: 100%;
    cursor: pointer;
    max-width: 1.48rem;
    border-radius: 0.12rem;
    overflow: hidden;
  }

  .video-cover {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }

  /* 播放按钮 */
  .play-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: none;
    border-radius: 50%;
    width: .32rem;
    height: .32rem;
    text-align: center;
    padding: 0;
    z-index: 10;
  }
  .msg_box {
    display: flex;
    flex-direction: column;
    .content_box {
      display: flex;
      align-items: end;
      gap: 0.08rem;
      border-radius: 0.12rem;
      overflow: hidden;
      .video {
        border-radius: 0.12rem;
        overflow: hidden;
      }
    }
  }
}

.video {
  border-radius: 8px;
  max-width: 100%;
  cursor: pointer;
}

/* 全屏遮罩 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.video-wrapper {
  position: relative;
  width: 90%;
  max-width: 600px;
}

.full-video {
  width: 100%;
  height: auto;
  border-radius: 12px;
}

.close-btn {
  position: absolute;
  top: -40px;
  right: 0;
  font-size: 32px;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
}
</style>
