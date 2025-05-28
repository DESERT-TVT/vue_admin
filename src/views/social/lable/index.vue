<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm">
			<el-form-item>
				<el-input v-model.trim="state.queryForm.labelName" placeholder="请输入标签名" clearable style="width: 215px"></el-input>
			</el-form-item>
			<el-form-item>
				<el-select v-model="state.queryForm.labelType" placeholder="请选择标签类型" clearable>
					<el-option :value="1" label="个性标签"></el-option>
					<el-option :value="2" label="我会的表演"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">{{ $t('query') }}</el-button>
				<el-button v-auth="'admin:label:add'" type="primary" @click="onDiscoveryEditOrAdd">新增</el-button>
				<el-button v-auth="'admin:label:delete'" type="warning" @click="onBatchUpdate()">批量删除</el-button>
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
				<el-table-column prop="labelName" label="标签名称" header-align="center" align="center" />
				<el-table-column prop="labelType" label="标签类型" header-align="center" align="center">
					<template #default="scope">
						<el-tag v-if="scope.row.labelType == 1" type="success">个性标签</el-tag>
						<el-tag v-if="scope.row.labelType == 2" type="success">我会的表演</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="creator" label="创作者" header-align="center" align="center" />
				<el-table-column prop="createTime" label="创建时间" header-align="center" align="center" />
				<el-table-column label="操作" fixed="right" header-align="center" align="center">
					<template #default="scope">
						<el-button v-auth="'admin:label:delete'" type="primary" link @click="onDiscoveryDelect(scope.row)">删除</el-button>
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
	<Add ref="addRef" @refresh-data-list="getDataList" />
</template>

<script lang="ts" setup>
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { computed, reactive, ref } from 'vue'
import Add from './components/add.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetchLableDelete, LablePageRes } from '@/api/social/lable'

const state: IHooksOptions = reactive({
	dataListUrl: '/admin/label/page',
	limit: 10,
	queryForm: {
		labelType: '',
		labelName: ''
	}
})
const addRef = ref<InstanceType<typeof Add>>()
const onDiscoveryEditOrAdd = () => {
	addRef.value?.init()
}
const onDiscoveryDelect = (row: LablePageRes) => {
	ElMessageBox.confirm('确定删除吗？', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	}).then(() => {
		fetchLableDelete({ ids: [row.id], type: row.labelType }).then(res => {
			if (res) {
				if (!res.data.length) {
					ElMessage.success('删除成功')
					getDataList()
					return
				}
				ElMessageBox.confirm(`${res.data.join(',')}正在使用，删除失败`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				})
			}
		})
	})
}
const onBatchUpdate = async () => {
	const data: LablePageRes[] = state.dataListSelections?.length ? state.dataListSelections : []
	if (data.length === 0) {
		ElMessage.warning('请选择要操作的用户')
		return
	}

	// 根据labelType分组
	const type1Items = data.filter(item => item?.labelType === 1)
	const type2Items = data.filter(item => item?.labelType === 2)

	const type1Ids = type1Items.map(item => item.id)
	const type2Ids = type2Items.map(item => item.id)

	// 确认消息
	const confirmMessage = `您即将进行批量删除操作：
  - 个性标签: ${type1Ids.length}个
  - 我会的表演: ${type2Ids.length}个
  请确认操作。`

	ElMessageBox.confirm(confirmMessage, '警告', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning'
	})
		.then(async () => {
			state.dataListLoading = true
			try {
				let failedIds: number[] = []
				if (type1Ids.length > 0) {
					const res1 = await fetchLableDelete({
						ids: type1Ids,
						type: 1
					})
					if (res1.data && res1.data.length > 0) {
						failedIds = [...failedIds, ...res1.data]
					}
				}
				if (type2Ids.length > 0) {
					const res2 = await fetchLableDelete({
						ids: type2Ids,
						type: 2
					})
					if (res2.data && res2.data.length > 0) {
						failedIds = [...failedIds, ...res2.data]
					}
				}

				// 处理失败的ID
				if (failedIds.length > 0) {
					ElMessageBox.confirm(`删除失败${failedIds.length}个，原因：${failedIds.join(',')}正在使用`, '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
				} else {
					ElMessage.success('批量操作成功')
				}
				getDataList() // 刷新数据
			} catch (error) {
				ElMessage.error('批量操作失败')
				console.error('批量删除错误:', error)
			} finally {
				state.dataListLoading = false
			}
		})
		.catch(() => {
			ElMessage.info('已取消批量操作')
		})
}
const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, reset } = useCrud(state)
</script>

<style lang="scss" scoped></style>
