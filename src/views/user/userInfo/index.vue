<template xmlns="http://www.w3.org/1999/html">
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query">
				<el-form ref="queryRef" :inline="true" :model="state.queryForm">
					<el-form-item prop="userId">
						<el-input v-model="state.queryForm.userId" clearable placeholder="UID"></el-input>
					</el-form-item>
					<el-form-item prop="nickname">
						<el-input v-model="state.queryForm.nickname" clearable placeholder="昵称"></el-input>
					</el-form-item>
					<el-form-item prop="authInfo">
						<el-select v-model="state.queryForm.authInfo" clearable placeholder="请选择认证类型">
							<el-option label="真人" value="1" />
							<el-option label="女神" value="2" />
							<el-option label="主播" value="3" />
						</el-select>
					</el-form-item>
					<el-form-item prop="gender">
						<fast-dict-select v-model="state.queryForm.gender" dict-type="user_gender" clearable placeholder="性别"></fast-dict-select>
					</el-form-item>
					<!--          <el-form-item prop="city">-->
					<!--            <el-input v-model="state.queryForm.city" clearable placeholder="城市"></el-input>-->
					<!--          </el-form-item>-->
					<el-form-item>
						<el-button icon="Search" type="primary" @click="getDataList()">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button icon="RefreshRight" @click="reset(queryRef)">重置</el-button>
					</el-form-item>
				</el-form>
			</el-card>

			<el-card>
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
					<el-table-column fixed prop="userId" label="UID" width="100" header-align="center" align="center"></el-table-column>
					<el-table-column align="center" header-align="center" label="昵称" width="150">
						<template #default="scope">
							<el-popover :width="383" placement="right" trigger="hover">
								<template #reference>
									<el-image :src="scope.row.avatar" style="margin-top: 7px; height: 60px; border-radius: 6px" />
								</template>
								<template #default>
									<el-image :src="scope.row.avatar" style="width: 356px" />
								</template>
							</el-popover>
							<br />
							<el-popover :width="300" placement="right" trigger="click">
								<template #reference>
									<el-button text type="success">{{ scope.row.nickname }}</el-button>
								</template>
								<el-row>
									<el-col :span="24">
										<div class="layout-table-span">年龄：{{ scope.row.age }}</div>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="24">
										<div class="layout-table-span">身高：{{ scope.row.height + 'cm' }}</div>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="24">
										<div class="layout-table-span">体重：{{ scope.row.weight + 'kg' }}</div>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="24">
										<div class="layout-table-span">气质类型：{{ getTemperamentLabel(scope.row.temperamentLabel) }}</div>
									</el-col>
								</el-row>
							</el-popover>
						</template>
					</el-table-column>
					<fast-dict-column prop="gender" label="性别" dict-type="user_gender"></fast-dict-column>
					<el-table-column prop="mobile" label="手机号" header-align="center" width="150" align="center"></el-table-column>
					<el-table-column align="center" header-align="center" label="邮箱" prop="email" width="150"></el-table-column>
					<el-table-column label="认证信息" width="100" header-align="center" align="center">
						<template #default="scope">
							<span v-if="scope.row.online == 1">
								<el-popconfirm
									v-auth="'user:ident:edit'"
									confirm-button-text="确认"
									cancel-button-text="取消"
									:icon="InfoFilled"
									icon-color="red"
									title="确认取消该用户的认证信息吗?"
									@confirm="handleCancelAuthentication(scope.row.userId, 3)"
								>
									<template #reference>
										<el-button type="success" text>主播</el-button>
									</template> </el-popconfirm
								><br />
							</span>
							<span v-else> </span>
							<span v-if="scope.row.realer == 1">
								<el-popconfirm
									v-auth="'user:ident:edit'"
									confirm-button-text="确认"
									cancel-button-text="取消"
									:icon="InfoFilled"
									icon-color="red"
									title="确认取消该用户的认证信息吗?"
									@confirm="handleCancelAuthentication(scope.row.userId, 1)"
								>
									<template #reference>
										<el-button type="success" text>真人</el-button>
									</template>
								</el-popconfirm>
								<br />
							</span>
							<span v-else> </span>
							<span v-if="scope.row.goddess == 1">
								<el-popconfirm
									v-auth="'user:ident:edit'"
									confirm-button-text="确认"
									cancel-button-text="取消"
									:icon="InfoFilled"
									icon-color="red"
									title="确认取消该用户的认证信息吗?"
									@confirm="handleCancelAuthentication(scope.row.userId, 2)"
								>
									<template #reference> <el-button type="success" text>女神</el-button> <br /> </template>
								</el-popconfirm>
							</span>
							<span v-else> </span>
						</template>
					</el-table-column>
					<el-table-column align="center" header-align="center" label="热度值" prop="hotNumber" width="150"></el-table-column>
					<el-table-column align="center" header-align="center" label="热度结束时间" prop="hotEndTime" width="150"></el-table-column>
					<el-table-column prop="vipExpireTime" label="vip到期时间" width="180" header-align="center" align="center"></el-table-column>
					<el-table-column prop="goldCoins" label="金币余额" width="100" header-align="center" align="center">
						<template #default="scope">
							<el-popover placement="right" :width="550" trigger="click">
								<template #reference>
									<el-button type="success" text @click="showGoldCoinsDetail(scope.row.userId)">{{ scope.row.goldCoins }} </el-button>
								</template>
								<el-card>
									<el-table :data="dataDetails.goldCoinsFrom.goldCoinsDataList" height="300px">
										<el-table-column align="center" label="变更时间" property="updateTime" />
										<el-table-column align="center" label="金币余额" property="goldCoinsBalance" />
									</el-table>
									<el-pagination
										size="small"
										background
										layout="total,prev, pager, next"
										:page-size="dataDetails.goldCoinsFrom.limit"
										:total="dataDetails.goldCoinsFrom.total"
										class="mt-4"
										@current-change="goldCoinsHandleCurrentChange"
									/>
								</el-card>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column prop="integral" label="钻石余额" width="100" header-align="center" align="center">
						<template #default="scope">
							<el-popover placement="right" :width="550" trigger="click">
								<template #reference>
									<el-button type="success" text @click="showIntegralDetail(scope.row.userId)">{{ scope.row.integral }} </el-button>
								</template>
								<el-card>
									<el-table :data="dataDetails.integralFrom.integralDataList" height="300px">
										<el-table-column align="center" label="变更时间" property="updateTime" />
										<el-table-column align="center" label="钻石余额" property="goldCoinsBalance" />
									</el-table>
									<el-pagination
										size="small"
										background
										layout="total,prev, pager, next"
										:page-size="dataDetails.integralFrom.limit"
										:total="dataDetails.integralFrom.total"
										class="mt-4"
										@current-change="integralHandleCurrentChange"
									/>
								</el-card>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column align="center" header-align="center" label="魅力等级" prop="charmLevel" width="100"></el-table-column>
					<el-table-column prop="rechargeCount" label="累计充值" width="100" header-align="center" align="center">
						<template #default="scope">
							<el-popover placement="right" :width="550" trigger="click">
								<template #reference>
									<el-button text type="success" @click="showRechargeCount(scope.row.userId)">
										{{ scope.row.rechargeCount }}
									</el-button>
								</template>
								<el-card>
									<el-table :data="dataDetails.rechargeCountFrom.rechargeCountDataList" height="300px">
										<el-table-column align="center" label="支付时间" property="payTime" />
										<el-table-column align="center" header-align="center" label="订单类型" prop="sourceType">
											<template #default="scope">
												<el-tag v-if="scope.row.sourceType == 1" type="primary">金币</el-tag>
												<el-tag v-if="scope.row.sourceType == 2" type="primary">会员</el-tag>
											</template>
										</el-table-column>
										<el-table-column align="center" label="购买金额" property="payAmount" />
									</el-table>
									<el-pagination
										size="small"
										background
										layout="total,prev, pager, next"
										:page-size="dataDetails.rechargeCountFrom.limit"
										:total="dataDetails.rechargeCountFrom.total"
										class="mt-4"
										@current-change="rechargeHandleCurrentChange"
									/>
								</el-card>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column prop="withdrawCount" label="累计提现" width="100" header-align="center" align="center">
						<template #default="scope">
							<el-popover placement="right" :width="550" trigger="click">
								<template #reference>
									<el-button text type="success" @click="showWithdrawCount(scope.row.userId)">
										{{ scope.row.withdrawCount }}
									</el-button>
								</template>
								<el-card>
									<el-table :data="dataDetails.withdrawCountForm.withdrawCountDataList" height="300px">
										<el-table-column align="center" label="提现时间" property="updateTime" />
										<el-table-column align="center" label="提现金额" property="exchangeNum" />
									</el-table>
									<el-pagination
										size="small"
										background
										layout="total,prev, pager, next"
										:page-size="dataDetails.withdrawCountForm.limit"
										:total="dataDetails.withdrawCountForm.total"
										class="mt-4"
										@current-change="withdrawHandleCurrentChange"
									/>
								</el-card>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column prop="inviteCount" label="邀请人数" width="100" header-align="center" align="center">
						<template #default="scope">
							<el-popover placement="right" :width="550" trigger="click">
								<template #reference>
									<el-button type="success" text @click="showInviteCount(scope.row.userId)">
										{{ scope.row.inviteCount == null ? 0 : scope.row.inviteCount }}
									</el-button>
								</template>
								<el-card>
									<el-table :data="dataDetails.userInviteCountFrom.userInviteCountDataList" height="300px">
										<el-table-column align="center" label="UID" property="userId" />
										<el-table-column align="center" label="邀请时间" property="createTime" />
									</el-table>
									<el-pagination
										size="small"
										background
										layout="total,prev, pager, next"
										:page-size="dataDetails.userInviteCountFrom.limit"
										:total="dataDetails.userInviteCountFrom.total"
										class="mt-4"
										@current-change="userInviteHandleCurrentChange"
									/>
								</el-card>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column prop="lastLoginTime" label="最后登录时间" width="180" header-align="center" align="center"></el-table-column>
					<el-table-column prop="createTime" label="注册时间" width="180" header-align="center" align="center"></el-table-column>

					<!--					<el-table-column prop="isMute" label="禁言状态" align="center">-->
					<!--						<template #default="scope">-->
					<!--							<el-switch-->
					<!--								v-auth="'user:update'"-->
					<!--								v-model="scope.row.isMute"-->
					<!--								class="mb-2"-->
					<!--								inline-prompt-->
					<!--								style="&#45;&#45;el-switch-off-color: #13ce66; &#45;&#45;el-switch-on-color: #ff4949"-->
					<!--								active-text="解除禁言"-->
					<!--								inactive-text="禁言"-->
					<!--								:active-value="1"-->
					<!--								:inactive-value="0"-->
					<!--								@change="handleIsMuteChange(scope.row)"-->
					<!--							/>-->
					<!--						</template>-->
					<!--					</el-table-column>-->
					<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
						<template #default="scope">
							<el-button
								v-if="userStore.user.superAdmin == 1 || scope.row.userId == userStore.user.id"
								v-auth="'user:update'"
								link
								type="primary"
								@click="updatePasswordHandle(scope.row.userId)"
							>
								修改密码
							</el-button>
							<br />
							<el-button v-auth="'user:update'" link type="primary" @click="updateIdentificationHandle(scope.row)"> 添加认证 </el-button>
							<br />
							<el-button v-auth="'user:update'" link type="primary" @click="updateRefHandle(scope.row)"> 修改用户信息 </el-button>
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
	<!-- 修改认证 -->
	<el-dialog v-model="updateUserHandleVisible" title="添加认证" width="400">
		<template #footer>
			<el-form :model="updateUserForm">
				<el-form-item label="认证类型">
					<el-select v-model="updateUserForm.type" placeholder="请选择" clearable>
						<el-option v-if="updateUserForm.realer == 0" label="真人" value="1" />
						<el-option v-if="updateUserForm.goddess == 0" label="女神" value="2" />
						<el-option v-if="updateUserForm.online == 0" label="主播" value="3" />
					</el-select>
				</el-form-item>
			</el-form>
			<div class="dialog-footer">
				<el-button type="primary" @click="updateIdentificationSubmit">提交</el-button>
				<el-button @click="cancelHandle">取消</el-button>
			</div>
		</template>
	</el-dialog>

	<!-- 修改密码 -->
	<el-dialog v-model="updatePwdVisible" :show-close="false" align-center width="300">
		<el-form ref="updatePwdRef" :model="updatePwdForm" :rules="updatePwdRules" label-width="80">
			<el-form-item label="新密码" prop="newPassword">
				<el-input v-model="updatePwdForm.newPassword" autocomplete="off" placeholder="请输入密码" show-password type="password" />
			</el-form-item>
			<el-form-item label="确认密码" prop="confirmPassword">
				<el-input v-model="updatePwdForm.confirmPassword" autocomplete="off" placeholder="请输入密码" show-password type="password" />
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button type="primary" @click="updatePwdSubmit"> 提交</el-button>
				<el-button @click="updatePwdCancel">取消</el-button>
			</div>
		</template>
	</el-dialog>
	<!-- 修改 -->
	<add-or-update ref="updateRef" @refresh-data-list="getDataList"></add-or-update>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { useAppStore } from '@/store/modules/app'
