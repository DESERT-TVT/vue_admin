<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query">
				<el-form ref="queryRef" :inline="true" :model="state.queryForm">
					<el-form-item prop="userIds">
						<el-input v-model="state.queryForm.userIds" clearable placeholder="关联用户"></el-input>
					</el-form-item>
					<el-form-item prop="userIds">
						<el-input v-model="state.queryForm.riskContent" clearable placeholder="风险内容"></el-input>
					</el-form-item>
					<el-form-item prop="riskType">
						<fast-dict-select v-model="state.queryForm.riskType" clearable dict-type="riskTips_riskType" placeholder="处罚内容"></fast-dict-select>
					</el-form-item>

					<el-form-item>
						<el-date-picker
							v-model="dateTimeValue"
							date-format="YYYY-MM-DD"
							end-placeholder="End date"
							format="YYYY-MM-DD HH:mm:ss"
							start-placeholder="Start date"
							time-format="HH:mm:ss"
							type="datetimerange"
							value-format="YYYY-MM-DD HH:mm:ss"
						/>
					</el-form-item>

					<el-form-item>
						<el-button icon="Search" type="primary" @click="searchDataList()">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button icon="RefreshRight" @click="reset(queryRef)">重置</el-button>
					</el-form-item>
				</el-form>
			</el-card>
			<el-card>
				<el-table
					v-loading="state.dataListLoading"
					:data="state.dataList"
					border
					class="layout-table"
					show-overflow-tooltip
					height="70vh"
					@selection-change="selectionChangeHandle"
				>
					<el-table-column align="center" header-align="center" type="selection" width="38"></el-table-column>
					<el-table-column align="center" header-align="center" label="关联用户" prop="userIds"></el-table-column>
					<fast-dict-column dict-type="riskTips_riskType" label="风险类型" prop="riskType"></fast-dict-column>
					<el-table-column align="center" header-align="center" label="风险内容" prop="riskContent"></el-table-column>
					<el-table-column align="center" header-align="center" label="提示时间" prop="createTime"></el-table-column>
					<el-table-column align="center" header-align="center" label="操作人" prop="updater"></el-table-column>
					<el-table-column align="center" header-align="center" label="状态" prop="status">
						<template #default="scope">
							<el-tag v-if="scope.row.status == 1" type="success">已处理</el-tag>
							<el-tag v-else type="danger">未处理</el-tag>
						</template>
					</el-table-column>
					<el-table-column align="center" fixed="right" header-align="center" label="操作" width="120">
						<template #default="scope">
							<el-button v-if="scope.row.status == 0" v-auth="'riskcontrol:risktisp:edit'" link type="primary" @click="handleRiskTipsClick(scope.row)"
								>处理
							</el-button>
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
		</el-col>
	</el-row>

	<el-dialog v-model="dialogVisible" :show-close="false" center title="举报处理" width="400px">
		<el-form :model="submitForm" label-width="100px">
			<el-form-item label="处罚类型">
				<fast-dict-select v-model="submitForm.type" clearable dict-type="risk_control_punish_type" placeholder="处罚类型"></fast-dict-select>
			</el-form-item>
			<el-form-item label="处罚天数">
				<el-input-number v-model="submitForm.duration" :min="0" :step="1" />
			</el-form-item>
			<el-form-item label="处罚提示内容">
				<el-input v-model="submitForm.remark" placeholder="处罚提示内容"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button type="primary" @click="handleRiskTips"> 提交</el-button>
				<el-button @click="cancelHandle">取消</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { handleRiskTipsApi } from '@/api/riskControl/riskTisp'
import { ElMessage } from 'element-plus'

const state: IHooksOptions = reactive({
	dataListUrl: '/admin/sys/user/risk-tips',
	createdIsNeed: true,
	queryForm: {
		userIds: '',
		status: '',
		riskContent: '',
		targetUserId: '',
		riskType: '',
		startDate: '',
		endDate: ''
	}
})

const submitForm = reactive({
	id: '',
	type: '',
	duration: 0,
	userIds: '',
	remark: ''
})

const cancelHandle = () => {
	dialogVisible.value = false
	submitForm.id = ''
	submitForm.type = ''
	submitForm.duration = 0
	submitForm.userIds = ''
}

const dialogVisible = ref(false)

const dateTimeValue = ref('')
const queryRef = ref()

const handleRiskTipsClick = (row: any) => {
	dialogVisible.value = true
	submitForm.id = row.id
	submitForm.userIds = row.userIds
}

const handleRiskTips = (row: any) => {
	handleRiskTipsApi(submitForm)
		.then(res => {
			ElMessage({
				message: '处理成功',
				type: 'success',
				plain: true
			})
			dialogVisible.value = false
			getDataList()
		})
		.catch(() => {
			ElMessage({
				message: '处理失败',
				type: 'error',
				plain: true
			})
			dialogVisible.value = false
		})
}

const searchDataList = () => {
	if (dateTimeValue.value) {
		state.queryForm.startDate = dateTimeValue.value[0]
		state.queryForm.endDate = dateTimeValue.value[1]
	}
	getDataList()
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, reset } = useCrud(state)
</script>

<style lang="scss" scoped></style>
