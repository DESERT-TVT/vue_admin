<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query">
				<el-form :inline="true" :model="state.queryForm">
					<el-form-item prop="userId">
						<el-input v-model="state.queryForm.name" placeholder="名称"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button icon="Search" type="primary" @click="queryHandle">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button icon="RefreshRight" @click="resetHandle">重置</el-button>
					</el-form-item>
					<el-form-item>
						<el-button icon="Plus" type="primary" @click="addSite()">新增</el-button>
					</el-form-item>
					<el-form-item>
						<el-button v-auth="'sys:site:del'" icon="Delete" type="danger" @click="deleteBatchHandle()"> 批量删除 </el-button>
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
					style="width: 100%"
					@selection-change="selectionChangeHandle"
				>
					<el-table-column align="center" header-align="center" type="selection" width="38"></el-table-column>
					<el-table-column align="center" header-align="center" label="id" prop="id"></el-table-column>
					<el-table-column align="center" header-align="center" label="平台名称" prop="siteName"></el-table-column>
					<el-table-column align="center" header-align="center" label="域名" prop="domain"></el-table-column>
					<el-table-column align="center" header-align="center" label="平台收益率" prop="siteProfitRate"></el-table-column>
					<el-table-column align="center" header-align="center" label="平台内用户抽成" prop="siteUserProfitRate"></el-table-column>
					<!--          修改-->
					<el-table-column align="center" fixed="right" header-align="center" label="操作" width="160">
						<template #default="scope">
							<el-button v-auth="'sys:menu:update'" link type="primary" @click="addOrUpdateHandle(scope.row)"> 修改 </el-button>
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
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import AddOrUpdate from '@/views/site/manager/add-or-update.vue'

const loading = ref(false)
const state: IHooksOptions = reactive({
	dataListUrl: '/admin/site/config/page',
	queryForm: {
		name: ''
	},
	deleteUrl: '/admin/site/config/del'
})
const addSite = () => {
	addOrUpdateRef.value.init()
}
const addOrUpdateRef = ref()
const addOrUpdateHandle = (row: any) => {
	addOrUpdateRef.value.init(row)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
const confirmShareUserIds = ref([])
const queryHandle = () => {
	loading.value = true
	getDataList()
	loading.value = false
}

const resetHandle = () => {
	state.queryForm.userId = ''
	getDataList()
}
</script>

<style lang="scss" scoped>
body {
	margin: 0;
}

.example-showcase .el-loading-mask {
	z-index: 9;
}
</style>
