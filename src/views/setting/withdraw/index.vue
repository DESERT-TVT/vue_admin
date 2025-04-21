<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query"> </el-card>

			<el-card>
				<div>
					<el-input v-model="withdrawFee" placeholder="提现手续费" style="max-width: 600px">
						<template #prepend>
							<samp style="width: 280px"> 提现手续费（例如：0.5表示提现手续费为50%）</samp>
						</template>
					</el-input>
				</div>

				<div>
					<el-input v-model="withdrawMax" placeholder="最大提现金额" style="max-width: 600px">
						<template #prepend>
							<samp style="width: 200px"> 最大提现金额 </samp>
						</template>
					</el-input>
				</div>

				<div>
					<el-input v-model="withdrawMin" placeholder="最小提现金额" style="max-width: 600px">
						<template #prepend>
							<samp style="width: 200px"> 最小提现金额 </samp>
						</template>
					</el-input>
				</div>

				<div>
					<el-input v-model="integralRate" placeholder="钻石兑换人民币比例" style="max-width: 600px">
						<template #prepend>
							<samp style="width: 250px"> 钻石兑换货币比例(1钻石=?人民币) </samp>
						</template>
					</el-input>
				</div>
				<div>
					<el-input v-model="integralCoin" placeholder="钻石兑换货币比例" style="max-width: 600px">
						<template #prepend>
							<samp style="width: 250px"> 钻石兑换金币比例(1钻石=?金币) </samp>
						</template>
					</el-input>
				</div>
			</el-card>
			<el-button v-auth="'setting:withdraw:edit'" icon="Setting" type="primary" @click="() => modifySettleConfig()"> 保存修改 </el-button>
		</el-col>
	</el-row>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

import { APIModifyConfigList, APIModifyConfigModify, APIModifyWithdrawConfigModify, APIWithDrawConfigList } from '@/api/config/setting'
import { ElMessage } from 'element-plus'

//提现手续费
const withdrawFee = ref('0')
// 最大提现金额
const withdrawMax = ref('0')
// 最小提现金额
const withdrawMin = ref('0')
// 钻石兑换货币比例
const integralRate = ref('0')
// 钻石兑换金币比例
const integralCoin = ref('0')

// const closeDialogHandle = () =>{
//
// }
const queryConfig = () => {
	APIWithDrawConfigList()
		.then(resp => {
			if (resp.data) {
				withdrawFee.value = resp.data.withdrawFee
				withdrawMax.value = resp.data.withdrawMax
				withdrawMin.value = resp.data.withdrawMin
				integralRate.value = resp.data.integralRate
				integralCoin.value = resp.data.integralCoin
			}
			ElMessage.success({
				message: '配置刷新成功',
				plain: true
			})
		})
		.catch(() => {
			ElMessage.error('操作失败')
		})
		.finally(() => {})
}
queryConfig()

const modifySettleConfig = () => {
	const params = {
		withdrawFee: withdrawFee.value,
		withdrawMax: withdrawMax.value,
		withdrawMin: withdrawMin.value,
		integralRate: integralRate.value,
		integralCoin: integralCoin.value
	}
	APIModifyWithdrawConfigModify(params).then(resp => {
		if (resp.data) {
			ElMessage.success({
				message: '配置刷新成功',
				plain: true
			})
		}
	})
}

// const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, reset } = useCrud(state)
</script>

<style scoped lang="scss">
body {
	margin: 0;
}
.example-showcase .el-loading-mask {
	z-index: 9;
}
</style>
