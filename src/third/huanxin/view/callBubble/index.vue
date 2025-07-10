<template>
  <div>
    <Bubble v-if="callState.state === CallState.alerting" />
    <component v-else-if="callState.state != CallState.idle" :is="currentComponent"></component>
  </div>
</template>

<script lang="ts" setup>
import Bubble from './Bubble.vue';
import { showConfirmDialog } from 'vant';
import VideoView from './VideoView.vue';
import AudioView from './AudioView.vue';
import { $t } from '@/locales';
import { computed, onMounted, ref, watch } from 'vue';
import callDataCenter from '@/im-sdk/callDataCenter';
import { CallState } from '@/im-sdk/types';
const callState = callDataCenter.data;
// 判断渲组件
const componentMap = {
  video: VideoView,
  audio: AudioView,
};

const currentComponent = computed(() => componentMap[callState.type]);


// 获取状态判断铃声
// 播放铃声
const ringDom = ref<HTMLVideoElement>();
const is_need_open_ring = ref(false);

//请求播放权限
const openRing = () => {
  is_need_open_ring.value = true;
  showConfirmDialog({
    title: $t('common.tip'),
    message: $t('common.networkError'),
  })
    .then(() => {
      // on confirm
      playRing();
    })
    .catch(() => {
      // on cancel
    });
};

// 播放铃声
const playRing = async () => {
  if (!ringDom.value) return;
  try {
    await ringDom.value.play();
  } catch (error) {
    if (!is_need_open_ring.value) {
      openRing(); // 通常用于处理用户手动触发播放
    }
  }
};

// 暂停铃声
const pauseRing = () => {
  if (!ringDom.value) return;
  if (!ringDom.value.paused) {
    ringDom.value.pause();
  }
};

// 监听 callState.state 变化
watch(
  () => callState.state,
  (newState) => {
    if (newState === CallState.alerting) {
      console.log('callState.state: alerting');
      playRing();
    } else {
      pauseRing();
    }
  },
  { immediate: true }
);

// 初始化 DOM 元素
onMounted(() => {
  ringDom.value = document.querySelector('#ring') as HTMLVideoElement;
});
</script>

<style lang="scss" scoped></style>
