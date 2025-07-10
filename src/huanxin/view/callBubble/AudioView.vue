<template>
  <Teleport to="body">
    <div class="bubble" :style="{ '--bg-url': `url(${targetUser?.avatar})` }">
      <div class="info">
        <div class="avatar_container">
          <CacheImg :src="targetUser?.avatar" class="avatar" />
          <div class="info">
            <img :src="targetUser?.gender ? manImg : womanImg" class="gender" />
            <p>{{ targetUser?.age }}</p>
          </div>
        </div>
        <div class="nickname">
          {{ targetUser?.nickname }}
        </div>
        <div class="balance" v-if="targetUser?.online">
          {{ targetUser?.voiceChatPrice + $t('call.gold/min') }}
        </div>
        <div class="price" v-else>
          <img :src="GoldImg" alt="img" />
          {{
            $t('call.balance') +
            (payInfo.latestHeartbeatRes?.goldCoins ?? targetUser?.goldCoins)
          }}
        </div>
        <div class="callUtil" v-if="callState.state === CallState.calling">
          {{ $t('call.invitedPass') }}
        </div>
        <div v-else class="talk_time">
          {{ state.timeString }}
        </div>
      </div>
      <div class="btns" :style="{ gap: gap }">
        <!-- 未接通 -->
        <template v-if="callState.state === CallState.calling">
          <!-- 是否是拨打方 -->
          <template v-if="callState.isCallOut">
            <img
              :src="microphoneImgComputed"
              alt="img"
              class="btn"
              @click="changeVoice"
            />
            <img
              :src="refuseImg"
              alt="img"
              class="btn"
              @click="callDataCenter.cancel()"
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
              :src="acceptImg"
              alt="img"
              class="btn"
              @click="callDataCenter.accept()"
            />
          </template>
        </template>
        <!-- 通话中 -->
        <template v-else>
          <!-- 是否是用户 -->
          <template v-if="targetUser?.online">
            <img
              :src="microphoneImgComputed"
              alt="img"
              class="btn"
              @click="changeVoice"
            />
            <img
              :src="speakerImgComputed"
              alt="img"
              class="btn"
              @click="changeTargetAudio"
            />
            <img :src="refuseImg" alt="img" class="btn" @click="finishCall()" />
            <img :src="giftImg" alt="img" class="btn" />
          </template>
          <template v-else>
            <img
              :src="microphoneImgComputed"
              alt="img"
              class="btn"
              @click="changeVoice"
            />
            <img :src="refuseImg" alt="img" class="btn" @click="finishCall()" />
            <img
              :src="speakerImgComputed"
              alt="img"
              class="btn"
              @click="changeTargetAudio"
            />
          </template>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { UserData } from '@/api/protocol';
import { userinfo } from '@/api/userinfo';
import acceptImg from '@/im-sdk/assets/accept.svg';
import giftImg from '@/im-sdk/assets/giftCall.svg';
import GoldImg from '@/im-sdk/assets/gold.svg';
import manImg from '@/im-sdk/assets/man.svg';
import microphoneImg from '@/im-sdk/assets/microphone.svg';
import microphoneCloseImg from '@/im-sdk/assets/microphoneClose.svg';
import refuseImg from '@/im-sdk/assets/refuse.svg';
import speakerImg from '@/im-sdk/assets/speaker.svg';
import speakerCloseImg from '@/im-sdk/assets/speakerClose.svg';
import womanImg from '@/im-sdk/assets/woman.svg';
import callDataCenter from '@/im-sdk/callDataCenter';
import CacheImg from '@/im-sdk/components/CacheImg.vue';
import { CallState } from '@/im-sdk/types';
import { $t } from '@/locales';
import callRoom from '@/third/huanxin/callRoom';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {
  computed,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch
} from 'vue';
import callEvent from '../../CallEvent';
import { messageBtn } from './components/message';

dayjs.extend(duration);

const callState = callDataCenter.data;
const controller = reactive({
  TargetAudio: true,
  Voice: true,
});
// 计算按钮个数
const buttonCount = computed(() => {
  if (callState.state === CallState.calling) {
    return 2;
  } else {
    return targetUser.value?.online ? 4 : 3;
  }
});

/* 控制媒体 */
// 收音控制
const changeTargetAudio = () => {
  controller.TargetAudio = !controller.TargetAudio;
  callRoom.setTargetAudio(controller.TargetAudio);
};
// 声音控制
const speakerImgComputed = computed(() => {
  return controller.TargetAudio ? speakerImg : speakerCloseImg;
});

//音频控制
const changeVoice = () => {
  controller.Voice = !controller.Voice;
  callRoom.setVoice(controller.Voice);
  if (!controller.Voice) messageBtn($t('call.closeVoice'));
  else messageBtn($t('call.openVoice'));
};

// 麦克风显示
const microphoneImgComputed = computed(() => {
  return controller.Voice ? microphoneImg : microphoneCloseImg;
});

// 根据按钮个数设置 gap
const gap = computed(() => {
  if (buttonCount.value === 2) return '0.8rem';
  if (buttonCount.value === 3) return '0.4rem';
  if (buttonCount.value === 4) return '0.24rem';
  return '0.8rem';
});
// 通话付费
const payInfo = callEvent;

// 完成通话
const finishCall = () => {
  callEvent.finishVideoChat();
  state.isFinished = true;
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

// 用户消息
const targetUser = ref<UserData>();
watch(() => callState.target, loadUserDetail, {
  immediate: true,
});
async function loadUserDetail() {
  const target = callDataCenter.data.target;
  if (!target) return;
  const res = await userinfo(target?.userId);
  targetUser.value = res?.data.data;
}
onMounted(loadUserDetail);
onUnmounted(() => {
  clearInterval(timer);
});
</script>
<style lang="scss" scoped>
.bg {
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
}
.bubble {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 999;
  padding: 0.6rem 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  .avatarBg {
    position: absolute;
    top: 0;
    z-index: -1;
    width: 100vw;
    height: 100vh;
  }
  .info {
    display: flex;
    flex-direction: column;
    align-items: center;
    .avatar-container {
      position: relative;
      top: 0;
      display: inline-block;
      width: 1rem;
      height: 1rem;
    }
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
    .balance,
    .price {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 0.21rem;
      padding: 0.04rem 0.12rem;
      font-weight: 500;
      font-size: 0.14rem;
      color: #ffffff;
      line-height: 0.2rem;
      display: flex;
      gap: 0.04rem;
      align-items: center;
    }
    .callUtil {
      font-weight: 400;
      font-size: 0.14rem;
      color: rgba(255, 255, 255, 0.75);
      margin-top: 0.12rem;
    }
    .talk_time {
      margin-top: 0.08rem;
      font-weight: 500;
      font-size: 0.2rem;
      color: #ffffff;
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
</style>