import {
	useUserIsMuteApi,
	cancelIdentificationApi,
	updateIdentificationApi,
	getGoldCoinsDetailsApi,
	getIntegralDetailsApi,
	getRechargeCountApi,
	getWithdrawCountApi,
	getUserInviteCountApi
} from '@/api/user/userManage'
import { InfoFilled } from '@element-plus/icons-vue'
import { updatePwdSubmitApi } from '@/api/sys/user'
import AddOrUpdate from '@/views/user/userInfo/update.vue'
import { getDictDataList } from '@/utils/tool'

const userStore = useUserStore()
const appStore = useAppStore()
const state: IHooksOptions = reactive({
	dataListUrl: '/admin/sys/user/page',
	deleteUrl: '/admin/sys/user',
	queryForm: {
		username: '',
		gender: '',
		authInfo: '',
		city: '',
		nickname: '',
		userId: ''
	}
})

const temperamentLabelList = getDictDataList(appStore.dictList, 'temperament_label')
const getTemperamentLabel = (temperamentLabel: any) => {
	// 将temperamentLabel字符串分割成数组
	if (temperamentLabel) {
		const ids = temperamentLabel.split(',')
		// 过滤temperamentLabelList，收集匹配的项 dictValue
		return temperamentLabelList
			.filter((item: any) => ids.includes(item.dictValue))
			.map((item: any) => item.dictLabel)
			.join(',')
	}
}

