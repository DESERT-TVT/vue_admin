<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query">
				<el-form :inline="true" :model="state.queryForm">
					<el-form-item prop="userId">
						<el-input v-model="state.queryForm.formUserId" placeholder="UID" @change="formUserIdChange"></el-input>
					</el-form-item>
					<!--					<el-form-item prop="userId">-->
					<!--						<el-input v-model="state.queryForm.toUserId" clearable placeholder="接收方UID"></el-input>-->
					<!--					</el-form-item>-->
					<!--					<el-form-item>-->
					<!--						<el-select v-model="state.queryForm.messageType" clearable placeholder="请选择类型">-->
					<!--							<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />-->
					<!--						</el-select>-->
					<!--					</el-form-item>-->
					<el-form-item>
						<el-button v-auth="'sys:chat:list'" icon="Search" type="primary" @click="queryHandle">查询</el-button>
					</el-form-item>
				</el-form>
			</el-card>

			<!-- table -->
			<el-card>
				会话列表
				<el-table v-loading="loading" :data="state.chatHistory" border class="layout-table" show-overflow-tooltip style="width: 100%">
					<el-table-column align="center" header-align="center" label="UID" prop="toUserId"></el-table-column>
					<el-table-column align="center" header-align="center" label="昵称" prop="nickname"></el-table-column>
					<el-table-column align="center" fixed="right" header-align="center" label="操作" width="260">
						<template #default="scope">
							<el-button v-auth="'sys:chat:list'" link type="primary" @click="getChatHistory(scope.row.conversationId)"> 查看聊天记录 </el-button>
						</template>
					</el-table-column>
				</el-table>
				<!--				<el-pagination-->
				<!--					:current-page="state.page"-->
				<!--					:page-sizes="state.pageSizes"-->
				<!--					:page-size="state.limit"-->
				<!--					:total="state.total"-->
				<!--					layout="total, sizes, prev, pager, next, jumper"-->
				<!--					@size-change="sizeChangeHandle"-->
				<!--					@current-change="currentChangeHandle"-->
				<!--				>-->
				<!--				</el-pagination>-->
			</el-card>
		</el-col>
	</el-row>

	<!-- 弹窗,聊天记录 -->
	<chat-list ref="chatListRef"></chat-list>
</template>

<script setup lang="ts">
import { onUnmounted, reactive, ref } from 'vue'
import im from '@/utils/im'
import { getUsernameByUserId, getUsernameByUserIds } from '@/api/social/chatHistory'
import { ElMessage } from 'element-plus'
import ChatList from '@/views/social/chat/chatList.vue'
// 初始化环信
im.init()

const state = reactive({
	chatHistory: [] as any[],
	queryForm: {
		formUserId: '',
		toUserId: '',
		messageType: ''
	},
	page: 1,
	pageSizes: [10, 20, 30, 40, 50],
	total: 0,
	limit: 10
})
const loading = ref(false)

const formUserIdChange = () => {
	if (state.queryForm.formUserId) {
		state.chatHistory = []
		im.logoutIm()
	}
}
const chatListRef = ref()
const getChatHistory = (username: string) => {
	chatListRef.value.init(username)
}

const queryHandle = () => {
	loading.value = true
	if (!state.queryForm.formUserId) {
		loading.value = false
		ElMessage.error({
			message: '请输入需要的查询人',
			duration: 500
		})
		return
	}
	let userId = state.queryForm.formUserId
	getUsernameByUserId(userId).then(async res => {
		im.userId = userId
		im.serverConversations = []
		state.chatHistory = []
		await im.loginIm(res.data.username.toLowerCase(), res.data.imToken)
		im.serverConversations.forEach(result => {
			state.chatHistory.push(...result)
		})
		loading.value = false
		if (state.chatHistory.length != 0 && state.queryForm.formUserId) {
			let allToFields = state.chatHistory.map(item => item.conversationId)
			allToFields = [...new Set(allToFields)]
			getUsernameByUserIds(allToFields.join(',')).then(res => {
				state.chatHistory = state.chatHistory.filter(item => {
					let itemIn = res.data.find(item1 => {
						return item1.username.toLowerCase() == item.conversationId
					})
					item.nickname = itemIn.nickname
					item.toUserId = itemIn.userId
					return item
				})
				state.chatHistory = [...state.chatHistory].sort((a, b) => b.lastMessage.time - a.lastMessage.time)
				loading.value = false
			})
		}
	})
}
const sizeChangeHandle = (val: number) => {
	state.limit = val
}
const currentChangeHandle = (val: number) => {
	state.page = val
}
// 在组件销毁时移除事件监听器
onUnmounted(() => {
	im.logoutIm()
})
</script>

<style scoped lang="scss">
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
