<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm">
			<el-form-item>
				<!-- <el-input v-model="state.queryForm.search" placeholder="请输入用户Id" clearable style="width: 215px"></el-input> -->
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="showAddProxy">设置一级代理</el-button>
				<el-button @click="getDataList()">{{ $t('query') }}</el-button>
			</el-form-item>
			<el-table
				v-loading="state.dataListLoading"
				:data="dataList"
				style="width: 100%"
				row-key="userId"
				border
				lazy
				:load="load"
				:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
			>
				<el-table-column prop="userId" label="代理等级" />
				<el-table-column prop="cosRate" label="代理消费分成" />
				<el-table-column prop="inRate" label="代理收益分成" />
				<el-table-column prop="onlineRate" label="下级主播直接分成" />
				<!-- <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
					<template #default="scope">
						<el-button v-auth="'sys:menu:update'" type="primary" link @click="UpdateHandle(scope.row)">修改</el-button>
					</template>
				</el-table-column> -->
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
	<AddFirstProxy ref="addFirstProxyRef" />
</template>
<script lang="ts" setup>
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { computed, reactive, ref } from 'vue'
import AddFirstProxy from './AddFirstProxy.vue'
import { fetchProxyList, ProxyAddReq, ProxyListData } from '@/api/user/proxy'
import { TreeNode } from 'element-plus'
const state: IHooksOptions = reactive({
	dataListUrl: '/admin/proxy/list/leve1',
	createdIsNeed: false,
	limit: 100,
	queryForm: {}
})
const addFirstProxyRef = ref<InstanceType<typeof AddFirstProxy>>()
const showAddProxy = () => {
	addFirstProxyRef.value?.init()
}
const UpdateHandle = (row: ProxyAddReq) => {
	addFirstProxyRef.value?.init(row)
}
const dataList = computed(() => {
	if (state.dataList) {
		return state.dataList.map((item: ProxyListData) => {
			return { ...item, hasChildren: true }
		})
	} else {
		return []
	}
})
//生成随机数五位
function generateRandomFiveDigitNumber() {
	const min = 10000
	const max = 99999
	return Math.floor(Math.random() * (max - min + 1)) + min
}
const load = (row: ProxyAddReq, treeNode: TreeNode, resolve: (data: ProxyListData[]) => void) => {
	fetchProxyList(row.userId)
		.then(res => {
			if (res.data.list) {
				const data = res.data.list.map((item: ProxyListData) => {
					return { ...item, hasChildren: true }
				})
				resolve(data)
			} else {
				resolve([])
			}
		})
		.catch(err => {
			resolve([])
		})
}
const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, reset } = useCrud(state)
</script>
<style lang="scss" scoped></style>
