<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query">
				<el-form ref="queryRef" :inline="true" :model="state.queryForm">
					<!--          <el-form-item>-->
					<!--            <el-button icon="Search" type="primary" @click="getDataList()">查询</el-button>-->
					<!--          </el-form-item>-->
					<el-form-item>
						<el-button v-auth="'sys:bot'" icon="Delete" plain type="danger" @click="deleteBatchHandle()">批量删除 </el-button>
					</el-form-item>
					<el-form-item>
						<el-button v-auth="'sys:bot'" icon="Plus" type="primary" @click="addOrUpdateHandle()">新增</el-button>
					</el-form-item>
					<el-form-item>
						<el-button icon="RefreshRight" @click="reset(queryRef)">重置</el-button>
					</el-form-item>
					<el-form-item>
						搭讪距离（单位km）
						<el-input-number v-model="distance" :max="100000" :min="0" @blur="handleChange"></el-input-number>
					</el-form-item>
				</el-form>
			</el-card>

			<el-card>
				<el-table
					v-loading="state.dataListLoading"
					:data="state.dataList"
					border
					class="layout-table"
					show-overflow-tooltip
					@selection-change="selectionChangeHandle"
				>
					<el-table-column align="center" header-align="center" type="selection" width="38"></el-table-column>
					<el-table-column align="center" fixed header-align="center" label="UID" prop="userId"></el-table-column>
					<el-table-column align="center" header-align="center" label="昵称" prop="nickname">
						<template #default="scope">
							{{ scope.row.nickname }}
						</template>
					</el-table-column>

					<fast-dict-column dict-type="user_gender" label="性别" prop="gender" width="80"></fast-dict-column>
					<el-table-column label="模型" prop="gender">
						<template #default="scope">
							<el-select
								v-model="scope.row.modelId"
								:disabled="cities.length === 0"
								collapse-tags
								placeholder="Select"
								popper-class="custom-header"
								style="width: 130px"
								@change="(value: any) => botSetModel(scope.row.id, value)"
							>
								<template #header> </template>
								<el-option v-for="item in cities" :key="item.id" :label="item.modelName" :value="item.id" />
								<el-option v-if="cities.length === 0" disabled label="无可用模型" />
							</el-select>
						</template>
					</el-table-column>

					<el-table-column align="center" header-align="center" label="搭讪人数" width="80">
						<template #default="scope">
							<el-link :onclick="() => openDrawer(scope.row.id)" type="primary">
								{{ scope.row.friendCount }}
							</el-link>
						</template>
					</el-table-column>
					<el-table-column align="center" header-align="center" label="回复人数" prop="replyCount" width="80" />
					<el-table-column align="center" header-align="center" label="回复率" prop="replyCount" width="80">
						<template #default="scope"> {{ (scope.row.replyCount / scope.row.friendCount) * 100 }} % </template>
					</el-table-column>

					<el-table-column align="center" fixed="right" header-align="center" label="操作">
						<template #default="scope">
							<div style="display: flex; flex-direction: column">
								<el-button v-auth="'user:update'" link type="primary" @click="sendDynamic(scope.row)"> 发布朋友圈 </el-button>
								<el-button v-auth="'user:update'" link type="primary" @click="updateRefHandle(scope.row)"> 修改信息 </el-button>
								<el-button v-auth="'user:update'" link type="primary" @click="deleteBatchHandle(scope.row.userId)"> 删除 </el-button>
							</div>
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
	<!-- 弹窗, 新增 / 修改 -->
	<add-or-update ref="addOrUpdateRef" @refresh-data-list="getDataList"></add-or-update>
	<!-- 详情 -->
	<user-info ref="userInfoRef" @refresh-data-list="getDataList"></user-info>

	<update ref="updateRef" @refresh-data-list="getDataList"></update>

	<el-drawer v-model="drawer" size="50%" title="好友列表">
		<div>
			<el-table
				v-loading="drawerData.dataListLoading"
				:border="parentBorder"
				:data="drawerData.dataList"
				border
				class="layout-table"
				show-overflow-tooltip
				style="width: 100%"
				@selection-change="selectionChangeHandle"
			>
				<el-table-column align="center" header-align="center" label="用户昵称">
					<template #default="scope">
						<el-link :onclick="() => openChatMessage(scope.row.userId)" type="primary">
							{{ scope.row.friendName }}
							<div v-if="scope.row.flag === 1" style="margin-left: 10px">
								<el-tag type="warning">在聊</el-tag>
							</div>
						</el-link>
					</template>
				</el-table-column>
			</el-table>

			<!--      <el-button @click="innerDrawer = true">Click me!</el-button>-->
			<el-drawer v-model="innerDrawer" :append-to-body="true" :before-close="handleClose" title="聊天记录">
				<p>_(:зゝ∠)_</p>
			</el-drawer>
		</div>
	</el-drawer>
	<ChatDialog ref="isDialogVisible" />
	<PostDynamic ref="dynamic" />
