<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query">
				<el-form ref="queryRef" :inline="true" :model="state.queryForm">
					<el-form-item prop="userId">
						<el-input v-model="state.queryForm.userId" clearable placeholder="UID"></el-input>
					</el-form-item>

					<el-form-item prop="phoneOrEmail">
						<el-input v-model="state.queryForm.phoneOrEmail" clearable placeholder="手机号/邮箱"></el-input>
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
				<!--        <el-row>-->
				<!--          <el-col :span="4" :offset="20">-->
				<!--						总收入：{{ state.extend ? state.extend.incomeCount+" 金币" : "0" + ' 金币' }}&nbsp;&nbsp;总支出：{{ state.extend ? Math.abs(state.extend.payCount)+" 金币" : "0" + ' 金币' }}-->
				<!--          </el-col>-->
				<!--        </el-row>-->
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
					<el-table-column align="center" header-align="center" label="UID&昵称">
						<template #default="scope">
							<div>
								<span class="layout-table-span">{{ scope.row.userId }}</span
								><br />
								<span class="layout-table-span">{{ scope.row.nickname }}</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column align="center" header-align="center" label="vip到期时间" prop="vipExpireTime"></el-table-column>
					<el-table-column prop="goldCoins" label="金币余额" header-align="center" align="center">
						<template #default="scope">
							<el-tag type="warning">{{ scope.row.goldCoins }}</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="integral" label="钻石余额" header-align="center" align="center">
						<template #default="scope">
							<el-tag type="success">{{ scope.row.integral }}</el-tag>
						</template>
					</el-table-column>
					<!--					<el-table-column align="center" header-align="center" label="注册免费文字聊天条数" prop="freeTextChatNum"></el-table-column>-->
					<el-table-column align="center" header-align="center" label="vip免费文字聊天条数" prop="freeTextChatNum"></el-table-column>
					<el-table-column prop="freeVoiceChatNum" label="免费语音通话时长" header-align="center" align="center"></el-table-column>
					<el-table-column prop="freeVideoChatNum" label="免费视频通话时长" header-align="center" align="center"></el-table-column>
					<el-table-column label="操作" fixed="right" header-align="center" align="center" width="120">
						<template #default="scope">
							<el-button link type="primary" @click="giftsOrDeductionsHandle(scope.row)">赠送/扣减</el-button>
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

	<el-dialog v-model="dialogVisible" :show-close="false" center title="赠送/扣减" width="550px">
		<el-form :model="addOrUpdateForm" label-width="320px">
			<el-form-item label="赠送/扣除金币（正数为赠送，负数为扣除）">
				<el-input-number v-model="addOrUpdateForm.goldCoins" :precision="2" :step="0.1" />
			</el-form-item>
			<el-form-item label="赠送/扣除钻石（正数为赠送，负数为扣除）">
				<el-input-number v-model="addOrUpdateForm.integral" :precision="2" :step="0.1" />
			</el-form-item>
			<el-form-item label="赠送/扣除Vip天数（正数为赠送，负数为扣除）">
				<el-input-number v-model="addOrUpdateForm.vipDate" :step="1" />
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button type="primary" @click="submitForm"> 提交 </el-button>
				<el-button @click="cancelHandle">取消</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { updateWalletApi } from '@/api/payment/wallet'
import { ElMessage } from 'element-plus'
const state: IHooksOptions = reactive({
	dataListUrl: '/admin/payment/wallet/list',
	createdIsNeed: true,
	queryForm: {
		phoneOrEmail: '',
		userId: ''
	}
})

const dialogVisible = ref(false)

const addOrUpdateForm = reactive({
	id: '',
	userId: '',
	goldCoins: 0,
	integral: 0,
	vipDate: 0
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

const giftsOrDeductionsHandle = (row: any) => {
	dialogVisible.value = true
	addOrUpdateForm.id = row.id
	addOrUpdateForm.userId = row.userId
}

const submitForm = () => {
	updateWalletApi(addOrUpdateForm)
		.then(res => {
			ElMessage({
				message: '修改成功',
				type: 'success',
				plain: true
			})
			cancelHandle()
			getDataList()
		})
		.catch(() => {
			ElMessage({
				message: '修改失败',
				type: 'error',
				plain: true
			})
			cancelHandle()
		})
}
const cancelHandle = () => {
	dialogVisible.value = false
	addOrUpdateForm.goldCoins = 0
	addOrUpdateForm.integral = 0
	addOrUpdateForm.vipDate = 0
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, reset } = useCrud(state)
</script>

<style lang="scss" scoped></style>
