<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query"> </el-card>

			<el-card>
				<div>
					<el-input v-model="chargeLink" placeholder="充值客服" style="max-width: 600px">
						<template #prepend>
							<samp style="width: 200px"> 充值客服链接 </samp>
						</template>
					</el-input>
				</div>

				<div>
					<el-input v-model="chatLink" placeholder="聊天客服" style="max-width: 600px">
						<template #prepend>
							<samp style="width: 200px"> 聊天客服链接 </samp>
						</template>
					</el-input>
				</div>

				<div>
					<el-input v-model="feedbackLink" placeholder="意见反馈客服" style="max-width: 600px">
						<template #prepend>
							<samp style="width: 200px"> 意见反馈客服链接 </samp>
						</template>
					</el-input>
				</div>
				<div>
					<el-input v-model="complaintLink" placeholder="投诉客服" style="max-width: 600px">
						<template #prepend>
							<samp style="width: 200px"> 投诉客服链接 </samp>
						</template>
					</el-input>
				</div>
			</el-card>
			<el-button v-auth="'setting:callcenter:edit'" icon="Setting" type="primary" @click="() => modifySettleConfig()"> 保存修改 </el-button>
		</el-col>
	</el-row>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

import {
	APIGetCallCenterConfigList,
	APIModifyCallCenterModify,
	APIModifyConfigList,
	APIModifyConfigModify,
	APIModifyWithdrawConfigModify,
	APIWithDrawConfigList
} from '@/api/config/setting'
import { ElMessage } from 'element-plus'

// 充值链接
const chargeLink = ref('0')
// 聊天客服链接
const chatLink = ref('0')
// 意见反馈
const feedbackLink = ref('0')
// 投诉
const complaintLink = ref('0')

// const closeDialogHandle = () =>{
//
// }
const queryConfig = () => {
	APIGetCallCenterConfigList()
		.then(resp => {
			if (resp.data) {
				chargeLink.value = resp.data.chargeLink
				chatLink.value = resp.data.chatLink
				feedbackLink.value = resp.data.feedbackLink
				complaintLink.value = resp.data.complaintLink
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
		chargeLink: chargeLink.value,
		chatLink: chatLink.value,
		feedbackLink: feedbackLink.value,
		complaintLink: complaintLink.value
	}
	APIModifyCallCenterModify(params).then(resp => {
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