const updateRef = ref()
const updateRefHandle = (row: any) => {
	updateRef.value.init(row)
}

const updatePwdRef = ref()
const updatePwdVisible = ref(false)
const updatePwdForm = reactive({
	id: '',
	newPassword: '',
	confirmPassword: ''
})

const dataDetails = reactive({
	withdrawCountForm: {
		withdrawCountDataList: [] as any[],
		page: 1,
		limit: 10,
		userId: '',
		total: 0
	},
	rechargeCountFrom: {
		rechargeCountDataList: [] as any[],
		page: 1,
		userId: '',
		limit: 10,
		total: 0
	},
	integralFrom: {
		integralDataList: [] as any[],
		page: 1,
		userId: '',
		type: '',
		limit: 10,
		total: 0
	},
	goldCoinsFrom: {
		goldCoinsDataList: [] as any[],
		userId: '',
		page: 1,
		type: '',
		limit: 10,
		total: 0
	},
	userInviteCountFrom: {
		userInviteCountDataList: [] as any[],
		page: 1,
		userId: '',
		limit: 10,
		total: 0
	}
})

const updateUserHandleVisible = ref(false)
const updateUserForm = reactive({
	type: '',
	userId: '',
	goddess: 0,
	online: 0,
	realer: 0
})

const validatePass = (rule: any, value: any, callback: any) => {
	if (value === '') {
		callback(new Error('新密码不能为空'))
	} else {
		if (updatePwdForm.newPassword !== '') {
			if (!updatePwdRef.value) {
				return
			}
			updatePwdRef.value.validateField('checkPass')
		}
		callback()
	}
}
const validatePass2 = (rule: any, value: any, callback: any) => {
	if (value === '') {
		callback(new Error('请确认新密码'))
	} else if (value !== updatePwdForm.newPassword) {
		callback(new Error('两次输入的密码不一致!'))
	} else {
		callback()
	}
}

