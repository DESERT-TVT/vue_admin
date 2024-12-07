<template>
	<el-card>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table" show-overflow-tooltip>
			<el-table-column align="center" header-align="center" label="类型" prop="sourceType">
				<template #default="scope">
					<el-tag v-if="scope.row.type === 1" type="warning">充值金币</el-tag>
					<el-tag v-else-if="scope.row.type === 2" type="danger">充值VIP</el-tag>
					<el-tag v-else type="success">收益</el-tag>
				</template>
			</el-table-column>
			<el-table-column align="center" header-align="center" label="层级" prop="tier">
				<template #default="scope">
					<el-tag v-if="scope.row.tier === 1" type="primary">一级分成</el-tag>
					<el-tag v-else-if="scope.row.tier === 2" type="primary">二级分成</el-tag>
					<el-tag v-else type="primary">三级分成</el-tag>
				</template>
			</el-table-column>
			<el-table-column align="center" header-align="center" label="是否为公会" prop="advanced">
				<template #default="scope">
					<el-tag v-if="scope.row.advanced === 0" type="danger">否</el-tag>
					<el-tag v-else type="success">是</el-tag>
				</template>
			</el-table-column>
			<el-table-column align="center" header-align="center" label="充值分成比例">
				<template v-slot="{ row, rowIndex }">
					<el-input-number v-model="row.rate" :max="100" :min="0" style="max-width: 200px" @change="handleChange(row)" />
					<!--					<el-input-->
					<!--						placeholder="请输入充值分成比例"-->
					<!--						@blur="saveEdit(row)"-->
					<!--						@keyup.enter="saveEdit(row)"-->
					<!--					>-->
					<!--						<template #append>%</template>-->
					<!--					</el-input>-->
				</template>
			</el-table-column>
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
	</el-card>
</template>

<script lang="ts" setup>
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { APIRechargeConfigEdit } from '@/api/config/setting'
import { ElMessage } from 'element-plus'

const state: IHooksOptions = reactive({
	dataListUrl: '/admin/config/recharge/bonus',
	queryForm: {
		payType: '',
		name: ''
	}
})
const handleChange = (row: any) => {
	if (!row.rate) {
		row.rate = 0
	}
	// 在这里可以添加保存逻辑
	APIRechargeConfigEdit(row)
		.then(res => {
			ElMessage.success({
				message: '修改成功',
				duration: 1000
			})
		})
		.catch(err => {
			ElMessage.error({
				message: '修改失败',
				duration: 500
			})
		})
}

const { sizeChangeHandle, currentChangeHandle } = useCrud(state)
</script>

<style scoped>
:deep(.el-input__inner) {
	text-align: center; /* 居中文本 */
}
</style>
