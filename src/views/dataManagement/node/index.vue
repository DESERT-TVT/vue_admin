<template>
	<el-card>
		<!-- 查询 -->
		<el-form :inline="true" :model="state.queryForm">
			<el-form-item label="选择平台:">
				<el-select
					v-model="state.queryForm.platformId"
					filterable
					remote
					:loading="loading"
					placeholder="请选择"
					style="width: 240px"
					@visible-change="handleVisibleChange"
					@popup-scroll="handleScroll"
				>
					<el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
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
			<el-table-column prop="id" label="节点id" header-align="center" align="center" min-width="170" />
			<el-table-column prop="name" label="节点name" header-align="center" align="center" min-width="170" />
			<el-table-column prop="platformId" label="平台id" header-align="center" align="center" min-width="170" />
			<el-table-column prop="createTime" label="创建时间" header-align="center" align="center" min-width="170" />
			<el-table-column prop="creator" label="创建人" header-align="center" align="center" min-width="170" />
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
				<el-button link type="primary" @click="addOrUpdateHandle(scope.row)">修改</el-button>
					<el-button link type="primary" @click="deleteGetHandle({ id: scope.row.id })">删除</el-button>
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
<script setup lang="ts" name="DataManagementNodeIndex">
import { IHooksOptions } from '@/hooks/interface'
import { onMounted, reactive, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { useCrud } from '@/hooks'
import { Search } from '@element-plus/icons-vue'
import { platformApi, PlatformList } from '@/api/dataStatistics'

const state: IHooksOptions = reactive({
	dataListUrl: '/admin/node/page',
	deleteUrl: '/admin/delete/node',
	createdIsNeed: false,
	queryForm: {
		name: undefined,
		platformId: undefined,
	}
})

// 分页平台查询
const options = ref<PlatformList[]>([])
const loading = ref(false)
const pageParams = {
	page: 1,
	limit: 10,
	name: ''
}
const total = ref(0)

// 默认加载第一页并选择第一项
onMounted(async () => {
	pageParams.page = 1
	const data = await platformApi(pageParams)
	options.value = data.data.list
	total.value = data.data.total
	if (total.value > 0) {
		state.queryForm.platformId = options.value[0].id // 默认选中第一项
	}
	getDataList()
})

// 下拉展开时刷新第一页
const handleVisibleChange = async (visible: boolean) => {
	if (visible && options.value.length === 0) {
		pageParams.page = 1
		const data = await platformApi(pageParams)
		options.value = data.data.list
	}
}

// 下拉滚动触底加载更多
const handleScroll = async (e: HTMLElement) => {
	const wrap = document.querySelector('.el-select-dropdown .el-select-dropdown__wrap') as HTMLElement
	if (!wrap) return
	const { clientHeight, scrollHeight } = wrap
	if (e.scrollTop + clientHeight >= scrollHeight - 5) {
		if (options.value.length < total.value && !loading.value) {
			pageParams.page++
			const more = await platformApi(pageParams)
			options.value.push(...more.data.list)
		}
	}
}

const addOrUpdateRef = ref()
const addOrUpdateHandle = (row?: any) => {
	addOrUpdateRef.value.init(row)
}

const { getDataList, selectionChangeHandle, sortChangeHandle, sizeChangeHandle, currentChangeHandle, deleteGetHandle } =
		useCrud(state)
</script>
