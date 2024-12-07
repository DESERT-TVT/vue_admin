<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query">
				<el-form ref="queryRef" :inline="true" :model="state.queryForm">
					<el-form-item prop="userId">
						<el-input v-model="state.queryForm.userId" clearable placeholder="赠送人UID"></el-input>
					</el-form-item>

					<el-form-item prop="toUserId">
						<el-input v-model="state.queryForm.toUserId" clearable placeholder="接收人UID"></el-input>
					</el-form-item>

					<!--					<el-form-item prop="status">-->
					<!--						<el-select v-model="state.queryForm.status" placeholder="状态" clearable>-->
					<!--							<el-option label="已结算" value="2"></el-option>-->
					<!--							<el-option label="未结算" value="1"></el-option>-->
					<!--							<el-option label="退单" value="-1"></el-option>-->
					<!--						</el-select>-->
					<!--					</el-form-item>-->

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
					<el-col :offset="21" :span="3"> 总金额：{{ state.extend ? state.extend + ' 金币' : '0' + ' 金币' }} </el-col>
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
					<el-table-column prop="id" label="订单号" header-align="center" align="center"></el-table-column>
					<el-table-column prop="userId" label="赠送人UID" header-align="center" align="center"></el-table-column>
					<el-table-column prop="giftContent" label="礼物内容" header-align="center" align="center"></el-table-column>
					<el-table-column prop="giftValue" label="礼物价值" header-align="center" align="center">
						<template #default="scope">
							<span>{{ scope.row.giftValue * scope.row.giftNum }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="toUserId" label="接收人UID" header-align="center" align="center"></el-table-column>
					<el-table-column prop="createTime" label="打赏时间" header-align="center" align="center"></el-table-column>
					<!--					<el-table-column align="center" header-align="center" label="状态" prop="status">-->
					<!--						<template #default="scope">-->
					<!--							<el-tag v-if="scope.row.status == 1" type="success">未结算</el-tag>-->
					<!--							<el-tag v-if="scope.row.status == 2" type="success">已结算</el-tag>-->
					<!--							<el-tag v-if="scope.row.status == -1" type="danger">退单</el-tag>-->
					<!--						</template>-->
					<!--					</el-table-column>-->
					<el-table-column prop="updaterName" label="操作人" header-align="center" align="center"></el-table-column>
					<!--					<el-table-column label="操作" fixed="right" header-align="center" align="center" width="120">-->
					<!--						<template #default="scope">-->
					<!--							<el-popconfirm-->
					<!--								confirm-button-text="确认"-->
					<!--								cancel-button-text="取消"-->
					<!--								confirm-button-type="text"-->
					<!--								cancel-button-type="text"-->
					<!--								icon-color="#E6A23C"-->
					<!--								title="确认退还吗?"-->
					<!--								@confirm="returnHandle(scope.row.id)"-->
					<!--							>-->
					<!--								<template #reference>-->
					<!--									<el-button v-if="isPastToday(scope.row.createTime) && scope.row.status == 1" link type="primary"> 退还 </el-button>-->
					<!--								</template>-->
					<!--							</el-popconfirm>-->
					<!--						</template>-->
					<!--					</el-table-column>-->
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
import { returnHandleApi } from '@/api/payment/giftTipping'
import { ElMessage } from 'element-plus'

const state: IHooksOptions = reactive({
	dataListUrl: '/admin/payment/gift-tipping/list',
	createdIsNeed: true,
	queryForm: {
		toUserId: '',
		userId: '',
		startDate: '',
		endDate: '',
		status: ''
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

const returnHandle = (id: number) => {
	let dataForm = {
		id: id
	}
	returnHandleApi(dataForm)
		.then(res => {
			ElMessage({
				message: '退单成功',
				type: 'success',
				plain: true
			})
			getDataList()
		})
		.catch(() => {
			ElMessage({
				message: '退单失败',
				type: 'error',
				plain: true
			})
		})
}

// 判断时间是否已过今天的函数
const isPastToday = (dateTimeString: string): boolean => {
	const targetDate = new Date(dateTimeString)
	if (isNaN(targetDate.getTime())) {
		return false
	}
	const todayStart = new Date() // 获取今天开始日期
	todayStart.setHours(0, 0, 0, 0) // 设置时间为今天0:0:0

	const todayEnd = new Date() // 获取今天结束日期
	todayEnd.setHours(23, 59, 59, 999) // 设置时间为今天23:59:59

	return targetDate >= todayStart && targetDate <= todayEnd
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, reset } = useCrud(state)
</script>

<style scoped lang="scss"></style>
