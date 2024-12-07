<script lang="ts" setup>
import { ref } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'

type VolumeProps = {
	/** 音量值 */
	modelValue: number
}
const props = defineProps<VolumeProps>()
const emit = defineEmits(['update:modelValue', 'volume-click'])
const volumeVisible = ref(false)
// 音量鼠标移入
const onVolumeMouseenter = () => {
	volumeVisible.value = true
}
// 音量鼠标移出
const onVolumeMouseleave = () => {
	volumeVisible.value = false
}
const sliderContainerRef = ref<HTMLElement | null>(null)
const isMousedown = ref(false)
const sliderBottom = ref(0)
// 鼠标在音量区域按下
const onVolumeControlMousedown = (e: MouseEvent) => {
	isMousedown.value = true
	const sliderDom = sliderContainerRef.value!
	sliderBottom.value = sliderDom.getBoundingClientRect().bottom
	const distance = sliderBottom.value - e.clientY
	emit('update:modelValue', Math.round((distance / sliderDom.offsetHeight) * 100) / 100)
	document.onmouseup = function () {
		document.onmouseup = null
		isMousedown.value = false
	}
}
// 鼠标在音量区域移动
const onVolumeControlMousemove = (e: MouseEvent) => {
	if (isMousedown.value) {
		const sliderDom = sliderContainerRef.value!
		let distance = sliderBottom.value - e.clientY
		const height = sliderDom.offsetHeight
		if (distance >= height) {
			distance = height
		}
		emit('update:modelValue', Math.round((distance / sliderDom.offsetHeight) * 100) / 100)
	}
}
const handleVolumeClick = () => {
	emit('volume-click')
}
</script>
<template>
	<div class="relative">
		<transition name="fade-in-linear">
			<div v-show="volumeVisible" class="volume-control" @mouseenter="onVolumeMouseenter" @mouseleave="onVolumeMouseleave">
				<span class="volume-value">{{ Math.round(modelValue * 100) }}</span>
				<div ref="sliderContainerRef" class="slider-container" @mousedown="onVolumeControlMousedown" @mousemove="onVolumeControlMousemove">
					<div class="slider">
						<div :style="{ transform: `scaleY(${modelValue})` }" class="slider-volume" />
					</div>
					<span :style="{ transform: `translateY(-${Math.round(modelValue * 100)}px)` }" class="point" />
				</div>
			</div>
		</transition>
		<div @mouseenter="onVolumeMouseenter" @mouseleave="onVolumeMouseleave">
			<SvgIcon :name="modelValue === 0 ? 'mute' : 'volume'" class-names="cursor-pointer" size="22" @click="handleVolumeClick" />
		</div>
	</div>
</template>
<style lang="scss" scoped>
.volume-control {
	width: 48px;
	height: 150px;
	background: rgba(51, 51, 51, 0.9);
	position: absolute;
	left: 50%;
	transform: translate(-50%, calc(-100% - 10px));
	border-radius: 4px;
	padding-top: 8px;

	.volume-value {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.slider-container {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 50px;
		height: 110px;
		position: absolute;
		margin-top: 12px;

		.slider {
			width: 4px;
			height: 100%;
			background-color: #fff;

			.slider-volume {
				width: 4px;
				height: 100%;
				background-color: #3f83f8;
				position: absolute;
				bottom: 0;
				transform-origin: 0 100%;
				cursor: pointer;
			}
		}

		.point {
			position: absolute;
			bottom: 0;
			width: 16px;
			height: 16px;
			border-radius: 50%;
			background-color: #3f83f8;
			cursor: pointer;
		}
	}
}
</style>