const updatePwdRules = ref({
	newPassword: [{ validator: validatePass, trigger: 'blur', required: true }],
	confirmPassword: [{ validator: validatePass2, trigger: 'blur', required: true }]
})

// 取消认证
const handleCancelAuthentication = (userId: number, type: number) => {
	let form = {
		userId: userId,
		type: type
	}

	cancelIdentificationApi(form)
		.then(() => {
			ElMessage({
				message: '修改成功',
				type: 'success',
				plain: true
			})
			getDataList()
		})
		.catch(() => {
			ElMessage({
				message: '修改失败',
				type: 'error',
				plain: true
			})
		})
}

// 查看金币变动明细
const showGoldCoinsDetail = (userId: string) => {
	dataDetails.goldCoinsFrom.userId = userId
	dataDetails.goldCoinsFrom.type = '1'
	let params = {
		page: dataDetails.goldCoinsFrom.page,
		limit: dataDetails.goldCoinsFrom.limit,
		userId: dataDetails.goldCoinsFrom.userId,
		type: dataDetails.goldCoinsFrom.type
	}
	getGoldCoinsDetailsApi(params).then(res => {
		dataDetails.goldCoinsFrom.goldCoinsDataList = res.data.list
		dataDetails.goldCoinsFrom.total = res.data.total
	})
}
// 查看钻石变动明细
const showIntegralDetail = (userId: string) => {
	dataDetails.integralFrom.userId = userId
	dataDetails.integralFrom.type = '2'
	let params = {
		page: dataDetails.integralFrom.page,
		limit: dataDetails.integralFrom.limit,
		userId: dataDetails.integralFrom.userId,
		type: dataDetails.integralFrom.type
	}
	getIntegralDetailsApi(params).then(res => {
		dataDetails.integralFrom.integralDataList = res.data.list
		dataDetails.integralFrom.total = res.data.total
	})
}
// 累计充值明细
const showRechargeCount = (userId: string) => {
	dataDetails.rechargeCountFrom.userId = userId
	let params = {
		userId: dataDetails.rechargeCountFrom.userId,
		limit: dataDetails.rechargeCountFrom.limit,
		page: dataDetails.rechargeCountFrom.page
	}
	getRechargeCountApi(params).then(res => {
		dataDetails.rechargeCountFrom.rechargeCountDataList = res.data.list
		dataDetails.rechargeCountFrom.total = res.data.total
	})
}
// 累计提现明细
const showWithdrawCount = (userId: string) => {
	dataDetails.withdrawCountForm.userId = userId
	let params = {
		userId: dataDetails.withdrawCountForm.userId,
		limit: dataDetails.withdrawCountForm.limit,
		page: dataDetails.withdrawCountForm.page
	}
	getWithdrawCountApi(params).then(res => {
		dataDetails.withdrawCountForm.withdrawCountDataList = res.data.list
		dataDetails.withdrawCountForm.total = res.data.total
	})
}
// 邀请人数
const showInviteCount = (userId: string) => {
	dataDetails.userInviteCountFrom.userId = userId
	let params = {
		userId: dataDetails.userInviteCountFrom.userId,
		limit: dataDetails.userInviteCountFrom.limit,
		page: dataDetails.userInviteCountFrom.page
	}
	getUserInviteCountApi(params).then(res => {
		dataDetails.userInviteCountFrom.userInviteCountDataList = res.data.list
		dataDetails.userInviteCountFrom.total = res.data.total
	})
}
// 修改密码
const updatePasswordHandle = (userId: string) => {
	updatePwdVisible.value = true
	updatePwdForm.id = userId
}

