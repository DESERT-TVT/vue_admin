<template>
  <Teleport to="body">
    <!-- 未接通 -->
    <div
      class="bubble"
      :style="{ '--bg-url': `url(${targetUser?.avatar})` }"
      v-if="callState.state === CallState.calling"
    >
      <div class="info">
        <div class="avatar_container">
          <img :src="targetUser?.avatar" alt="avatar" class="avatar" />
          <div class="info">
            <CacheImg
              :src="targetUser?.gender ? manImg : womanImg"
              class="gender"
            />
            <p>{{ targetUser?.age }}</p>
          </div>
        </div>
        <div class="nickname">
          {{ targetUser?.nickname }}
        </div>
        <div class="balanceOrPrice">
          {{
            (callState.type === 'video'
              ? targetUser?.videoChatPrice
              : targetUser?.voiceChatPrice) + $t('call.gold/min')
          }}
        </div>
        <div class="callUtil">{{ $t('call.invitedPass') }}</div>
      </div>
      <div class="btns" :style="{ gap: gap }">
        <!-- 是否是拨打方 -->
        <template v-if="callState.isCallOut">
          <img :src="microphoneImg" alt="img" class="btn" />
          <img
            :src="refuseImg"
            alt="img"
            class="btn"
            @click="callDataCenter.cancel()"
          />
          <img
            :src="cameraImg"
            alt="img"
            class="btn"
            @click="callDataCenter.accept()"
          />
        </template>
        <template v-else>
          <img
            :src="refuseImg"
            alt="img"
            class="btn"
            @click="callDataCenter.refuse()"
          />
          <img
            :src="cameraImg"
            alt="img"
            class="btn"
            @click="callDataCenter.accept()"
          />
        </template>
      </div>
    </div>
    <div
      class="bubble_apply"
      :style="{ pointerEvents: scaleView ? 'auto' : 'none' }"
      v-show="callState.state === CallState.talking"
    >
      <!-- 远端视频容器 -->
      <ScaleView
        v-show="callState.state != CallState.calling"
        :class="scaleView ? 'bubble_apply_content' : 'scale_view'"
        ref="remoteVideoEl"
        :scaleView="scaleView"
        :controller="controller"
        @scaleExpand="setScaleTool"
      ></ScaleView>
      <!-- 本地视频容器 -->
      <div class="scale_view" ref="localVideoEl" v-show="scaleView">
        <div class="closed_target" v-show="!controller.Camera">
          <img :src="shotVideoImg" alt="img" class="shot_video_img" />
          <span>{{ $t('call.closedVideo') }}</span>
        </div>
      </div>
      <div class="top_tools" v-show="scaleView">
        <div class="user_avatar">
          <div class="info">
            <CacheImg :src="targetUser?.avatar" class="avatar" />
            <div class="nickname">
              {{ targetUser?.nickname }}
            </div>
          </div>
          <div class="care">
            {{ $t('call.apply') }}
          </div>
        </div>
        <div class="tools">
          <div class="time">{{ state.timeString }}</div>
          <div class="camera">
            <img
              :src="reversalToolsImg"
              class="model"
              @click="reverseCamera()"
            />
          </div>
          <div class="scale">
            <img :src="scaleToolsImg" class="model" @click="setScaleTool()" />
          </div>
        </div>
      </div>
      <div class="btns" :style="{ gap: gapOn }" v-show="scaleView">
        <template v-if="selfUser?.online">
          <img
            :src="microphoneImgComputed"
            class="btn"
            @click="changeVoice()"
          />
          <img :src="finish" class="btn" @click="finishCall()" />
          <img :src="cameraImgComputed" class="btn" @click="changeCamera()" />
        </template>
        <template v-else>
          <img
            :src="microphoneImgComputed"
            class="btn"
            @click="changeVoice()"
          />
          <img :src="cameraImgComputed" class="btn" @click="changeCamera()" />
          <img :src="finish" class="btn" @click="finishCall()" />
          <!-- <img :src="giftImg" class="btn"> -->
          <img :src="moreBtn" class="btn" />
        </template>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from 'vue';
