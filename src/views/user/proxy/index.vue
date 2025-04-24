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
				<el-table-column label="操作" fixed="right" header-align="center" align="center" min-width="300">
					<template #default="scope">
						<el-button v-auth="'proxy:user:edit'" type="primary" link @click="showAddProxy(scope.row)">修改</el-button>
						<el-button v-auth="'proxy:user:income'" type="primary" link @click="onShowProxyIncome(scope.row)">代理收益</el-button>
						<el-button v-auth="'proxy:user:income'" type="primary" link @click="onShowOnlineInfo(scope.row)">主播数据</el-button>
						<el-button v-auth="'proxy:user:income'" type="primary" link @click="onShowProxyInfo(scope.row)">代理数据</el-button>
						<el-button v-auth="'proxy:user:income'" type="primary" link @click="onShowUserInfo(scope.row)">代理用户数据</el-button>
						<el-button v-auth="'proxy:user:income'" type="primary" link @click="onShowOnlineList(scope.row)">主播列表</el-button>
						<el-button v-auth="'proxy:user:income'" type="primary" link @click="onShowIncomePage(scope.row)">推广收益列表</el-button>
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
	<AddFirstProxy ref="addFirstProxyRef" @refresh-list="getDataList" />
	<ProxyIncome ref="proxyIncomeRef" />
	<ProxyInfo ref="proxyInfoRef" />
	<OnlineInfo ref="onlineInfoRef" />
	<UserInfo ref="userInfoRef" />
	<OnlineList ref="onlineListRef" />
	<IncomePage ref="incomePageRef" />
</template>
<script lang="ts" setup>
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { computed, reactive, ref } from 'vue'
import AddFirstProxy from './AddFirstProxy.vue'
import { fetchProxyList, ProxyAddReq, ProxyListData } from '@/api/user/proxy'
import { TreeNode } from 'element-plus'
import ProxyIncome from './ProxyIncome.vue'
import ProxyInfo from './ProxyInfo.vue'
import OnlineInfo from './OnlineInfo.vue'
import UserInfo from './UserInfo.vue'
import OnlineList from './OnlineList.vue'
import IncomePage from './IncomePage.vue'
const state: IHooksOptions = reactive({
	dataListUrl: '/admin/proxy/list/leve1',
	createdIsNeed: false,
	limit: 100,
	queryForm: {}
})
const addFirstProxyRef = ref<InstanceType<typeof AddFirstProxy>>()
const proxyIncomeRef = ref<InstanceType<typeof ProxyIncome>>()
const proxyInfoRef = ref<InstanceType<typeof ProxyInfo>>()
const onlineInfoRef = ref<InstanceType<typeof OnlineInfo>>()
const userInfoRef = ref<InstanceType<typeof UserInfo>>()
const onlineListRef = ref<InstanceType<typeof OnlineList>>()
const incomePageRef = ref<InstanceType<typeof IncomePage>>()
const showAddProxy = (row?: ProxyAddReq) => {
	addFirstProxyRef.value?.init(row)
}
// const UpdateHandle = (row: ProxyAddReq) => {
// 	addFirstProxyRef.value?.init(row)
// }
const onShowProxyIncome = (row: ProxyAddReq) => {
	proxyIncomeRef.value?.init(row)
}
const onShowProxyInfo = (row: ProxyAddReq) => {
	proxyInfoRef.value?.init(row)
}
const onShowOnlineInfo = (row: ProxyAddReq) => {
	onlineInfoRef.value?.init(row)
}
const onShowUserInfo = (row: ProxyAddReq) => {
	userInfoRef.value?.init(row)
}
const onShowOnlineList = (row: ProxyAddReq) => {
	onlineListRef.value?.init(row.userId)
}
const onShowIncomePage = (row: ProxyAddReq) => {
	incomePageRef.value?.init(row.userId)
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
