<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query">
				<el-form ref="queryRef" :inline="true" :model="state.queryForm">
					<el-form-item prop="userId">
						<el-input v-model="state.queryForm.userId" clearable placeholder="UID"></el-input>
					</el-form-item>

					<el-form-item prop="orderNo">
						<el-input v-model="state.queryForm.orderNo" clearable placeholder="订单号"></el-input>
					</el-form-item>

					<el-form-item prop="status">
						<fast-dict-select v-model="state.queryForm.status" clearable dict-type="order_status_type" placeholder="订单状态"></fast-dict-select>
					</el-form-item>

					<el-form-item prop="platform">
						<fast-dict-select v-model="state.queryForm.platform" clearable dict-type="platform_id" placeholder="渠道"></fast-dict-select>
					</el-form-item>

					<el-form-item prop="sourceType">
						<el-select v-model="state.queryForm.sourceType" clearable placeholder="订单类型">
							<el-option label="金币" value="1"></el-option>
							<el-option label="会员" value="2"></el-option>
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
					<el-col :span="2" :offset="22"> 总金额：{{ state.extend }} </el-col>
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
					<el-table-column type="selection" header-align="center" align="center" width="38"></el-table-column>
					<el-table-column prop="userId" label="UID" header-align="center" align="center"></el-table-column>
					<el-table-column prop="orderNo" label="订单号" header-align="center" align="center"></el-table-column>
					<el-table-column align="center" header-align="center" label="渠道" prop="platformName"></el-table-column>
					<el-table-column align="center" header-align="center" label="订单类型" prop="sourceType">
						<template #default="scope">
							<el-tag v-if="scope.row.sourceType == 1" type="primary">金币</el-tag>
							<el-tag v-if="scope.row.sourceType == 2" type="primary">会员</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="remarks" label="订单内容" header-align="center" align="center"></el-table-column>
					<el-table-column prop="payableAmount" label="订单金额" header-align="center" align="center"></el-table-column>
					<el-table-column prop="payAmount" label="支付金额" header-align="center" align="center"></el-table-column>
					<fast-dict-column dict-type="order_status_type" label="订单状态" prop="status"></fast-dict-column>
					<el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
					<el-table-column prop="updateTime" label="完成时间" header-align="center" align="center"></el-table-column>
					<el-table-column align="center" fixed="right" header-align="center" label="操作" width="120">
						<template #default="scope">
							<el-button v-if="scope.row.status == 0" link type="primary" @click="handFinishOrderHandle(scope.row.id)"> 手动完成 </el-button>
						</template>
					</el-table-column>
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
import { handFinishOrderApi } from '@/api/payment/order'
import { ElMessage } from 'element-plus'

const state: IHooksOptions = reactive({
	dataListUrl: '/admin/payment/order/list',
	createdIsNeed: true,
	queryForm: {
		orderNo: '',
		userId: '',
		sourceType: '',
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

const handFinishOrderHandle = (id: number) => {
	const params = {
		id: id
	}
	handFinishOrderApi(params).then(res => {
		ElMessage({
			message: '修改成功',
			type: 'success',
			plain: true
		})
		getDataList()
	})
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, reset } = useCrud(state)
</script>

<style scoped lang="scss"></style>
