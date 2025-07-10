
<!-- VideoPreview.vue -->
<template>
  <teleport to="body">
    <van-image-preview
      v-model:show="visible"
      :images="props.url"
      :closeable="true"
      :close-on-click-image="false"
      :close-on-click-overlay="false"
    >
      <template #image="{ src }">
        <div class="watermark">
          <div class="watermark-container">
            <VideoPlayer :src="src" @close="visible=false"/>
          </div>
        </div>
      </template>
    </van-image-preview>
  </teleport>
</template>

<script lang="ts" setup>
import VideoPlayer from './VideoPlayer.vue';

const props = defineProps<{
  url: string[]; // 视频链接数组
}>();

const visible = defineModel<boolean>(); // 控制预览显示

</script>

<style lang="scss" scoped>
video {
  background: black;
  max-height: 80vh;
}
.watermark{
  position: relative;
}
.watermark-container::after {
  content: '';
  position: absolute;
  bottom: .12rem;
  right: .12rem;
  width: .8rem; /* 自行调整大小 */
  height: .24rem;
  background-image: url('@/assets/brand/watermark.svg'); /* 水印图片地址 */
  background-size: contain;
  background-repeat: no-repeat;
  pointer-events: none;
  z-index: 1;
}
</style>