const updatePwdSubmit = () => {
	updatePwdRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		updatePwdSubmitApi(updatePwdForm)
			.then(() => {
				ElMessage({
					message: '修改成功',
					type: 'success',
					plain: true
				})
				updatePwdVisible.value = false
			})
			.catch(() => {
				ElMessage({
					message: '修改失败',
					type: 'error',
					plain: true
				})
				updatePwdVisible.value = false
			})
	})
}
const updatePwdCancel = () => {
	updatePwdVisible.value = false
	updatePwdForm.newPassword = ''
}

// 用户认证
const updateIdentificationHandle = (row: any) => {
	updateUserHandleVisible.value = true
	updateUserForm.userId = row.userId
	updateUserForm.goddess = row.goddess
	updateUserForm.online = row.online
	updateUserForm.realer = row.realer
}

// 修改认证提交
const updateIdentificationSubmit = () => {
	if (updateUserForm.type == '') {
		ElMessage({
			message: '请选择认证类型',
			type: 'error'
		})
		return
	}
	updateIdentificationApi(updateUserForm)
		.then(() => {
			ElMessage({
				message: '修改成功',
				type: 'success'
			})
			getDataList()
			updateUserHandleVisible.value = false
		})
		.catch(() => {
			updateUserHandleVisible.value = false
		})
}
const queryRef = ref()

