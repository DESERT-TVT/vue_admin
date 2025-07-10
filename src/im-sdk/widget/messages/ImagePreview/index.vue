<template>
  <teleport to="body">
    <van-image-preview
      v-if="show"
      v-model:show="show"
      :images="imagesList"
      :start-position="currentIndex"
      @change="onChange"
      :overlay-style="{ background: 'rgba(0, 0, 0, 0.75)' }"
      :closeable="(props.burnCount || 0) <= 0"
    >
      <template #index>
        <div style="color: white; font-size: 16px">
          {{ currentIndex + 1 }} / {{ imagesList.length }}
        </div>
      </template>
    </van-image-preview>

    <!-- 左右按钮 -->
    <div v-if="show && imagesList.length > 1 && !props.burnCount">
      <img
        class="nav-button left"
        :src="leftUrl"
        alt=""
        @click.stop="prevImage"
      />
      <img
        class="nav-button right"
        :src="rightUrl"
        alt=""
        @click.stop="nextImage"
      />
    </div>
    <div
      class="fixed top-[0.06rem] right-[0.16rem] z-3000"
      v-if="show && props.burnCount"
    >
      <div class="burnCount-text">
        {{ props.burnCount || 0 }}
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import leftUrl from '@/im-sdk/assets/left_btn.svg';
import rightUrl from '@/im-sdk/assets/right_btn.svg';
import { ref, watch } from 'vue';

const show = defineModel<boolean>();

const props = defineProps<{
  images: string[];
  startIndex?: number;
  burnCount?: number;
  handleImageChange?: (index: number) => void;
}>();
const imagesList = ref<string[]>([]);
// 当前页数
const currentIndex = ref(props.startIndex || 0);

// 监听 show 的变化
watch(show, (val) => {
  if (val) {
    currentIndex.value = props.startIndex ?? 0;
    imagesList.value = props.images;
  }
});

// 每次切换图片时重置缩放
function onChange(index: number) {
  currentIndex.value = index;
  scale.value = 1;
  applyScale();
}

//切换
function prevImage() {
  if (props.handleImageChange) {
    props?.handleImageChange(currentIndex.value - 1);
  }
  if (currentIndex.value > 0) {
    currentIndex.value--;
  } else {
    currentIndex.value = props.images.length - 1;
  }
}

function nextImage() {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++;
    if (props.handleImageChange) {
      props?.handleImageChange(currentIndex.value);
    }
  } else {
    currentIndex.value = 0;
    if (props.handleImageChange) {
      props?.handleImageChange(currentIndex.value);
    }
  }
}

// 缩放按钮
// 当前缩放比例（默认 1）
const scale = ref(1);

function zoomIn() {
  if (scale.value < 3) scale.value += 0.5;
  applyScale();
}

function zoomOut() {
  if (scale.value > 0.5) scale.value -= 0.5;
  applyScale();
}

function applyScale() {
  // 等待 DOM 渲染完成后设置样式
  setTimeout(() => {
    const imageEls = document.querySelectorAll('.van-image-preview__image');
    const currentImage = imageEls[currentIndex.value] as HTMLElement;
    if (currentImage) {
      currentImage.style.transform = `scale(${scale.value})`;
      currentImage.style.transition = 'transform 0.2s ease';
    }
  }, 0);
}
</script>

<style scoped>
.nav-button {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3000;
  color: white;
  font-size: 2.4rem;
  font-weight: bold;
  border-radius: 50%;
  cursor: pointer;
  user-select: none;
}

.left {
  left: 0.14rem;
}

.right {
  right: 0.14rem;
}

.burnCount-text {
  color: #fff;
  font-size: 0.2rem;
  line-height: 0.28rem;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 0.04rem 0.2rem;
  border-radius: 0.18rem;
}


/* 缩放样式  */
.zoom-controls {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 3000;
}

.zoom-controls button {
  background: rgba(0, 0, 0, 0.6);
  border: none;
  color: white;
  font-size: 1.2rem;
  padding: 0.4rem 0.6rem;
  border-radius: 0.4rem;
  cursor: pointer;
  transition: background 0.2s;
}

.zoom-controls button:hover {
  background: rgba(255, 255, 255, 0.2);
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