import refuseImg from '@/im-sdk/assets/refuse.svg';
import CacheImg from '@/im-sdk/components/CacheImg.vue';
import finish from '@/im-sdk/assets/finish.svg';
import microphoneImg from '@/im-sdk/assets/microphone.svg';
import reversalToolsImg from '@/im-sdk/assets/reversalTools.svg';
import scaleToolsImg from '@/im-sdk/assets/scaleTools.svg';
import moreBtn from '@/im-sdk/assets/moreBtn.svg';
import microphoneCloseImg from '@/im-sdk/assets/microphoneClose.svg';
import speakerImg from '@/im-sdk/assets/speaker.svg';
import speakerCloseImg from '@/im-sdk/assets/speakerClose.svg';
import cameraImg from '@/im-sdk/assets/Camera.svg';
import cameraCloseImg from '@/im-sdk/assets/CameraClose.svg';
import giftImg from '@/im-sdk/assets/giftCall.svg';
import manImg from '@/im-sdk/assets/man.svg';
import womanImg from '@/im-sdk/assets/woman.svg';
import shotVideoImg from '@/im-sdk/assets/shutVideo.svg';
import ScaleView from '@/im-sdk/widget/callBubble/components/scaleView.vue';
import BigCameraImg from '@/im-sdk/assets/BigCamera.svg';
import { CallState } from '@/im-sdk/types';
import callDataCenter from '../../callDataCenter';
import { UserData } from '@/api/protocol';
import { Enhance, UserDetail } from './type';
import callRoom from '@/third/huanxin/callRoom';
import { ICameraVideoTrack } from 'agora-rtc-sdk-ng';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import callEvent from '@/third/huanxin/CallEvent';

dayjs.extend(duration);
const callState = callDataCenter.data;

// 计算按钮个数
const buttonCount = computed(() => {
  if (callState.state === CallState.calling) {
    return 2;
  } else {
    return targetUser.value?.online ? 4 : 3;
  }
});

// 根据按钮个数设置 gap(未接通)
const gap = computed(() => {
  if (buttonCount.value === 2) return '0.4rem';
  if (buttonCount.value === 3) return '0.4rem';
  if (buttonCount.value === 4) return '0.24rem';
  return '0.8rem';
});

// 根据按钮个数设置 gap(接通)
const gapOn = computed(() => {
  if (selfUser.value?.online) return '0.4rem';
  return '0.18rem';
});

// 完成通话
const finishCall = () => {
  callEvent.finishVideoChat();
  state.isFinished = true;
};

/* 视频设置相关 */
/* 控制媒体 */
const controller = reactive({
  Camera: true,
  Voice: true,
});
//摄像控制
const changeCamera = () => {
  controller.Camera = !controller.Camera;
  callRoom.setCamera(controller.Camera);
};
//音频控制
const changeVoice = () => {
  controller.Voice = !controller.Voice;
  callRoom.setVoice(controller.Voice);
};

// 麦克风显示
const microphoneImgComputed = computed(() => {
  return controller.Voice ? microphoneImg : microphoneCloseImg;
});

// 摄像头显示
const cameraImgComputed = computed(() => {
  return controller.Camera ? cameraImg : cameraCloseImg;
});

// 反转摄像头
const reverseCamera = () => {
  callRoom.changeCamera();
};

/* 工具栏相关 */
// 缩放窗口
const scaleView = ref(true);

const setScaleTool = () => {
  scaleView.value = !scaleView.value;
  nextTick(() => {});
};

/* 获取数据 */
// 通话时长
const state = reactive({ timeString: '', isFinished: false });
const timer = setInterval(() => {
  if (state.isFinished) return;
  const time = callDataCenter.message?.start;
  if (!time) return;

  const diffInSeconds = Math.floor((Date.now() - time) / 1000);
  const dur = dayjs.duration(diffInSeconds, 'seconds');

  state.timeString = [
    String(dur.hours()).padStart(2, '0'),
    String(dur.minutes()).padStart(2, '0'),
    String(dur.seconds()).padStart(2, '0'),
  ].join(':');
}, 1000);
// 对方
const targetUser = ref<UserDetail>();
// 自己
interface ChildExpose {
  innerEl: HTMLElement | null;
}

const selfUser = ref<UserDetail>();
const localVideoEl = ref<HTMLElement>();
const remoteVideoEl = ref<ChildExpose>();
const instance = getCurrentInstance();
watch(() => callState.target, loadUserDetail, {
  immediate: true,
});
async function loadUserDetail() {
  const target = callDataCenter.data.target;
  if (!target) return;
  if (instance) {
    callRoom.setStage(localVideoEl.value!, remoteVideoEl.value?.innerEl!);
    const Comp = instance.type as typeof instance.type & Enhance;
    targetUser.value = await Comp.getUserDetail?.(target);
    selfUser.value = await Comp.getUserDetail?.();
  }
}
onMounted(loadUserDetail);