const handleIsMuteChange = (row: any) => {
	const dataForm = {
		userId: row.userId,
		isMute: row.isMute
	}
	useUserIsMuteApi(dataForm)
		.then(() => {
			ElMessage({
				message: '修改成功',
				type: 'success',
				plain: true
			})
		})
		.catch(() => {
			ElMessage({
				message: '修改失败',
				type: 'error',
				plain: true
			})
			getDataList()
		})
}

const cancelHandle = () => {
	updateUserHandleVisible.value = false
	updateUserForm.type = ''
}

const goldCoinsHandleSizeChange = (val: number) => {
	dataDetails.goldCoinsFrom.page = val
	let params = {
		page: dataDetails.goldCoinsFrom.page,
		limit: dataDetails.goldCoinsFrom.limit
	}
	getGoldCoinsDetailsApi(params).then(res => {
		dataDetails.goldCoinsFrom.goldCoinsDataList = res.data.list
		dataDetails.goldCoinsFrom.total = res.data.total
	})
}
const goldCoinsHandleCurrentChange = (val: number) => {
	dataDetails.goldCoinsFrom.page = val
	let params = {
		page: dataDetails.goldCoinsFrom.page,
		limit: dataDetails.goldCoinsFrom.limit,
		userId: dataDetails.goldCoinsFrom.userId,
		type: dataDetails.goldCoinsFrom.type
	}
	getGoldCoinsDetailsApi(params).then(res => {
		dataDetails.goldCoinsFrom.goldCoinsDataList = res.data.list
		// dataDetails.goldCoinsFrom.total = res.data.total;
	})
}

const withdrawHandleSizeChange = (val: number) => {}
const withdrawHandleCurrentChange = (val: number) => {
	dataDetails.withdrawCountForm.page = val
	let params = {
		page: dataDetails.withdrawCountForm.page,
		limit: dataDetails.withdrawCountForm.limit,
		userId: dataDetails.withdrawCountForm.userId
	}
	getWithdrawCountApi(params).then(res => {
		dataDetails.withdrawCountForm.withdrawCountDataList = res.data.list
	})
}

const integralHandleSizeChange = (val: number) => {}
const integralHandleCurrentChange = (val: number) => {
	dataDetails.integralFrom.page = val
	let params = {
		page: dataDetails.integralFrom.page,
		limit: dataDetails.integralFrom.limit,
		userId: dataDetails.integralFrom.userId,
		type: dataDetails.integralFrom.type
	}
	getGoldCoinsDetailsApi(params).then(res => {
		dataDetails.integralFrom.integralDataList = res.data.list
	})
}

const rechargeHandleSizeChange = (val: number) => {}
const rechargeHandleCurrentChange = (val: number) => {
	dataDetails.rechargeCountFrom.page = val
	let params = {
		page: dataDetails.rechargeCountFrom.page,
		limit: dataDetails.rechargeCountFrom.limit,
		userId: dataDetails.rechargeCountFrom.userId
	}
	getRechargeCountApi(params).then(res => {
		dataDetails.rechargeCountFrom.rechargeCountDataList = res.data.list
	})
}

const userInviteHandleSizeChange = (val: number) => {}
const userInviteHandleCurrentChange = (val: number) => {
	dataDetails.userInviteCountFrom.page = val
	let params = {
		page: dataDetails.userInviteCountFrom.page,
		limit: dataDetails.userInviteCountFrom.limit,
		userId: dataDetails.userInviteCountFrom.userId
	}
	getUserInviteCountApi(params).then(res => {
		dataDetails.userInviteCountFrom.userInviteCountDataList = res.data.list
	})
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, reset } = useCrud(state)
</script>

<style lang="scss" scoped>
.table_container {
	height: calc(100% - 80px);
}
</style>
