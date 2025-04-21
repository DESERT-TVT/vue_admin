<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query">
				<el-form ref="queryRef" :inline="true" :model="state.queryForm">
					<el-form-item prop="userId">
						<el-input v-model="state.queryForm.userId" clearable placeholder="UID"></el-input>
					</el-form-item>

					<el-form-item prop="recordType">
						<fast-dict-select v-model="state.queryForm.recordType" clearable dict-type="integral_record_type" placeholder="变更类型">
						</fast-dict-select>
					</el-form-item>

					<el-form-item prop="incomeOrPay">
						<el-select v-model="state.queryForm.incomeOrPay" clearable placeholder="收入/支出">
							<el-option label="收入" value="1"></el-option>
							<el-option label="支出" value="2"></el-option>
						</el-select>
					</el-form-item>

					<el-form-item>
						<el-date-picker
							v-model="dateTimeValue"
							type="datetimerange"
							start-placeholder="Start date"
							end-placeholder="End date"
							format="YYYY-MM-DD HH:mm:ss"
							date-format="YYYY-MM-DD"
							time-format="HH:mm:ss"
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
				<el-row>
					<el-col :offset="19" :span="5">
						总收入：{{ state.extend ? state.extend.incomeCount + ' 积分' : '0' + ' 积分' }}&nbsp;&nbsp;总支出：{{
							state.extend ? Math.abs(state.extend.payCount) + ' 积分' : '0' + ' 积分'
						}}
					</el-col>
				</el-row>
				<el-table
					v-loading="state.dataListLoading"
					show-overflow-tooltip
					:data="state.dataList"
					border
					class="layout-table"
					height="70vh"
					@selection-change="selectionChangeHandle"
				>
					<el-table-column prop="userId" label="UID" header-align="center" align="center"></el-table-column>
					<el-table-column prop="id" label="订单号" header-align="center" align="center"></el-table-column>
					<fast-dict-column dict-type="integral_record_type" label="变动类型" prop="recordType"></fast-dict-column>
					<el-table-column prop="goldCoinsNum" label="变动数额" header-align="center" align="center">
						<template #default="scope">
							<el-tag :type="scope.row.goldCoinsNum > 0 ? 'success' : 'danger'">{{ scope.row.goldCoinsNum }}</el-tag>
						</template>
					</el-table-column>
					<el-table-column align="center" header-align="center" label="余额" prop="goldCoinsBalance"></el-table-column>
					<!--					<el-table-column align="center" header-align="center" label="状态" prop="status">-->
					<!--						<template #default="scope">-->
					<!--							<el-tag type="success">已结算</el-tag>-->
					<!--						</template>-->
					<!--					</el-table-column>-->
					<el-table-column align="center" header-align="center" label="操作人" prop="updater"></el-table-column>
					<el-table-column prop="createTime" label="变动时间" header-align="center" align="center"></el-table-column>
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
	</el-row>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'

const state: IHooksOptions = reactive({
	dataListUrl: '/admin/payment/gold-integral/record/list',
	createdIsNeed: true,
	queryForm: {
		orderNo: '',
		userId: '',
		startDate: '',
		endDate: '',
		walletType: '2',
		recordType: '',
		incomeOrPay: ''
	}
})

const dateTimeValue = ref('')
const queryRef = ref()

const searchDataList = () => {
	if (dateTimeValue.value) {
		state.queryForm.startDate = dateTimeValue.value[0]
		state.queryForm.endDate = dateTimeValue.value[1]
	}
	getDataList()
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, reset } = useCrud(state)
</script>

<style scoped lang="scss"></style>
