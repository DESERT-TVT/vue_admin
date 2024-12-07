<template>
	<el-row>
		<el-col :span="24">
			<el-card>
				<template #header>
					<div class="card-header">
						<span>用户充值记录</span>
					</div>
				</template>
				<el-table
					v-loading="state.dataListLoading"
					:data="state.dataList"
					border
					class="layout-table"
					show-overflow-tooltip
					height="50vh"
					@selection-change="selectionChangeHandle"
				>
					<el-table-column align="center" header-align="center" type="selection" width="38"></el-table-column>
					<el-table-column align="center" header-align="center" label="时间" prop="countDate"></el-table-column>
					<el-table-column align="center" header-align="center" label="购买VIP" prop="vipMoneyCount"></el-table-column>
					<el-table-column align="center" header-align="center" label="购买金币" prop="goldCoinsCount"></el-table-column>
					<el-table-column align="center" header-align="center" label="总计" prop="totalMoney"></el-table-column>
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

	<el-row>
		<el-col :span="24">
			<el-card>
				<template #header>
					<div class="card-header">
						<span>用户提现记录</span>
					</div>
				</template>
				<el-table
					v-loading="withdrawFrom.dataListLoading"
					:data="withdrawFrom.dataList"
					border
					class="layout-table"
					height="50vh"
					show-overflow-tooltip
				>
					<el-table-column align="center" header-align="center" type="selection" width="38"></el-table-column>
					<el-table-column align="center" header-align="center" label="时间" prop="countDate"></el-table-column>
					<el-table-column align="center" header-align="center" label="提现金额" prop="extractCount"></el-table-column>
				</el-table>
				<el-pagination
					:current-page="withdrawParams.page"
					:page-size="withdrawParams.limit"
					:page-sizes="[10, 20, 50, 100, 200]"
					:total="withdrawFrom.total"
					layout="total, sizes, prev, pager, next, jumper"
					@size-change="sizeWithdrawChangeHandle"
					@current-change="currentWithdrawChangeHandle"
				>
				</el-pagination>
			</el-card>
		</el-col>
	</el-row>
</template>

<script setup lang="ts">
import { IHooksOptions } from '@/hooks/interface'
import { reactive } from 'vue'
import { useCrud } from '@/hooks'
import { getWithdrawDetailsApi } from '@/api/user/activeStatistics'
const state: IHooksOptions = reactive({
	dataListUrl: '/admin/sys/user/users-recharge-details',
	queryForm: {
		userId: '',
		phoneOrEmail: ''
	}
})
const withdrawFrom = reactive({
	dataList: [],
	total: 0,
	dataListLoading: true,
	page: 1,
	limit: 10
})
const withdrawParams = reactive({
	page: 1,
	limit: 10
})
const getWithdrawDataList = () => {
	withdrawFrom.dataListLoading = true
	getWithdrawDetailsApi(withdrawParams).then((res: any) => {
		withdrawFrom.dataList = res.data.list
		withdrawFrom.total = res.data.total
		withdrawFrom.dataListLoading = false
	})
}
getWithdrawDataList()
const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, reset } = useCrud(state)

const sizeWithdrawChangeHandle = (limit: number) => {
	withdrawParams.limit = limit
	getWithdrawDataList()
}
const currentWithdrawChangeHandle = (page: number) => {
	withdrawParams.page = page
	getWithdrawDataList()
}
</script>

<style scoped lang="scss">
.el-row {
	margin-bottom: 20px;
}
</style>
