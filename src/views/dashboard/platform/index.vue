<template>
	<el-card>
		<!-- 查询 -->
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.name" placeholder="搜索名称" clearable :prefix-icon="Search" style="width: 215px"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">搜索</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-form-item>
		</el-form>

		<!-- 表格 -->
		<el-table
			v-loading="state.dataListLoading"
			show-overflow-tooltip
			:data="state.dataList"
			border
			style="width: 100%"
			@selection-change="selectionChangeHandle"
			@sort-change="sortChangeHandle"
		>
			<el-table-column type="selection" header-align="center" align="center" width="38" />
			<el-table-column prop="id" label="ID" header-align="center" align="center" min-width="170" />
			<el-table-column prop="name" label="平台名称" header-align="center" align="center" min-width="170" />
			<el-table-column prop="createTime" label="创建时间" header-align="center" align="center" min-width="170" />
			<el-table-column prop="creator" label="创建人" header-align="center" align="center" min-width="170" />
			<el-table-column prop="secret" label="平台密钥" header-align="center" align="center" min-width="170" />
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button link type="primary" @click="addOrUpdateHandle(scope.row)">
					修改
					</el-button>
					<el-button link type="primary" @click="deleteGetHandle({id :scope.row.id})">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页	-->
		<el-pagination
			:current-page="state.page"
			:page-sizes="state.pageSizes"
			:page-size="state.limit"
			:total="state.total"
			layout="total, sizes, prev, pager, next, jumper"
			@size-change="sizeChangeHandle"
			@current-change="currentChangeHandle"
		>
		</el-pagination>

		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update ref="addOrUpdateRef" @refresh-data-list="getDataList" />
	</el-card>
</template>
<script setup lang="ts">
import { IHooksOptions } from '@/hooks/interface'
import { reactive, ref } from 'vue'
import AddOrUpdate from '@/views/dashboard/platform/add-or-update.vue'
import { useCrud } from '@/hooks'
import { Search } from '@element-plus/icons-vue'

const state: IHooksOptions = reactive({
	dataListUrl: '/admin/platform/page',
	deleteUrl: '/admin/delete/platform',
	queryForm: {
		name: undefined
	}
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (row?: any) => {
	addOrUpdateRef.value.init(row)
}

const { getDataList, selectionChangeHandle, sortChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, deleteGetHandle } = useCrud(state)
</script>
