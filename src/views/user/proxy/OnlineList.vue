<template>
	<el-drawer
		v-model="visible"
		title="主播列表"
		:close-on-click-modal="false"
		:destroy-on-close="true"
		:append-to-body="true"
		size="80%"
		direction="btt"
	>
		<!-- 查询 -->
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-date-picker
					v-model="state.queryForm.start"
					type="date"
					:clearable="false"
					placeholder="选择开始时间"
					format="YYYY-MM-DD"
					value-format="YYYY-MM-DD"
				/>
			</el-form-item>
			<el-form-item>
				<el-date-picker
					v-model="state.queryForm.end"
					:clearable="false"
					type="date"
					placeholder="选择结束时间"
					format="YYYY-MM-DD"
					value-format="YYYY-MM-DD"
				/>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.nickName" placeholder="用户昵称" clearable />
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">{{ $t('query') }}</el-button>
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
			<el-table-column prop="userId" label="用户ID" header-align="center" align="center" />
			<el-table-column align="center" header-align="center" label="昵称" width="150">
				<template #default="scope">
					<el-popover :width="383" placement="right" trigger="hover">
						<template #reference>
							<el-image :src="scope.row.avatar" style="margin-top: 7px; height: 60px; border-radius: 6px" />
						</template>
						<template #default>
							<el-image :src="scope.row.avatar" style="width: 356px" />
						</template>
					</el-popover>
					<br />
					{{ scope.row.nickName }}
				</template>
			</el-table-column>
			<el-table-column prop="performance" label="业绩" header-align="center" align="center" />
			<el-table-column prop="online" label="是否是主播" header-align="center" align="center">
				<template #default="scope">
					<el-tag v-if="scope.row.online" type="success">是</el-tag>
					<el-tag v-if="!scope.row.online" type="danger">否</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="goddess" label="是否是女神" header-align="center" align="center">
				<template #default="scope">
					<el-tag v-if="scope.row.goddess" type="success">是</el-tag>
					<el-tag v-if="!scope.row.goddess" type="danger">否</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="isVip" label="是否是vip" header-align="center" align="center">
				<template #default="scope">
					<el-tag v-if="scope.row.isVip" type="success">是</el-tag>
					<el-tag v-if="!scope.row.isVip" type="danger">否</el-tag>
				</template>
			</el-table-column>
			<fast-dict-column dict-type="user_gender" label="性别" prop="gender" width="80"></fast-dict-column>
			<el-table-column prop="realer" label="是否通过真人认证" header-align="center" align="center">
				<template #default="scope">
					<el-tag v-if="scope.row.realer" type="success">通过</el-tag>
					<el-tag v-if="!scope.row.realer" type="danger">未通过</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" min-width="300">
				<template #default="scope">
					<el-button v-auth="'proxy:user:income'" type="primary" link @click="onShowOlinePage(scope.row)">主播收益列表</el-button>
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
	</el-drawer>
	<OlinePage ref="olinePageRef" />
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import dayjs from 'dayjs'
import { IHooksOptions } from '@/hooks/interface'
import { ProxyAddReq } from '@/api/user/proxy'
import OlinePage from './OlinePage.vue'

const visible = ref(false)
const state: IHooksOptions = reactive({
	dataListUrl: '/admin/proxy/online/list',
	createdIsNeed: false,
	limit: 100,
	queryForm: {
		start: dayjs().format('YYYY-MM-DD'),
		end: dayjs().format('YYYY-MM-DD'),
		userId: '',
		nickName: '',
		userType: 1
	}
})
const olinePageRef = ref<InstanceType<typeof OlinePage>>()
const resetQueryForm = () => {
	state.queryForm.start = dayjs().format('YYYY-MM-DD')
	state.queryForm.end = dayjs().format('YYYY-MM-DD')
}
const init = (userId: string) => {
	visible.value = true
	state.queryForm.userId = userId
	resetQueryForm()
	getDataList()
}

const { getDataList, selectionChangeHandle, sortChangeHandle, sizeChangeHandle, currentChangeHandle } = useCrud(state)
const onShowOlinePage = (row: ProxyAddReq) => {
	olinePageRef.value?.init(row.userId)
}
defineExpose({
	init
})
</script>
