<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query">
				<el-form ref="queryRef" :inline="true" :model="state.queryForm">
					<el-form-item prop="userId">
						<el-input v-model="state.queryForm.userId" placeholder="UID"></el-input>
					</el-form-item>
					<el-form-item prop="orderNo">
						<el-input v-model="state.queryForm.orderNo" clearable placeholder="订单号"></el-input>
					</el-form-item>

					<el-form-item prop="status">
						<fast-dict-select v-model="state.queryForm.status" dict-type="identification_status" clearable placeholder="提现状态"></fast-dict-select>
					</el-form-item>

					<el-form-item prop="type">
						<fast-dict-select v-model="state.queryForm.type" dict-type="withdraw_type" clearable placeholder="提现类型"></fast-dict-select>
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
						<el-button icon="Search" type="primary" @click="searchDataList">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button icon="RefreshRight" @click="reset(queryRef)">重置</el-button>
					</el-form-item>
				</el-form>
			</el-card>

			<!-- table -->
			<el-card>
				<el-row>
					<el-col :span="2" :offset="22"> 总金额：{{ state.extend }}</el-col>
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
					<el-table-column prop="exchangeNum" label="提现金额" header-align="center" align="center">
						<template #default="scope">
							<span>{{ scope.row.exchangeNum + scope.row.withdrawFee }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="exchangeNum" label="实际到账" header-align="center" align="center"></el-table-column>
					<el-table-column prop="withdrawFee" label="手续费" header-align="center" align="center"></el-table-column>
					<!--					<el-table-column prop="platform" label="渠道" header-align="center" align="center"></el-table-column>-->
					<el-table-column prop="status" label="状态" header-align="center" align="center">
						<template #default="scope">
							<el-tag v-if="scope.row.status === 0" type="warning">审核中</el-tag>
							<el-tag v-else-if="scope.row.status === 1" type="success">审核通过（提现中）</el-tag>
							<el-tag v-else-if="scope.row.status === -1" type="danger">拒绝</el-tag>
							<el-tag v-else-if="scope.row.status === 2" type="success">提现成功</el-tag>
							<el-tag v-else-if="scope.row.status === 3" type="danger">提现失败</el-tag>
							<!--							<span v-if="scope.row.status === 0">审核中</span>-->
							<!--							<span v-else-if="scope.row.status === 1">通过</span>-->
							<!--							<span v-else-if="scope.row.status === -1">拒绝</span>-->
						</template>
					</el-table-column>
					<el-table-column prop="type" label="类型" header-align="center" align="center">
						<template #default="scope">
							<span v-if="scope.row.type === 1">钻石换金币</span>
							<span v-else-if="scope.row.type === 2">钻石提现</span>
						</template>
					</el-table-column>
					<el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
					<el-table-column prop="doneTime" label="完成时间" header-align="center" align="center"></el-table-column>
					<el-table-column prop="updater" label="操作人" header-align="center" align="center"></el-table-column>
					<el-table-column label="操作" fixed="right" header-align="center" align="center" width="120">
						<template #default="scope">
							<div v-if="scope.row.status === 0" v-auth="'payment:withdraw:check'">
								<el-popconfirm
									title="是否同意这笔提现"
									confirm-button-text="通过"
									cancel-button-text="拒绝"
									cancel-button-type="danger"
									@confirm="submitForm(1, scope.row.id)"
									@cancel="auditHandle(scope.row)"
								>
									<template #reference>
										<el-button type="primary"> 审核 </el-button>
									</template>
								</el-popconfirm>
							</div>
							<!--							<el-button  type="primary" @click="auditHandle(scope.row)">-->
							<!--								审核-->
							<!--							</el-button>-->
							<span v-else>已审核</span>
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
	<!-- 审核 -->
	<el-dialog v-model="auditDialogVisible" title="拒绝原因" width="500" center>
		<el-form :model="auditForm" label-width="auto" style="max-width: 600px">
			<el-form-item label="拒绝原因">
				<el-input v-model="auditForm.refuseReason" type="textarea" />
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<!--				<el-button type="success" @click="submitForm(1)">同意</el-button>-->
				<el-button type="danger" @click="submitForm(-1)">拒绝</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import { ElLoading, ElMessage } from 'element-plus'
import { accessUserWithDraw } from '@/api/payment/withdraw'

const auditDialogVisible = ref(false)
const dateTimeValue = ref('')

const queryRef = ref()

const state: IHooksOptions = reactive({
	dataListUrl: '/admin/payment/withdraw/list',
	queryForm: {
		userId: '',
		orderNo: '',
		status: '',
		startDate: '',
		endDate: '',
		type: ''
	}
})

const auditForm = reactive({
	id: '',
	userId: '',
	refuseReason: '',
	type: 0,
	status: ''
})
const submitForm = (status: number, id?: any) => {
	if (id) {
		auditForm.id = id
	}
	if (status == -1 && auditForm.refuseReason == '') {
		ElMessage({
			message: '拒绝原因不能为空',
			type: 'error',
			plain: true
		})
		return
	}
	const loading = ElLoading.service({
		lock: true,
		text: '正在处理审核，请稍等',
		background: 'rgba(0, 0, 0, 0.7)'
	})

	auditForm.status = status.toString()
	accessUserWithDraw(auditForm)
		.then(() => {
			ElMessage({
				message: '审核成功！',
				type: 'success',
				plain: true
			})
			auditDialogVisible.value = false
			getDataList()
		})
		.catch(() => {
			ElMessage({
				message: '审核失败',
				type: 'error',
				plain: true
			})
		})
		.finally(() => {
			loading.close()
			auditForm.refuseReason = ''
		})
}
const searchDataList = () => {
	if (dateTimeValue.value) {
		state.queryForm.startDate = dateTimeValue.value[0]
		state.queryForm.endDate = dateTimeValue.value[1]
	}
	getDataList()
}

const auditHandle = (row: any) => {
	auditForm.id = row.id
	auditDialogVisible.value = true
}
const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, reset } = useCrud(state)
</script>

<style scoped lang="scss"></style>
