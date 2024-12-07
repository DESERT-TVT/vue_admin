<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query">
				<el-form :inline="true" :model="state.queryForm">
					<el-form-item>
						<el-button v-auth="'setting:levelpriceconfig:add'" icon="Plus" type="primary" @click="addOrUpdateHandle()"> 新增 </el-button>
					</el-form-item>
				</el-form>
			</el-card>

			<!-- table -->
			<el-card>
				<el-table
					v-loading="state.dataListLoading"
					:data="state.dataList"
					border
					class="layout-table"
					show-overflow-tooltip
					style="width: 100%"
					@selection-change="selectionChangeHandle"
				>
					<el-table-column align="center" header-align="center" type="selection" width="38"></el-table-column>
					<el-table-column align="center" header-align="center" label="等级" prop="level"></el-table-column>
					<el-table-column align="center" header-align="center" label="经验要求" prop="exp"></el-table-column>
					<el-table-column align="center" header-align="center" label="文字聊天收费" prop="textPrice">
						<template #default="scope">
							{{ scope.row.textChatPrice !== null && scope.row.textChatPrice !== undefined ? scope.row.textChatPrice : 0 }}金币/条
						</template>
					</el-table-column>
					<el-table-column align="center" header-align="center" label="语音聊天收费" prop="voicePrice">
						<template #default="scope">
							{{ scope.row.voiceChatPrice !== null && scope.row.voiceChatPrice !== undefined ? scope.row.voiceChatPrice : 0 }}/分钟
						</template>
					</el-table-column>
					<el-table-column align="center" header-align="center" label="视频聊天收费" prop="videoPrice">
						<template #default="scope">
							{{ scope.row.videoChatPrice !== null && scope.row.videoChatPrice !== undefined ? scope.row.videoChatPrice : 0 }}/分钟
						</template>
					</el-table-column>
					<el-table-column align="center" header-align="center" label="扣费周期(类型为语音或视频时生效)" prop="feePeriod">
						<template #default="scope">
							{{ scope.row.feePeriod !== null && scope.row.feePeriod !== undefined ? scope.row.feePeriod : 0 }}分钟
						</template>
					</el-table-column>

					<el-table-column align="center" fixed="right" header-align="center" label="操作" width="120">
						<template #default="scope">
							<el-button v-auth="'setting:levelpriceconfig:edit'" type="text" @click="() => getSettleDetail(scope.row)"> 修改 </el-button>
							<el-button v-auth="'setting:levelpriceconfig:del'" link type="primary" @click="() => deleteBatchHandle(scope.row.level)">删除 </el-button>
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
	<add-or-update ref="addOrUpdateRef" @refresh-data-list="getDataList"></add-or-update>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import { ElDrawer, ElMessage } from 'element-plus'
import { APIGetUnionDetailList, APIModifyUnionActive } from '@/api/union/union'
import AddOrUpdate from '@/views/setting/levelPriceConfig/add-or-update.vue'
import { APIAddOrUpdatePriceConfig } from '@/api/config/chatPrice'

const loading = ref(false)
const drawer = ref(false)

// const queryRef = ref()
const state: IHooksOptions = reactive({
	dataListUrl: '/admin/config/chat/price/list',
	deleteUrl: '/admin/config/chat/price/delete',
	queryForm: {
		type: ''
	}
})
const addOrUpdateRef = ref()
const addOrUpdateHandle = () => {
	addOrUpdateRef.value.init()
}

const getSettleDetail = async (row: any) => {
	addOrUpdateRef.value.init(row)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, reset, deleteBatchHandle } = useCrud(state)

const queryHandle = () => {
	loading.value = true
	getDataList()
	loading.value = false
}

const resetHandle = () => {
	state.queryForm.type = ''
}
</script>

<style scoped lang="scss">
body {
	margin: 0;
}
.example-showcase .el-loading-mask {
	z-index: 9;
}
</style>