onUnmounted(() => {
  clearInterval(timer);
});
</script>
<style lang="scss" scoped>
.bubble {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 9999;
  padding: 0.6rem 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(120px); /* 关键：模糊背景 */
  -webkit-backdrop-filter: blur(120px); /* Safari 支持 */
  // 未接通
  .info {
    display: flex;
    flex-direction: column;
    align-items: center;
    .avatar_container {
      position: relative;
      display: flex;
      flex-direction: column;
      .avatar {
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        border: 2px solid #ffffff;
        margin-bottom: 0.16rem;
      }
      .info {
        position: absolute;
        bottom: 0.08rem;
        left: 50%;
        transform: translate(-50%, 0);
        display: flex;
        align-items: center;
        flex-direction: row;
        gap: 0.04rem;
        padding: 0.02rem;
        width: 0.51rem;
        height: 0.24rem;
        background: #ffffff;
        border-radius: 0.21rem;
        font-weight: 500;
        font-size: 0.14rem;
        color: #333333;
        .gender {
          width: 0.2rem;
          height: 0.2rem;
        }
      }
    }
    .nickname {
      font-weight: 500;
      font-size: 0.22rem;
      color: #ffffff;
      line-height: 0.32rem;
      margin-bottom: 0.04rem;
    }
    .balanceOrPrice {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 0.21rem;
      padding: 0.04rem 0.12rem;
      font-weight: 500;
      font-size: 0.14rem;
      color: #ffffff;
      line-height: 0.2rem;
      margin-bottom: 0.1rem;
    }
    .callUtil {
      font-weight: 400;
      font-size: 0.14rem;
      color: rgba(255, 255, 255, 0.75);
    }
  }
  .btns {
    display: flex;
    .btn {
      width: 0.6rem;
      height: 0.6rem;
    }
  }
}
// 遮罩层图片
.bubble::before {
  content: '';
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-image: var(--bg-url);
  filter: blur(120px);
  z-index: -2;
}
.bubble::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.1);
  z-index: -1;
}
// 通话中
.bubble_apply {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 9999;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  pointer-events: none;
  .bubble_apply_content {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: -1000;
    background: #20212c;
    display: flex;
  }
  //通话中
  .top_tools {
    height: 0.52rem;
    width: 100%;
    padding: 0.08rem 0.12rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .user_avatar {
      height: 0.36rem;
      width: 1.56rem;
      background: rgba(0, 0, 0, 0.15);
      border-radius: 0.58rem;
      padding: 0.02rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .info {
        display: flex;
        align-items: center;
        .avatar {
          height: 0.32rem;
          width: 0.32rem;
          border-radius: 50%;
          margin-right: 0.04rem;
        }
        .nickname {
          font-weight: 600;
          font-size: 0.12rem;
          color: #ffffff;
          line-height: 0.12rem;
          max-width: 0.6rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .care {
        height: 0.28rem;
        background: #ff2442;
        border-radius: 0.16rem;
        font-weight: 500;
        font-size: 0.12rem;
        color: #ffffff;
        text-align: left;
        padding: 0 0.09rem;
        display: flex;
        align-items: center;
      }
    }
    .tools {
      display: flex;
      align-items: center;
      gap: 0.1rem;
      .time {
        height: 0.3rem;
        line-height: 0.3rem;
        padding: 0 0.08rem;
        background: rgba(0, 0, 0, 0.15);
        border-radius: 0.16rem;
        font-weight: 500;
        font-size: 0.12rem;
        color: #ffffff;
      }
      .model {
        width: 0.3rem;
        height: 0.3rem;
      }
    }
  }
  .btns {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 0.51rem;
    margin-bottom: 0.16rem;
  }
}
.scale_view {
  position: absolute;
  right: 0.12rem;
  top: 0.52rem;
  z-index: 9999;
  width: 1.2rem;
  height: 1.6rem;
  border-radius: 0.12rem;
  overflow: hidden;
  pointer-events: auto;
  .closed_target {
    position: absolute;
    z-index: 1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: 400;
    font-size: 0.12rem;
    color: #c7c7ca;
    text-align: center;
    .shot_video_img {
      width: 0.32rem;
      height: 0.32rem;
    }
  }
}
</style>
