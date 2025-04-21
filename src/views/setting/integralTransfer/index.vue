<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query">
				<el-form :inline="true" :model="state.queryForm">
					<el-form-item>
						<el-select v-model="state.queryForm.type" placeholder="请选择类型">
							<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button icon="Search" type="primary" @click="queryHandle">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button v-auth="'setting:integralrransfer:add'" icon="Plus" type="primary" @click="addOrUpdateHandle()"> 新增 </el-button>
					</el-form-item>
					<el-form-item>
						<el-button icon="RefreshRight" @click="resetHandle">重置</el-button>
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
					<el-table-column align="center" header-align="center" label="钻石" prop="integral"></el-table-column>
					<el-table-column align="center" header-align="center" label="兑换结果" prop="settle"></el-table-column>
					<el-table-column align="center" header-align="center" label="类型" prop="type">
						<template #default="scope">
							<div v-if="scope.row.type === 'integral2coin'">钻石换金币</div>
							<div v-if="scope.row.type === 'integral2cache'">钻石提现</div>
						</template>
					</el-table-column>
					<el-table-column align="center" fixed="right" header-align="center" label="修改" width="120">
						<template #default="scope">
							<el-button v-auth="'setting:integralrransfer:edit'" type="text" @click="() => getSettleDetail(scope.row)"> 修改 </el-button>
							<el-button v-auth="'setting:integralrransfer:del'" link type="primary" @click="() => deleteBatchHandle(scope.row.id)">删除 </el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-card>
		</el-col>
	</el-row>
	<add-or-update ref="addOrUpdateRef" @refresh-data-list="getDataList"></add-or-update>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'

import AddOrUpdate from '@/views/setting/integralTransfer/add-or-update.vue'

const loading = ref(false)
const drawer = ref(false)
const addOrUpdateRef = ref()
const addOrUpdateHandle = () => {
	addOrUpdateRef.value.init()
}
// const queryRef = ref()
const state: IHooksOptions = reactive({
	dataListUrl: '/admin/config/intergral/config/list',
	deleteUrl: '/admin/config/intergral/config/delete',
	queryForm: {
		type: 'integral2coin'
	}
})
const options = [
	{ value: 'integral2coin', label: '钻石换金币' },
	{ value: 'integral2cache', label: '钻石提现' }
]

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
	state.queryForm.userId = ''
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
