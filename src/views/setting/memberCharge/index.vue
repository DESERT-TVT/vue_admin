<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query">
				<el-form :inline="true" :model="state.queryForm">
					<el-form-item>
						<el-button v-auth="'setting:membercharge:add'" icon="Plus" type="primary" @click="addOrUpdateHandle()"> 新增 </el-button>
					</el-form-item>
					<el-form-item>
						<el-button v-auth="'setting:membercharge:del'" icon="Delete" plain type="danger" @click="deleteBatchHandle()">批量删除 </el-button>
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
					<el-table-column align="center" header-align="center" label="id" prop="id"></el-table-column>
					<el-table-column align="center" header-align="center" label="文字内容（描述）" prop="title"></el-table-column>
					<el-table-column align="center" header-align="center" label="天数" prop="days"></el-table-column>
					<el-table-column align="center" header-align="center" label="赠送天数" prop="giftDays"></el-table-column>
					<el-table-column align="center" header-align="center" label="价格" prop="price"> </el-table-column>
					<el-table-column align="center" header-align="center" label="金币所需价格" prop="coinPrice"> </el-table-column>
					<el-table-column align="center" header-align="center" label="原价" prop="originalPrice"></el-table-column>
					<el-table-column align="center" header-align="center" label="状态" prop="status">
						<template #default="scope">
							<el-switch
								v-model="scope.row.status"
								:active-value="1"
								:inactive-value="0"
								active-text="正常"
								inactive-text="禁用"
								inline-prompt
								@change="() => handleStatusChange(scope.row)"
							></el-switch>
						</template>
					</el-table-column>
					<el-table-column align="center" fixed="right" header-align="center" label="操作" width="130">
						<template #default="scope">
							<el-button v-auth="'setting:membercharge:edit'" type="primary" @click="() => addOrUpdateHandle(scope.row)"> 修改 </el-button>
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
import AddOrUpdate from '@/views/setting/memberCharge/add-or-update.vue'
import { APIModifyGoldCoinModify, APIModifyMemberModify } from '@/api/config/setting'

const auditDialogVisible = ref(false)
const loading = ref(false)
const drawer = ref(false)
const handleStatusChange = (row: any) => {
	let currentStatus = 0
	if (row.status === 1) {
		currentStatus = 1
	} else {
		currentStatus = 0
	}
	const parmas = {
		id: row.id,
		status: currentStatus
	}
	APIModifyMemberModify(parmas)
		.then(resp => {
			if (resp.data) {
				ElMessage.success({
					message: '操作成功',
					duration: 500,
					onClose: () => {}
				})
			} else {
				ElMessage.success({
					message: '修改失败',
					duration: 500,
					onClose: () => {
						getDataList()
					}
				})
			}
		})
		.catch(() => {
			ElMessage.error('操作失败')
		})
		.finally(() => {})
}
// const queryRef = ref()
const state: IHooksOptions = reactive({
	dataListUrl: '/admin/config/member/config',
	deleteUrl: '/admin/config/member/config/delete',
	queryForm: {}
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (row?: any) => {
	addOrUpdateRef.value.init(row)
}
const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, reset, deleteBatchHandle } = useCrud(state)

const queryHandle = () => {
	loading.value = true
	getDataList()
	loading.value = false
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
