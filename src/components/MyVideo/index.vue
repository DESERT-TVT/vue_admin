<script lang="ts" setup>
import { computed, CSSProperties, onMounted, reactive, ref, watch, watchEffect } from 'vue'
import videojs from 'video.js'
import type { VideoJsPlayerOptions } from 'video.js'
import 'video.js/dist/video-js.min.css'
import { VideoState } from './types'
import CustomControls from './components/CustomControls/index.vue'

type MyVideoProps = {
	/** 视频地址 */
	src: string
	/** 海报图 */
	poster: string
	width?: string
	height?: string
	/** 视频开始时间，单位秒 */
	beginTime?: number
}
const props = withDefaults(defineProps<MyVideoProps>(), {})
const state = reactive<VideoState>({
	showControl: false,
	isFullscreen: false,
	isPageFull: false,
	isPause: true,
	volume: 0.6,
	rate: '1.0',
	duration: 0,
	currentTime: 0,
	isPlayed: false,
	isPictureInPicture: false
})
// video标签
const videoRef = ref<HTMLElement | null>(null)
// video实例对象
let videoPlayer: videojs.Player | null = null
const videoWrapStyles = computed<CSSProperties>(() => {
	// 网页全屏样式
	if (state.isPageFull) {
		return {
			width: '100vw',
			height: '100vh',
			position: 'fixed',
			left: 0,
			top: 0,
			'z-index': 99999,
			cursor: state.showControl ? 'auto' : 'none'
		}
	}
	return {
		width: props.width || '100%',
		height: props.height || '100%',
		cursor: state.showControl ? 'auto' : 'none'
	}
})
// 初始化videojs
const initVideo = () => {
	const options: VideoJsPlayerOptions = {
		language: 'zh-CN', // 设置语言
		controls: false, // 是否显示控制条
		preload: 'auto', // 预加载
		autoplay: false, // 是否自动播放
		fluid: false, // 自适应宽高
		src: props.src, // 要嵌入的视频源的源 URL
		userActions: {
			hotkeys: true
		}
	}
	if (videoRef.value) {
		// 创建 video 实例
		videoPlayer = videojs(videoRef.value, options, onPlayerReady)
	}

	if (videoPlayer && props.beginTime) {
		videoPlayer.currentTime(props.beginTime)
	}
}
// video初始化完成的回调函数
const onPlayerReady = () => {
	bindVideoEvents()
	regiesterComponent()
}
// 绑定事件
const bindVideoEvents = () => {
	if (!videoPlayer) return
	videoPlayer.on('play', onPlay)
	videoPlayer.on('pause', onPause)
	videoPlayer.on('ended', onEnded)
	videoPlayer.on('timeupdate', onTimeupdate)
	videoPlayer.on('loadedmetadata', onLoadedmetadata)
	videoPlayer.on('fullscreenchange', onFullscreenchange)
	videoPlayer.on('error', err => {
		console.log('视频加载发生错误', err)
	})
}
const customCompRef = ref<HTMLElement | null>(null)
// 注册组件
const regiesterComponent = () => {
	// 注册组件
	const baseComponent = videojs.getComponent('Component')
	const myComponent = videojs.extend(baseComponent, {
		createEl: function () {
			return customCompRef.value
		}
	})
	videojs.registerComponent('myComponent', myComponent)
	videoPlayer?.addChild('myComponent')
}
const onPlay = () => {
	state.isPlayed = true
	state.isPause = false
}
const onPause = () => {
	state.isPause = true
}
const onEnded = () => {}
const onTimeupdate = () => {
	state.currentTime = videoPlayer!.currentTime()
}
// 全屏切换
const onFullscreenchange = () => {
	state.isFullscreen = !state.isFullscreen
}
// 元数据加载完成
const onLoadedmetadata = () => {
	state.duration = videoPlayer!.duration()
}
// 监听音量变化
watch(
	() => state.volume,
	() => {
		videoPlayer?.volume(state.volume)
		localStorage.setItem('volume', state.volume + '')
	}
)
// 监听倍速变化
watch(
	() => state.rate,
	() => {
		videoPlayer?.playbackRate(+state.rate)
	}
)
// 点击事件
const handleVideoClick = () => {
	if (!videoPlayer) return
	videoPlayer.paused() ? videoPlayer.play() : videoPlayer.pause()
}
// 双击事件，切换全屏
const handleVideoDbClick = () => {
	if (!videoPlayer) return
	if (state.isFullscreen) videoPlayer.exitFullscreen()
	else videoPlayer.requestFullscreen()
}
// 禁用右键菜单
const handleContextmenu = (e: MouseEvent) => {
	e.preventDefault()
}
let showControlTimer: number | null
// 鼠标移入移动事件
const onVideoMousemove = () => {
	state.showControl = true
	if (showControlTimer) clearTimeout(showControlTimer)
	// 不移动3s后隐藏
	showControlTimer = setTimeout(() => {
		if (showControlTimer) clearTimeout(showControlTimer)
		showControlTimer = null
		state.showControl = false
	}, 3000)
}
// 鼠标离开事件
const onVideoMouseleave = () => {
	state.showControl = false
	if (showControlTimer) clearTimeout(showControlTimer)
}
// 鼠标进入控件栏
const handleControlsEnter = () => {
	state.showControl = true
	if (showControlTimer) clearTimeout(showControlTimer)
}
// 鼠标离开控件栏
const handleControlsLeave = () => {
	state.showControl = false
	if (showControlTimer) clearTimeout(showControlTimer)
}
// 暂停或播放
const handlePlayOrPause = () => {
	if (!videoPlayer) return
	videoPlayer.paused() ? videoPlayer.play() : videoPlayer.pause()
}
// 全屏
const handleFullscreen = () => {
	if (!videoPlayer) return
	state.isFullscreen ? videoPlayer.exitFullscreen() : videoPlayer.requestFullscreen()
}
// 音量图标点击
const handleVolumeClick = () => {
	if (state.volume === 0) {
		const lastVolume = (+(localStorage.getItem('last-volume') || '') * 100) / 100
		state.volume = lastVolume
	} else {
		localStorage.setItem('last-volume', state.volume + '')
		state.volume = 0
	}
}
// 播放进度改变
const handleProgreeChange = (val: number) => {
	videoPlayer?.currentTime(val)
	videoPlayer?.play()
}
// 网页全屏
const handlePageFull = () => {
	state.isPageFull = !state.isPageFull
}
// 画中画
const handlePictureInPicture = () => {
	if (!videoPlayer) return
	state.isPictureInPicture ? videoPlayer.exitPictureInPicture() : videoPlayer.requestPictureInPicture()
	state.isPictureInPicture = !state.isPictureInPicture
}
onMounted(() => {
	initVideo()
	const localVolume = localStorage.getItem('volume')
	if (!localVolume) return
	const currentVolume = (+(localStorage.getItem('volume') || '') * 100) / 100
	state.volume = currentVolume
})
</script>
<template>
	<div :style="videoWrapStyles" @mouseleave="onVideoMouseleave" @mousemove="onVideoMousemove">
		<video
			id="my-player"
			ref="videoRef"
			class="video-js my-video"
			height="100%"
			width="100%"
			@click="handleVideoClick"
			@contextmenu="handleContextmenu"
			@dblclick="handleVideoDbClick"
		>
			<source :src="src" />
		</video>
		<div ref="customCompRef" class="cutome-comp">
			<img v-if="!state.isPlayed" :src="poster" @click="handleVideoClick" />
			<CustomControls
				:state="state"
				@fullscreen="handleFullscreen"
				@mouseenter="handleControlsEnter"
				@mouseleave="handleControlsLeave"
				@play-pause="handlePlayOrPause"
				@volume-click="handleVolumeClick"
				@page-full="handlePageFull"
				@picture-in-picture="handlePictureInPicture"
				@progress-change="handleProgreeChange"
			/>
		</div>
	</div>
</template>
<style lang="scss" scoped>
.my-video {
	width: 100% !important;
	height: 100% !important;
	position: relative;
}

.cutome-comp {
	height: 100%;
	width: 100%;

	img {
		height: 100%;
		width: 100%;
		//object-fit: cover;
		//position: absolute;
	}
}
</style>
