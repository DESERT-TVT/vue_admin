<script lang="ts" setup>
import SvgIcon from '@/components/SvgIcon/index.vue'
import Volume from './Volume.vue'
import PlayRate from './PlayRate.vue'
import ProgressBar from './ProgressBar.vue'
import type { VideoState } from '../../types'
import { durationFormat } from '@/utils/datatime'
import { ref } from 'vue'

type CustomControlsProps = {
	state: VideoState
}
const props = defineProps<CustomControlsProps>()
const emit = defineEmits(['play-pause', 'fullscreen', 'volume-click', 'progress-change', 'page-full', 'picture-in-picture'])
const handlePlayOrPause = () => {
	emit('play-pause')
}
const handleFullscreen = () => {
	emit('fullscreen')
}
const handleVolumeClick = () => {
	emit('volume-click')
}
const handleProgreeChange = (val: number) => {
	emit('progress-change', val)
}
const handlePageFull = () => {
	emit('page-full')
}
const handlePictureInPicture = () => {
	emit('picture-in-picture')
}
const fullscrrenTipVisible = ref(false)
const pageFullscrrenTipVisible = ref(false)
const pictureInPictureVisible = ref(false)
</script>
<template>
	<transition name="fade-in-linear">
		<div v-show="state.showControl" class="controls-container">
			<ProgressBar v-model="state.currentTime" :duration="state.duration" class="progress-bar" @change="handleProgreeChange" />
			<div class="controls">
				<div class="left">
					<SvgIcon v-if="state.isPause" class-names="cursor-pointer" name="play" size="22" @click="handlePlayOrPause" />
					<SvgIcon v-else class-names="cursor-pointer" name="pausess" size="22" @click="handlePlayOrPause" />
					<span class="time">{{ durationFormat(state.currentTime * 1000) }} / {{ durationFormat(state.duration * 1000) }}</span>
				</div>
				<div class="right">
					<PlayRate v-model="state.rate" />
					<Volume v-model="state.volume" @volume-click="handleVolumeClick" />
					<!--画中画-->
					<div class="fullscreen">
						<transition name="el-fade-in-linear">
							<div v-show="pictureInPictureVisible" class="tips">
								{{ state.isPictureInPicture ? '关闭画中画' : '开启画中画' }}
							</div>
						</transition>
						<SvgIcon
							name="picture-in-picture"
							size="22"
							@click="handlePictureInPicture"
							@mouseenter="pictureInPictureVisible = true"
							@mouseleave="pictureInPictureVisible = false"
						/>
					</div>
					<!--网页全屏-->
					<div class="fullscreen">
						<transition name="el-fade-in-linear">
							<div v-show="pageFullscrrenTipVisible" class="tips">
								{{ state.isPageFull ? '退出网页全屏' : '网页全屏' }}
							</div>
						</transition>
						<SvgIcon
							:name="state.isFullscreen ? 'exit-page-full' : 'page-full'"
							size="22"
							@click="handlePageFull"
							@mouseenter="pageFullscrrenTipVisible = true"
							@mouseleave="pageFullscrrenTipVisible = false"
						/>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>
<style lang="scss" scoped>
.controls-container {
	position: absolute;
	bottom: 0;
	height: 52px;
	width: 100%;
	user-select: none;
}

.progress-bar {
	position: absolute;
	top: 0;
	background: #fff;
	cursor: pointer;
	z-index: 10;
}

.controls {
	position: absolute;
	bottom: 0;
	background: linear-gradient(180deg, rgba(51, 51, 51, 0.2) 0%, #333 100%);
	height: 100%;
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 24px;
	opacity: 0.8;

	.left {
		display: flex;
		align-items: center;

		.time {
			margin-left: 16px;
		}
	}

	.right {
		display: flex;
		align-items: center;

		.fullscreen {
			margin-left: 16px;
			cursor: pointer;
			position: relative;

			.tips {
				position: absolute;
				top: 0;
				left: 50%;
				transform: translate(-50%, calc(-100% - 14px));
				background-color: rgba(51, 51, 51, 0.9);
				padding: 6px 12px;
				border-radius: 4px;
				word-break: keep-all;
			}
		}
	}
}
</style>
