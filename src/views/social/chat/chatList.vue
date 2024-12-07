<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" title="聊天记录列表" width="80%" @close="closeDialogHandle">
		<el-row>
			<el-col :span="24">
				<el-card class="layout-query">
					<el-form :inline="true" :model="state.queryForm">
						<el-form-item>
							<el-select v-model="state.queryForm.messageType" clearable placeholder="请选择消息类型">
								<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-button v-auth="'sys:chat:list'" icon="Search" type="primary" @click="queryHandle">查询</el-button>
						</el-form-item>
					</el-form>
				</el-card>

				<!-- table -->
				<el-card>
					<el-table v-loading="loading" :data="state.chatHistory" border class="layout-table" show-overflow-tooltip style="width: 100%">
						<el-table-column align="center" header-align="center" label="发起方" prop="fromUserId"></el-table-column>
						<el-table-column align="center" header-align="center" label="接收方" prop="toUserId"></el-table-column>
						<el-table-column align="center" header-align="center" label="消息内容" prop="imMsgMessage">
							<template #default="scope">
								<el-image
									v-if="scope.row.type == 'img'"
									:initial-index="0"
									:max-scale="7"
									:min-scale="0.2"
									:preview-src-list="[scope.row.url]"
									:preview-teleported="true"
									:src="scope.row.url"
									:zoom-rate="1.2"
									fit="cover"
									style="width: 100px; height: 100px"
								/>
								<el-icon v-else-if="scope.row.type == 'audio'">
									<el-tag class="audioClass" type="primary" @click="startplayAudio(scope.row)"> 语音消息：{{ scope.row.length }}s </el-tag>
								</el-icon>
								<el-icon v-else>
									<el-tag type="primary">{{ scope.row.msg }}</el-tag>
								</el-icon>
							</template>
						</el-table-column>
						<el-table-column align="center" header-align="center" label="聊天类型" prop="type">
							<template #default="scope">
								<div v-if="scope.row.type === 'txt'">文字</div>
								<div v-if="scope.row.type === 'audio'">语音</div>
								<div v-if="scope.row.type === 'img'">图片</div>
							</template>
						</el-table-column>
						<el-table-column align="center" header-align="center" label="发送时间" prop="time">
							<template #default="scope">
								{{ formatTimestamp(scope.row.time) }}
							</template>
						</el-table-column>
					</el-table>
					<el-pagination
						:current-page="state.page"
						:page-size="state.limit"
						:page-sizes="state.pageSizes"
						:total="state.total"
						layout="total, sizes, prev, pager, next, jumper"
						@size-change="sizeChangeHandle"
						@current-change="currentChangeHandle"
					>
					</el-pagination>
				</el-card>
			</el-col>
		</el-row>
	</el-dialog>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, reactive, ref } from 'vue'
import im from '@/utils/im'
import { getUsernameByUserIds } from '@/api/social/chatHistory'
import BenzAMRRecorder from 'benz-amr-recorder'
import { EasemobChat } from 'easemob-websdk'

const state = reactive({
	chatHistory: [] as any[],
	selectChatHistory: [] as any[],
	queryForm: {
		messageType: ''
	},
	page: 1,
	pageSizes: [10, 20, 30, 40, 50],
	total: 0,
	limit: 10
})
const usernameRef = ref('')
const loading = ref(false)
const visible = ref(false)
const options = [
	{ value: 'txt', label: '文字' },
	{ value: 'audio', label: '语音' },
	{ value: 'img', label: '图片' }
]

const init = (username: string) => {
	visible.value = true
	usernameRef.value = username
	if (username) {
		getChatHistory(username)
	}
}

