<template>
	<!-- 分享主播弹窗 -->
	<el-dialog v-model="visible" size="40%" title="用户迁移">
		<div style="display: flex; justify-content: start; margin-bottom: 20px">
			<el-select v-model="siteId" clearable placeholder="将用户迁移至" style="width: 200px">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
			</el-select>
		</div>
		<el-input v-model="state.queryForm.search" placeholder="请输入要迁移的的UID" style="width: 200px" />
		<el-button style="margin-left: 20px" type="primary" @click="getDataList">查询</el-button>
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
			<el-table-column align="center" header-align="center" label="名称" prop="nickname"></el-table-column>
			<el-table-column align="center" header-align="center" label="当前归属站点" prop="orgName"></el-table-column>
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
		<template #footer>
			<div style="margin-top: 20px; display: flex; justify-content: end">
				<el-button @click="handleDrawerClose">取消</el-button>
				<el-button v-auth="'sys:share:user:add'" :disabled="!siteId" type="primary" @click="confirm">确定</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { APIGetSiteList, APIMigrateUser, APISaveShareOnline } from '@/api/site/site'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import { ElLoading, ElMessage } from 'element-plus'

const options = ref<any>([])
const emit = defineEmits(['refreshDataList', 'getDataList'])
const availableUsers = ref([])
const visible = ref(false)
const siteId = ref<number>()
const state: IHooksOptions = reactive({
	dataListUrl: '/admin/sys/user/site/online/able/share',
	queryForm: {
		search: ''
	}
})
const handleDrawerClose = () => {
	visible.value = false
}
const init = () => {
	getDataList()
	visible.value = true
	siteId.value = undefined
	APIGetSiteList().then((resp: any) => {
		if (resp.code === 0) {
			const datas = []
			resp.data.map((item: any) => {
				datas.push({
					value: item.id,
					label: item.siteName
				})
			})
			options.value = datas
		}
	})
}

const confirm = () => {
	availableUsers.value = state.dataListSelectionKeys
	const loading = ElLoading.service({
		lock: true,
		text: '正在迁移用户',
		background: 'rgba(0, 0, 0, 0.7)'
	})
	const params = {
		userIds: availableUsers.value,
		toSiteId: siteId.value
	}
	APIMigrateUser(params)
		.then((resp: any) => {
			if (resp.code === 0) {
				ElMessage({
					message: '迁移成功',
					type: 'success',
					duration: 1000
				})
			}
		})
		.finally(() => {
			emit('getDataList')
			loading.close()
			handleDrawerClose()
		})
}
const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle } = useCrud(state)
defineExpose({
	init
})
</script>
