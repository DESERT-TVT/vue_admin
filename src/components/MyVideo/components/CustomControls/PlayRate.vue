<script lang="ts" setup>
import { ref } from 'vue'

type PlayRateProps = {
	/** 倍速 */
	modelValue: string
}
const props = defineProps<PlayRateProps>()
const emit = defineEmits(['update:modelValue'])
const list = ['0.5', '0.75', '1.0', '1.25', '1.5', '2.0'].reverse()
const playReateVisible = ref(false)
const onPlayReateMouseenter = () => {
	playReateVisible.value = true
}
const onPlayRateMouseleave = () => {
	playReateVisible.value = false
}
const handleSelect = (item: string) => {
	emit('update:modelValue', item)
}
</script>
<template>
	<div class="play-rate">
		<transition name="fade-in-linear">
			<div v-show="playReateVisible" class="list" @mouseenter="onPlayReateMouseenter" @mouseleave="onPlayRateMouseleave">
				<div v-for="item in list" :key="item" :class="{ 'item-selected': item === modelValue }" class="item" @click="handleSelect(item)">
					{{ item }}x
				</div>
			</div>
		</transition>
		<div class="rate" @mouseenter="onPlayReateMouseenter" @mouseleave="onPlayRateMouseleave">
			{{ modelValue === '1.0' ? '倍速' : modelValue + 'x' }}
		</div>
	</div>
</template>
<style lang="scss" scoped>
.play-rate {
	position: relative;
	margin-right: 16px;
	cursor: pointer;

	.list {
		width: 48px;
		height: 150px;
		background: rgba(51, 51, 51, 0.9);
		position: absolute;
		left: 50%;
		transform: translate(-50%, calc(-100% - 16px));
		border-radius: 4px;
		padding-top: 8px;
		background: rgba(51, 51, 51, 0.9);

		.item {
			height: 24px;
			text-align: center;

			&:hover {
				color: #3f83f8;
			}
		}

		.item-selected {
			color: #3f83f8;
		}
	}

	.rate {
		width: 40px;
		text-align: center;
	}
}
</style>
