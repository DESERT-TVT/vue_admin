<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm">
			<el-form-item>
				<el-input v-model="state.queryForm.userId" placeholder="请输入用户Id" clearable style="width: 215px"></el-input>
			</el-form-item>
			<el-form-item>
				<el-select v-model="state.queryForm.status" placeholder="请选择状态" clearable>
					<el-option :value="1" label="开启"></el-option>
					<el-option :value="0" label="关闭"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">{{ $t('query') }}</el-button>
				<el-button v-auth="'admin:discovery:add'" type="primary" @click="onDiscoveryEditOrAdd">新增</el-button>
				<el-button v-auth="'admin:discovery:edit'" type="primary" @click="onBatchUpdate('editTrue')">批量状态开启</el-button>
				<el-button v-auth="'admin:discovery:edit'" type="danger" @click="onBatchUpdate('editFalse')">批量状态关闭</el-button>
				<el-button v-auth="'admin:discovery:delete'" type="warning" @click="onBatchUpdate('delete')">批量删除</el-button>
			</el-form-item>
			<el-table
				v-loading="state.dataListLoading"
				show-overflow-tooltip
				:data="state.dataList"
				border
				class="layout-table"
				@selection-change="selectionChangeHandle"
			>
				<el-table-column type="selection" header-align="center" align="center" width="38" />
				<el-table-column prop="id" label="ID" header-align="center" align="center" />
				<el-table-column prop="userId" label="用户ID" header-align="center" align="center" />
				<el-table-column prop="userName" label="用户名" header-align="center" align="center" />
				<el-table-column prop="nickName" label="昵称" header-align="center" align="center" />
				<el-table-column prop="status" label="状态" header-align="center" align="center">
					<template #default="scope">
						<el-switch
							v-model="scope.row.status"
							:active-value="1"
							:inactive-value="0"
							inline-prompt
							active-text="开启"
							inactive-text="关闭"
							@change="onChangeStatus(scope.row)"
						/>
					</template>
				</el-table-column>
				<fast-dict-column prop="gender" label="性别" dict-type="user_gender"></fast-dict-column>
				<el-table-column label="操作" fixed="right" header-align="center" align="center">
					<template #default="scope">
						<el-button v-auth="'admin:discovery:edit'" type="primary" link @click="onDiscoveryEditOrAdd(scope.row)">编辑</el-button>
						<el-button v-auth="'admin:discovery:delete'" type="primary" link @click="onDiscoveryDelect(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-form>
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
	<AddOrUpdate ref="addOrUpdateRef" @refresh-data-list="getDataList" />
</template>

<script lang="ts" setup>
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { computed, reactive, ref } from 'vue'
import AddOrUpdate from './AddOrUpdate.vue'
import { DiscoveryEditOrAddReq, DiscoveryPageRes, fetchDiscoveryDelete, fetchDiscoveryEdit } from '@/api/social/discovery'
import { ElMessage, ElMessageBox } from 'element-plus'

const state: IHooksOptions = reactive({
	dataListUrl: '/admin/discovery/page',
	limit: 10,
	queryForm: {
		userId: '',
		status: ''
	}
})
const addOrUpdateRef = ref<InstanceType<typeof AddOrUpdate>>()
const onDiscoveryEditOrAdd = (row: DiscoveryPageRes) => {
	addOrUpdateRef.value?.init(row)
}
const onDiscoveryDelect = (row: DiscoveryPageRes) => {
	ElMessageBox.confirm('确定删除吗？', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	}).then(() => {
		fetchDiscoveryDelete({ userIds: [row.userId.toString()] }).then(() => {
			ElMessage.success('删除成功')
			getDataList()
		})
	})
}
const onBatchUpdate = async (updateType: 'editTrue' | 'editFalse' | 'delete') => {
	const data: DiscoveryPageRes[] = state.dataListSelections?.length ? state.dataListSelections : []
	const userIds: string[] = []
	if (state.dataList) {
		data.forEach(item => {
			if (item) {
				userIds.push(item.userId.toString())
			}
		})
	}
	if (userIds.length === 0) {
		ElMessage.warning(updateType === 'delete' ? '请选择删除用户' : '请选择编辑用户')
		return
	}
	const confirmMessage = updateType === 'delete' ? '您即将进行批量删除用户，请再次点击确认！' : '您即将进行批量编辑用户状态，请再次点击确认！'
	ElMessageBox.confirm(confirmMessage, '警告', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning'
	})
		.then(async () => {
			let res
			state.dataListLoading = true
			switch (updateType) {
				case 'delete':
					res = await fetchDiscoveryDelete({
						userIds
					}).finally(() => {
						state.dataListLoading = false
					})
					break
				case 'editTrue':
					res = await fetchDiscoveryEdit({
						userIds,
						status: 1
					}).finally(() => {
						state.dataListLoading = false
					})
					break
				case 'editFalse':
					res = await fetchDiscoveryEdit({
						userIds,
						status: 0
					}).finally(() => {
						state.dataListLoading = false
					})
					break
			}
			if (res) {
				ElMessage.success('操作成功')
				getDataList()
			}
		})
		.catch(() => {
			ElMessage({
				type: 'info',
				message: '已取消批量操作'
			})
		})
}
const onChangeStatus = (row: any) => {
	fetchDiscoveryEdit({
		userIds: [row.userId],
		status: row.status
	}).then(res => {
		if (res) {
			ElMessage.success('操作成功')
			currentChangeHandle(state.page || 1)
		}
	})
}
const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, reset } = useCrud(state)
</script>

<style lang="scss" scoped></style>
