<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query">
				<el-form :inline="true" :model="state.queryForm">
					<el-form-item prop="language">
						<el-select v-model="state.queryForm.language" placeholder="请选择语言" clearable>
							<el-option v-for="item in languageList" :key="item.value" :value="item.value" :label="item.label"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button icon="Search" :loading="state.dataListLoading" type="primary" @click="getDataList">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onClickAdd">新增</el-button>
					</el-form-item>
					<el-space>
						<el-button icon="Delete" plain type="danger" @click="onClickDelete"> 批量删除 </el-button>
					</el-space>
				</el-form>
			</el-card>

			<!-- table -->
			<el-card>
				<el-table
					v-loading="state.dataListLoading"
					show-overflow-tooltip
					:data="state.dataList"
					border
					class="layout-table"
					style="width: 100%"
					@selection-change="selectionChangeHandle"
				>
					<el-table-column type="selection" header-align="center" align="center" width="38"></el-table-column>
					<el-table-column prop="id" label="id" header-align="center" align="center"></el-table-column>
					<el-table-column prop="content" label="内容" header-align="center" align="center"></el-table-column>
					<el-table-column prop="language" label="语言" header-align="center" align="center"></el-table-column>
					<el-table-column align="center" fixed="right" header-align="center" label="操作" width="160">
						<template #default="scope">
							<el-button link type="primary" @click="onClickUpdata(scope.row)">修改</el-button>
							<el-button link type="primary" @click="onClickDelete(scope.row.id)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
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
			</el-card>
		</el-col>
		<add ref="addRef" @refresh-data-list="getDataList" />
		<update ref="updateRef" @refresh-data-list="getDataList" />
	</el-row>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import add from './add.vue'
import update from './update.vue'
import { fetchDeleteUrlList } from '@/api/social/greet'
import { ElMessage, ElMessageBox } from 'element-plus'
import { isArray } from 'xe-utils'

const addRef = ref<InstanceType<typeof add>>()
const updateRef = ref<InstanceType<typeof update>>()

// const queryRef = ref()
const languageList = [
	{ label: 'English', value: 'en' },
	{ label: '简体中文', value: 'zh' },
	{ label: 'Indonesia', value: 'in' },
	{ label: 'Português', value: 'pt' },
	{ label: 'ไทย', value: 'th' },
	{ label: 'Tiếng Việt', value: 'vi' },
	{ label: '繁體中文', value: 'tc' }
]
const state: IHooksOptions = reactive({
	dataListUrl: '/admin/social/greet/page',
	deleteUrl: '/admin/social/delete/greet',
	queryForm: {
		language: ''
	}
})
const onClickAdd = () => {
	addRef.value?.init()
}
const onClickUpdata = (row: any) => {
	updateRef.value?.init(row)
}
const onClickDelete = (id?: number) => {
	if (state.dataListLoading) {
		return
	}
	let data = ''
	if (typeof id === 'number') {
		data = id.toString()
	} else {
		data = state.dataListSelectionKeys?.length ? state.dataListSelectionKeys.join(',') : ''
		if (!data) {
			return ElMessage.warning('请选择要删除的数据')
		}
	}
	ElMessageBox.confirm('确定进行删除操作?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	})
		.then(() => {
			state.dataListLoading = true
			fetchDeleteUrlList(data)
				.then(res => {
					if (res) {
						ElMessage.success('删除成功')
						getDataList()
					}
				})
				.finally(() => {
					state.dataListLoading = false
				})
		})
		.catch(() => {})
}
const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>

<style scoped lang="scss">
body {
	margin: 0;
}
.example-showcase .el-loading-mask {
	z-index: 9;
}
</style>
