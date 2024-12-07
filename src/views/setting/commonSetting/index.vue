<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query"> </el-card>

			<el-card>
				<div>
					<el-input v-model="LIMIT_DYNAMIC_FREE" placeholder="普通用户每日发布动态数" style="max-width: 600px">
						<template #prepend>
							<samp style="width: 200px"> 普通用户每日发布动态数 </samp>
						</template>
					</el-input>
				</div>
				<div>
					<el-input v-model="LIMIT_COMMENT_FREE" placeholder="普通用户每日发布评论数" style="max-width: 600px">
						<template #prepend>
							<samp style="width: 200px"> 普通用户每日发布评论数 </samp>
						</template>
					</el-input>
				</div>
				<div>
					<el-input v-model="LIMIT_LOOK_FREE" placeholder="普通用户每日可查看用户首页次数" style="max-width: 600px">
						<template #prepend>
							<samp style="width: 200px"> 普通用户每日可查看用户首页次数 </samp>
						</template>
					</el-input>
				</div>
				<div>
					<el-input v-model="UNLOCK_ACCOUNT_TIMES_DAILY" placeholder="VIP每日免费解锁非主播联系方式次数" style="max-width: 600px">
						<template #prepend>
							<samp style="width: 200px"> VIP每日免费解锁非主播联系方式次数 </samp>
						</template>
					</el-input>
				</div>
				<div>
					<el-input v-model="LIMIT_DAILY_CHAT_FREE" placeholder="用户每天免费文字聊天条数" style="max-width: 600px">
						<template #prepend>
							<samp style="width: 200px"> VIP用户每天免费文字聊天条数 </samp>
						</template>
					</el-input>
				</div>
				<div>
					<el-input v-model="LIMIT_DAILY_VOICE_FREE" placeholder="用户每天免费语音通话时长" style="max-width: 600px">
						<template #prepend>
							<samp style="width: 220px"> VIP用户每天免费语音通话时长(分钟) </samp>
						</template>
					</el-input>
				</div>
				<div>
					<el-input v-model="LIMIT_DAILY_VIDEO_FREE" placeholder="用户每天免费视频通话时长" style="max-width: 600px">
						<template #prepend>
							<samp style="width: 220px"> VIP用户每天免费视频通话时长(分钟) </samp>
						</template>
					</el-input>
				</div>
				<!--				<div>-->
				<!--					<el-input v-model="UNLOCK_HOME_PRICE" placeholder="解锁个人主页价格" style="max-width: 600px">-->
				<!--						<template #prepend>-->
				<!--							<samp style="width: 200px"> 解锁个人主页价格（金币） </samp>-->
				<!--						</template>-->
				<!--					</el-input>-->
				<!--				</div>-->
				<div>
					<el-input v-model="UNLOCK_SOCIAL_ACCOUNT_PRICE" placeholder="解锁联系方式价格" style="max-width: 600px">
						<template #prepend>
							<samp style="width: 200px"> 默认解锁联系方式价格（金币） </samp>
						</template>
					</el-input>
				</div>

				<div>
					<el-input v-model="USER_REGISTER_FREE_CHAT" placeholder="用户注册赠送免费聊天次数" style="max-width: 600px">
						<template #prepend>
							<samp style="width: 200px"> 用户注册赠送免费聊天次数 </samp>
						</template>
					</el-input>
				</div>
				<!-- 新添加的滑动按钮 -->
				<div style="margin-top: 20px; display: flex; align-items: center">
					<samp style="width: 200px"> 用户注册强制填写邀请码 </samp>
					<el-switch
						v-model="MUST_REFFERAL_CODE"
						active-value="1"
						inactive-value="0"
						active-text="开启"
						inactive-text="关闭"
						inline-prompt
						@change="() => handleStatusChange()"
					></el-switch>
				</div>
			</el-card>
			<el-button v-auth="'setting:common:edit'" icon="Setting" type="primary" @click="() => modifySettleConfig()"> 保存修改 </el-button>
		</el-col>
	</el-row>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

import { APIWithCommonConfigList, APIWithCommonConfigUpdate } from '@/api/config/setting'
import { ElMessage } from 'element-plus'

const LIMIT_DYNAMIC_FREE = ref('0')
const LIMIT_COMMENT_FREE = ref('0')
const LIMIT_LOOK_FREE = ref('0')
const LIMIT_DAILY_CHAT_FREE = ref('0')
const LIMIT_DAILY_VOICE_FREE = ref('0')
const LIMIT_DAILY_VIDEO_FREE = ref('0')
const UNLOCK_HOME_PRICE = ref('0')
const UNLOCK_SOCIAL_ACCOUNT_PRICE = ref('0')
const MUST_REFFERAL_CODE = ref(1)
const UNLOCK_ACCOUNT_TIMES_DAILY = ref(0)
const USER_REGISTER_FREE_CHAT = ref(0)

const handleStatusChange = () => {
	if (MUST_REFFERAL_CODE.value === 1) {
		MUST_REFFERAL_CODE.value = 0
	} else if (MUST_REFFERAL_CODE.value === 0) {
		MUST_REFFERAL_CODE.value = 1
	}
}
const queryConfig = () => {
	APIWithCommonConfigList()
		.then(resp => {
			if (resp.data) {
				LIMIT_DYNAMIC_FREE.value = resp.data.limitDynamicFree
				LIMIT_COMMENT_FREE.value = resp.data.limitCommentFree
				LIMIT_LOOK_FREE.value = resp.data.limitLookFree
				LIMIT_DAILY_CHAT_FREE.value = resp.data.limitDailyChatFree
				LIMIT_DAILY_VOICE_FREE.value = resp.data.limitDailyVoiceFree
				LIMIT_DAILY_VIDEO_FREE.value = resp.data.limitDailyVideoFree
				UNLOCK_HOME_PRICE.value = resp.data.unlockHomePrice
				UNLOCK_SOCIAL_ACCOUNT_PRICE.value = resp.data.unlockSocialAccountPrice
				MUST_REFFERAL_CODE.value = resp.data.mustRefferalCode
				UNLOCK_ACCOUNT_TIMES_DAILY.value = resp.data.unlockAccountTimesDaily
				USER_REGISTER_FREE_CHAT.value = resp.data.freeChat
			}
			ElMessage.success({
				message: '配置刷新成功',
				plain: true
			})
		})
		.catch(() => {
			ElMessage.error('操作失败')
		})
		.finally(() => {
			console.log('MUST_REFFERAL_CODE', MUST_REFFERAL_CODE.value)
		})
}
queryConfig()

const modifySettleConfig = () => {
	const params = {
		limitDynamicFree: LIMIT_DYNAMIC_FREE.value,
		limitCommentFree: LIMIT_COMMENT_FREE.value,
		limitLookFree: LIMIT_LOOK_FREE.value,
		limitDailyChatFree: LIMIT_DAILY_CHAT_FREE.value,
		limitDailyVoiceFree: LIMIT_DAILY_VOICE_FREE.value,
		limitDailyVideoFree: LIMIT_DAILY_VIDEO_FREE.value,
		unlockHomePrice: UNLOCK_HOME_PRICE.value,
		unlockSocialAccountPrice: UNLOCK_SOCIAL_ACCOUNT_PRICE.value,
		mustRefferalCode: MUST_REFFERAL_CODE.value,
		unlockAccountTimesDaily: UNLOCK_ACCOUNT_TIMES_DAILY.value,
		freeChat: USER_REGISTER_FREE_CHAT.value
	}
	APIWithCommonConfigUpdate(params).then(resp => {
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