const getChatHistory = async (username: string) => {
	state.chatHistory = []
	im.totalCount = 0
	await im.getTotalCount(username, '-1')
	state.total = im.totalCount
	im.getHistoryMessages(username).then(res => {
		if (res.cursor != null) {
			im.cursor = res.cursor
		}
		if (res.cursor == 'undefined') {
			im.cursor = '-1'
		}
		if (res.messages.length < im.pageSize) {
			im.cursor = '-1'
		}
		state.chatHistory.push(...res.messages)
		if (state.chatHistory.length != 0) {
			let allToFields = state.chatHistory.flatMap(item => [item.to, item.from])
			allToFields = Array.from(new Set(allToFields))
			getUsernameByUserIds(allToFields.join(',')).then(res => {
				state.chatHistory = state.chatHistory.filter(item => {
					const toUser = res.data.find((itemToUser: any) => itemToUser.username.toLowerCase() === item.to)
					const fromUser = res.data.find((itemFromUser: any) => itemFromUser.username.toLowerCase() === item.from)
					if (toUser) {
						item.toUserId = toUser.userId
					}
					if (fromUser) {
						item.fromUserId = fromUser.userId
					}
					return item
				})
				state.chatHistory = [...state.chatHistory].sort((a, b) => b.time - a.time)
				state.selectChatHistory = state.chatHistory
				loading.value = false
			})
		}
	})
}
const queryHandle = () => {
	loading.value = true
	if (state.queryForm.messageType) {
		state.chatHistory = state.selectChatHistory.filter(item => {
			return item.type === state.queryForm.messageType
		})
		loading.value = false
	} else {
		state.chatHistory = state.selectChatHistory
		loading.value = false
	}
}
const sizeChangeHandle = (val: number) => {
	im.pageSize = val
	state.limit = im.pageSize
	im.cursor = '-1'
	state.page = 1
	getChatHistory(usernameRef.value)
}
const currentChangeHandle = (val: number) => {
	state.page = val
	getChatHistory(usernameRef.value)
}
const closeDialogHandle = () => {
	visible.value = false
}
//音频播放状态
const audioPlayStatus = reactive({
	isPlaying: false, //是否在播放中
	playMsgId: '' //在播放的音频消息id,
})
//开始播放
let armRec: BenzAMRRecorder | null = null // 定义一个全局变量来保存 armRec 实例

const startplayAudio = (msgBody: EasemobChat.AudioMsgBody) => {
	// 如果点击的是正在播放的同一条语音消息
	if (audioPlayStatus.isPlaying && audioPlayStatus.playMsgId === msgBody.id) {
		// 暂停或恢复播放
		armRec?.playOrPauseOrResume()
		return
	}

	// 如果正在播放其他音频，先停止播放
	if (audioPlayStatus.isPlaying && armRec) {
		armRec.stop()
		armRec = null // 释放旧的实例
		audioPlayStatus.isPlaying = false
		audioPlayStatus.playMsgId = ''
	}

	// 开始播放新音频
	const src = msgBody.url
	audioPlayStatus.playMsgId = msgBody.id

	// 创建一个新的 BenzAMRRecorder 实例
	armRec = new BenzAMRRecorder()

	// 初始化音频源并调用播放
	armRec
		.initWithUrl(src!)
		.then(() => {
			if (!audioPlayStatus.isPlaying) {
				armRec!.playOrPauseOrResume() // 确保 armRec 实例存在并开始播放
			}
		})
		.catch(error => {
			console.error('音频初始化失败', error)
		})

	// 播放开始监听
	armRec.onPlay(() => {
		audioPlayStatus.isPlaying = true
		audioPlayStatus.playMsgId = msgBody.id
	})

	// 播放暂停监听
	armRec.onPause(() => {
		audioPlayStatus.isPlaying = false
		audioPlayStatus.playMsgId = ''
	})

	// 播放结束监听
	armRec.onStop(() => {
		audioPlayStatus.isPlaying = false
		audioPlayStatus.playMsgId = ''
		armRec = null // 播放结束后释放实例
	})
}
// 停止播放当前音频
const stopAudio = () => {
	if (armRec) {
		armRec.stop()
		armRec = null
	}
}
onBeforeUnmount(() => {
	stopAudio()
})
// 格式化时间戳的函数
const formatTimestamp = (timestamp: number) => {
	const date = new Date(timestamp) // 将时间戳转换为 Date 对象
	return date.toLocaleString() // 返回本地日期字符串
}
defineExpose({
	init
})
</script>

<style lang="scss" scoped>
body {
	margin: 0;
}

.example-showcase .el-loading-mask {
	z-index: 9;
}

.audioClass {
	cursor: pointer;
}
</style>
