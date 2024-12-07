<template>
	<el-card>
		<!-- 查询 -->
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.search" placeholder="搜索内容" :prefix-icon="Search" clearable style="width: 215px" disabled></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">{{ $t('query') }}</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'setting:emailconfig:add'" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }} </el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'setting:emailconfig:del'" type="danger" @click="deleteBatchHandle()">{{ $t('delete') }} </el-button>
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
			<el-table-column prop="host" label="服务器地址" header-align="center" align="center" min-width="170" />
			<el-table-column prop="port" label="服务器端口" header-align="center" align="center" min-width="100" />
			<el-table-column prop="from" label="发送方" header-align="center" align="center" min-width="170" />
			<el-table-column prop="username" label="用户名" header-align="center" align="center" min-width="200" />
			<el-table-column prop="password" label="密码" header-align="center" align="center" min-width="150" />
			<el-table-column prop="sslEnable" label="启用SSL" header-align="center" align="center" min-width="100">
				<template #default="scope">
					<el-switch
						v-model="scope.row.sslEnable"
						:loading="scope.row.sslEnableLoading"
						inline-prompt
						:active-value="1"
						active-text="开启"
						:inactive-value="0"
						inactive-text="关闭"
						style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
						@change="sslEnableChangeHandle(scope.row)"
					/>
				</template>
			</el-table-column>
			<el-table-column prop="dailyTotal" label="每日发送上限" header-align="center" align="center" sortable="custom" min-width="150" />
			<el-table-column prop="status" label="状态" header-align="center" align="center">
				<template #default="scope">
					<el-switch
						v-model="scope.row.status"
						:loading="scope.row.statusLoading"
						inline-prompt
						:active-value="1"
						active-text="开启"
						:inactive-value="0"
						inactive-text="关闭"
						style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
						@change="statusChangeHandle(scope.row)"
					/>
				</template>
			</el-table-column>
			<!--			<el-table-column prop="updater" label="操作者" header-align="center" align="center" width="150" />-->
			<!--			<el-table-column prop="updateTime" label="更新时间" header-align="center" align="center" width="170" sortable="custom" />-->
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-auth="'setting:emailconfig:edit'" link type="primary" @click="addOrUpdateHandle(scope.row)">
						{{ $t('edit') }}
					</el-button>
					<el-button v-auth="'setting:emailconfig:del'" link type="primary" @click="deleteBatchHandle(scope.row.id)">
						{{ $t('delete') }}
					</el-button>
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
import AddOrUpdate from '@/views/setting/emailConfig/add-or-update.vue'
import { useEmailConfigSubmitApi } from '@/api/config/setting'
import { useCrud } from '@/hooks'
import { Search } from '@element-plus/icons-vue'

const state: IHooksOptions = reactive({
	dataListUrl: '/admin/config/email/page',
	deleteUrl: '/admin/config/email',
	queryForm: {
		search: undefined
	}
})

const statusChangeHandle = (row: any) => {
	row.statusLoading = true
	const dataForm = { id: row.id, status: row.status }
	useEmailConfigSubmitApi(dataForm)
		.then(() => {
			row.statusLoading = false
		})
		.catch(() => {
			row.statusLoading = false
			row.status = row.status === 1 ? 0 : 1
		})
}

const sslEnableChangeHandle = (row: any) => {
	row.sslEnableLoading = true
	const dataForm = { id: row.id, sslEnable: row.sslEnable }
	useEmailConfigSubmitApi(dataForm)
		.then(() => {
			row.sslEnableLoading = false
		})
		.catch(() => {
			row.sslEnableLoading = false
			row.sslEnable = row.sslEnable === 1 ? 0 : 1
		})
}

const addOrUpdateRef = ref()
const addOrUpdateHandle = (row?: any) => {
	addOrUpdateRef.value.init(row)
}

const { getDataList, selectionChangeHandle, sortChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
