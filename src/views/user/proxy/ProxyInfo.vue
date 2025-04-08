<template>
	<el-dialog v-model="visible" title="代理数据" :close-on-click-modal="false" draggable>
		<el-form :inline="true" :model="queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-date-picker v-model="queryForm.begin" type="date" placeholder="选择开始时间" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
			</el-form-item>
			<el-form-item>
				<el-date-picker v-model="queryForm.end" type="date" placeholder="选择结束时间" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
			</el-form-item>
			<el-form-item>
				<fetctButton v-auth="'proxy:user:add'" :submit-handle="getDataList">查询</fetctButton>
			</el-form-item>
		</el-form>
		<el-descriptions :title="'用户Id：' + queryForm.userId" direction="vertical" :column="4" size="default" border>
			<el-descriptions-item label="一级代理数据">{{ dataForm.oneLevelNumber }}</el-descriptions-item>
			<el-descriptions-item label="一级代理代理收益">{{ dataForm.oneLevelIncome }}</el-descriptions-item>
			<el-descriptions-item label="二级代理数据">{{ dataForm.twoLevelNumber }}</el-descriptions-item>
			<el-descriptions-item label="二级代理收益">{{ dataForm.twoLevelIncome }}</el-descriptions-item>
		</el-descriptions>
	</el-dialog>
</template>

<script lang="ts" setup>
import { fetchProxyInfo, ProxyIncomeReq } from '@/api/user/proxy'
import { reactive, ref } from 'vue'
import dayjs from 'dayjs'
import fetctButton from '@/components/fetct-button/index.vue'

const visible = ref(false)
const queryForm = reactive<ProxyIncomeReq>({
	userId: '',
	begin: dayjs().format('YYYY-MM-DD'),
	end: dayjs().format('YYYY-MM-DD')
})

const dataForm = reactive({
	oneLevelNumber: 0,
	oneLevelIncome: 0,
	twoLevelNumber: 0,
	twoLevelIncome: 0
})

const init = (row: any) => {
	visible.value = true
	queryForm.begin = dayjs().format('YYYY-MM-DD')
	queryForm.end = dayjs().format('YYYY-MM-DD')
	queryForm.userId = row.userId
	getDataList()
}
const getDataList = async () => {
	const res = await fetchProxyInfo(queryForm)
	Object.assign(dataForm, res.data)
}
defineExpose({
	init
})
</script>