</template>

<script lang="ts" setup>
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import UserInfo from './info.vue'
import { IHooksOptions } from '@/hooks/interface'
import AddOrUpdate from '@/views/bot/botList/add-or-update.vue'
import Update from '@/views/bot/botList/update.vue'
import { ElMessage } from 'element-plus'
import ChatDialog from '@/views/bot/botList/ChatDialog.vue'
import { APIGetChatHistory, APIGetDistance, APIGetModelList, APIGetUserFriend, APIModifyDistance, APISetBotModel } from '@/api/ai/aiApi'
import PostDynamic from '@/views/bot/botList/PostDynamic.vue'

const handleClose = () => {
	innerDrawer.value = false
}
const cities = ref<any>([])
const parentBorder = ref(false)
const innerDrawer = ref(false)
const distance = ref(0)
const state: IHooksOptions = reactive({
	dataListUrl: '/admin/sys/user/page',
	deleteUrl: '/admin/sys/user/bot/delete',
	queryForm: {
		userId: '',
		botType: 1,
		// 机器人标识
		bot: 1
	}
})
const handleChange = () => {
	// if(distance.value > 1000){
	//   ElMessage.error("最大只能1000KM")
	// }
	APIModifyDistance(distance.value).then((res: any) => {
		if (res.code === 0) {
			ElMessage.success('修改成功')
		}
	})
}

const getDistance = () => {
	APIGetDistance().then((res: any) => {
		if (res.code === 0) {
			distance.value = res.data
		}
	})
}
const isDialogVisible = ref()
getDistance()
const openChatMessage = (userId: number) => {
	const botId = currentChatDeviceEmail.value
	APIGetChatHistory(botId, userId).then((res: any) => {
		if (res.code === 0) {
			const params = {
				chatMessage: res.data,
				botId: currentChatDeviceEmail.value,
				userId: userId
			}
			isDialogVisible.value.init(params)
		}
	})
}
const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}
const drawerData = reactive({
	dataListLoading: false,
	dataList: []
})
const drawer = ref(false)
const currentChatDeviceEmail = ref(0)
const openDrawer = (botId: number) => {
	currentChatDeviceEmail.value = botId
	drawerData.dataListLoading = true
	drawer.value = true
	APIGetUserFriend(botId)
		.then((res: any) => {
			if (res.code === 0) {
				drawerData.dataList = res.data
			}
		})
		.catch(ex => {
			ElMessage.error('获取好友列表失败')
		})
		.finally(() => {
			drawerData.dataListLoading = false
		})
}
const queryRef = ref()
const userInfoRef = ref()

const updateRef = ref()
const dynamic = ref()
const sendDynamic = (row: any) => {
	dynamic.value.init(row)
}

const updateRefHandle = (row: any) => {
	updateRef.value.init(row)
}
const getModelList = () => {
	APIGetModelList()
		.then((resp: any) => {
			if (resp.code === 0) {
				cities.value = resp.data
			} else {
				cities.value = []
			}
		})
		.catch(() => {
			ElMessage.error('获取模型列表失败')
			cities.value = []
		})
}
const botSetModel = (userId: any, modelId: any) => {
	const params = {
		userId: userId,
		modelId: modelId
	}
	APISetBotModel(params)
		.then((resp: any) => {
			if (resp.code === 0) {
				ElMessage.success('设置成功')
			}
		})
		.finally(() => {
			getModelList()
		})
}
getModelList()
const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, reset, deleteBatchHandle } = useCrud(state)
</script>
