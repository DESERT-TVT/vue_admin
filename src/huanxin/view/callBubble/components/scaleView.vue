<script setup lang="ts">
import expandImg from '@/im-sdk/assets/expand.svg';
import { ref } from 'vue';
import shotVideoImg from '@/im-sdk/assets/shutVideo.svg';
import { computed } from '@vue/reactivity';
// 拖动支持
// const miniStreamContainer = ref(null)
// const { style } = useBoundedDraggable(miniStreamContainer, {
//   initialX: 240,
//   initialY: 52,
// })

const { scaleView, controller } = defineProps<{
  scaleView: boolean;
  controller: {
    Camera: boolean;
    Voice: boolean;
  };
}>();



// 缩放支持
const scaleExpand = () => {
  emit('scaleExpand');
};

const emit = defineEmits(['scaleExpand']);

const innerEl = ref<HTMLElement>();

defineExpose({
  innerEl,
});
</script>

<template>
  <div class="mini_stream_container" ref="innerEl"  @click.stop="scaleExpand">
    <img
      v-show="!scaleView"
      :src="expandImg"
      class="expand_img"
    />
    <div class="mini_stream">
      <img :src="shotVideoImg" alt="img" class="shot_video_img" />
      <span>{{
        $t('call.itClosedVideo')
      }}</span>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.mini_stream_container {
  width: 1.2rem;
  height: 1.6rem;
  cursor: move;
  background: #20212c;
  .expand_img {
    z-index: 9999;
    position: absolute;
    right: 0.04rem;
    top: 0.04rem;
  }
  .mini_stream {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    font-weight: 400;
    font-size: 0.12rem;
    color: #c7c7ca;
    .shot_video_img {
      width: 0.32rem;
      height: 0.32rem;
      margin-bottom: 0.04rem;
    }
  }
}
</style>
