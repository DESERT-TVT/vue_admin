<script setup lang="ts">
import Hls from "hls.js";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { generateSign, VideoLoader } from "./VideoLoader";
import { baseURL } from "@/utils/axios";
import { tokenController } from "@/manager/token";
const props = defineProps<{ src: string }>();
const emitter = defineEmits(["close"]);
const videoRef = ref<HTMLVideoElement>();

let hls: Hls | undefined;

onMounted(() => {
  const video = videoRef.value;
  if (!video) {
    return;
  }
  if (props.src.includes(".m3u8")) {
    if (Hls.isSupported()) {
      hls = new Hls({ loader: VideoLoader });
      hls.loadSource(props.src);
      hls.attachMedia(video);
    } else {
      const sign = generateSign(tokenController.token);
      const api =
        baseURL[baseURL.length - 1] === "/"
          ? `${baseURL}server/social/download/video`
          : `${baseURL}/server/social/download/video`;
      video.src = `${api}?url=${encodeURIComponent(props.src)}&auth=${
        sign.auth
      }&t=${sign.t}&sign=${sign.sign}`;
      video.load();
    }
  } else {
    video.src = props.src;
  }
});
onBeforeUnmount(() => {
  if (hls) {
    hls.destroy();
    hls = undefined;
  }
});

// 监听退出全屏关闭 preview
function onFullscreenChange() {
  const video = videoRef.value;
  if (!video) return;

  const isFullscreen =
    document.fullscreenElement === video ||
    // iOS Safari 的全屏状态
    (document as any).webkitFullscreenElement === video;

  // 如果退出全屏，关闭 preview
  if (!isFullscreen) {
    emitter("close");
  }
}
</script>
<template>
  <video
    style="width: 100%"
    controls
    ref="videoRef"
    @fullscreenchange="onFullscreenChange"
    @webkitendfullscreen="onFullscreenChange"
  ></video>
</template>
<style lang="less" scoped></style>
