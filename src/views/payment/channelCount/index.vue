<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query">
				<el-form ref="queryRef" :inline="true" :model="state.queryForm">
					<el-form-item prop="status">
						<fast-dict-select v-model="state.queryForm.type" clearable dict-type="identification_status" placeholder="渠道类型"></fast-dict-select>
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
					height="70vh"
					show-overflow-tooltip
					@selection-change="selectionChangeHandle"
				>
					<el-table-column align="center" header-align="center" label="渠道名称" prop="sourceType"></el-table-column>
					<el-table-column align="center" header-align="center" label="渠道类型" prop="remarks"></el-table-column>
					<el-table-column align="center" header-align="center" label="累计代收" prop="payableAmount"></el-table-column>
					<el-table-column align="center" header-align="center" label="累计代付" prop="payAmount"></el-table-column>
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

<script lang="ts" setup>
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'

const state: IHooksOptions = reactive({
	dataListUrl: '/admin/payment/order/list',
	createdIsNeed: true,
	queryForm: {
		orderNo: '',
		userId: '',
		type: '',
		status: '',
		startDate: '',
		endDate: '',
		platform: ''
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
