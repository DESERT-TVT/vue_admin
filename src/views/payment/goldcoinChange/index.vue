<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query">
				<el-form ref="queryRef" :inline="true" :model="state.queryForm">
					<el-form-item prop="userId">
						<el-input v-model="state.queryForm.userId" clearable placeholder="UID"></el-input>
					</el-form-item>

					<el-form-item prop="recordType">
						<fast-dict-select v-model="state.queryForm.recordType" clearable dict-type="gold_coins_record_type" placeholder="变更类型">
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
				<el-row>
					<el-col :offset="19" :span="5">
						总收入：{{ state.extend ? state.extend.incomeCount + ' 金币' : '0' + ' 金币' }}&nbsp;&nbsp;总支出：{{
							state.extend ? Math.abs(state.extend.payCount) + ' 金币' : '0' + ' 金币'
						}}
					</el-col>
				</el-row>
				<el-table
					v-loading="state.dataListLoading"
					:data="state.dataList"
					border
					class="layout-table"
					show-overflow-tooltip
					height="70vh"
					@selection-change="selectionChangeHandle"
				>
					<el-table-column align="center" header-align="center" label="UID" prop="userId"></el-table-column>
					<el-table-column align="center" header-align="center" label="订单号" prop="id"></el-table-column>
					<fast-dict-column dict-type="gold_coins_record_type" label="变动类型" prop="recordType"></fast-dict-column>
					<el-table-column align="center" header-align="center" label="变动数额" prop="goldCoinsNum">
						<template #default="scope">
							<el-tag :type="scope.row.goldCoinsNum > 0 ? 'success' : 'danger'">{{ scope.row.goldCoinsNum }}</el-tag>
						</template>
					</el-table-column>
					<el-table-column align="center" header-align="center" label="余额" prop="goldCoinsBalance"></el-table-column>
					<el-table-column align="center" header-align="center" label="接收人" prop="toUser"></el-table-column>
					<!--					<el-table-column align="center" header-align="center" label="操作人" prop="updater"></el-table-column>-->
					<el-table-column align="center" header-align="center" label="变动时间" prop="createTime"></el-table-column>
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
		walletType: '1',
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

<style lang="scss" scoped></style>
