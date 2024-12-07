<script lang="ts" setup>
import { watch, ref } from 'vue'

type ProgressBarProps = {
	/** 进度 */
	modelValue: number
	/** 总时长 */
	duration: number
}
const props = defineProps<ProgressBarProps>()
const emit = defineEmits(['update:modelValue', 'change'])
const sliderContainerRef = ref<HTMLElement | null>(null)
const isMousedown = ref(false)
const sliderLeft = ref(0)
const scaleX = ref(0)
const pointLeft = ref(0)
// 鼠标在音量区域按下
const onMousedown = (e: MouseEvent) => {
	isMousedown.value = true
	const sliderDom = sliderContainerRef.value!
	sliderLeft.value = sliderDom.getBoundingClientRect().left
	const distance = e.clientX - sliderLeft.value
	emit('update:modelValue', (Math.round((distance / sliderDom.offsetWidth) * 100) / 100) * props.duration)
	scaleX.value = distance / sliderDom.offsetWidth
	pointLeft.value = distance
	document.onmousemove = onMousemove
	document.onmouseup = function () {
		document.onmouseup = null
		isMousedown.value = false
		emit('change', scaleX.value * props.duration)
	}
}
const onMousemove = (e: MouseEvent) => {
	if (isMousedown.value) {
		const sliderDom = sliderContainerRef.value!
		let distance = e.clientX - sliderLeft.value
		const width = sliderDom.offsetWidth
		if (distance >= width) {
			distance = width
		}
		emit('update:modelValue', (Math.round((distance / width) * 100) / 100) * props.duration)
		scaleX.value = distance / sliderDom.offsetWidth
		if (isPointerLeftHover.value) return
		pointLeft.value = distance
	}
}
watch(
	() => props.modelValue,
	() => {
		if (isMousedown.value) return
		if (props.duration) {
			const sliderDom = sliderContainerRef.value!
			scaleX.value = props.modelValue / props.duration
			if (isPointerLeftHover.value) return
			pointLeft.value = sliderDom.offsetWidth * scaleX.value
		}
	}
)
const isHover = ref(false)
const isPointerLeftHover = ref(false)
</script>
<template>
	<div ref="sliderContainerRef" class="container" @mousedown="onMousedown" @mouseenter="isHover = true" @mouseleave="isHover = false">
		<div class="slider">
			<div :style="{ transform: `scaleX(${scaleX})` }" class="slider-progress" />
		</div>
		<span
			v-show="isHover"
			:style="{ transform: `translateX(${Math.max(0, pointLeft - 16)}px)` }"
			class="point"
			@mouseenter="isPointerLeftHover = true"
			@mouseleave="isPointerLeftHover = false"
		/>
	</div>
</template>
<style lang="scss" scoped>
.container {
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	height: 4px;
	width: 100%;
	transition: height 0.2s;

	.slider {
		width: 100%;
		height: 100%;
		background-color: #fff;

		.slider-progress {
			width: 100%;
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
		left: 0;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background-color: #3f83f8;
		cursor: pointer;
	}
}
</style>
