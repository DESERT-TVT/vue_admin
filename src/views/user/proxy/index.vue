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
				:data="state.dataList"
				style="width: 100%"
				row-key="id"
				border
				lazy
				:load="load"
				:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
			>
				<el-table-column prop="userId" label="代理等级" />
				<!-- <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
					<template #default="scope">
						<el-button v-auth="'sys:menu:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">设置代理</el-button>
					</template>
				</el-table-column> -->
			</el-table>
		</el-form>
	</el-card>
	<AddFirstProxy ref="addFirstProxyRef" />
</template>
<script lang="ts" setup>
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { reactive, ref } from 'vue'
import AddFirstProxy from './AddFirstProxy.vue'
const state: IHooksOptions = reactive({
	dataListUrl: '',
	createdIsNeed: false,
	queryForm: {}
})
const addFirstProxyRef = ref<InstanceType<typeof AddFirstProxy>>()
const showAddProxy = () => {
	addFirstProxyRef.value?.init()
}
const load = () => {}
const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, reset } = useCrud(state)
</script>
<style lang="scss" scoped></style>
