<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" :title="title" :width="500" @close="onReset">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="150px" @keyup.enter="onSubmit">
			<el-form-item label="用户id" prop="userId">
				<el-input v-model="dataForm.userId" type="number" placeholder="请输入用户Id" :readonly="showUpdata" />
			</el-form-item>
			<el-tabs v-model="tabsVModel">
				<el-tab-pane label="代理分成" name="proxy">
					<el-form-item label="代理消费分成" prop="cosRate">
						<el-input v-model="dataForm.cosRate" type="number" placeholder="请输入代理消费分成" @change="handleRateChange('cosRate')">
							<template #append>%</template>
						</el-input>
						<!-- <el-input-number
							v-model="dataForm.cosRate"
							style="width: 100%"
							:step="1"
							max="100"
							min="1"
							type="number"
							placeholder="请输入代理消费分成"
							@change="handleRateChange('cosRate')"
						/> -->
					</el-form-item>
					<el-form-item label="代理收益分成" prop="inRate">
						<el-input
							v-model="dataForm.inRate"
							style="width: 100%"
							type="number"
							placeholder="请输入代理消费分成"
							@change="handleRateChange('inRate')"
						>
							<template #append>%</template>
						</el-input>
					</el-form-item>
				</el-tab-pane>
				<el-tab-pane v-if="showUpdata" label="主播分成" name="online">
					<el-form-item label="下级主播直接分成" prop="onlineRate">
						<el-input
							v-model="dataForm.onlineRate"
							style="width: 100%"
							type="number"
							placeholder="请输入代理消费分成"
							@change="handleRateChange('onlineRate')"
						>
							<template #append>%</template>
						</el-input>
					</el-form-item>
				</el-tab-pane>
			</el-tabs>

			<!-- <el-form-item label="下级主播直接分成" prop="onlineRate">
				<el-input-number
					v-model="dataForm.onlineRate"
					style="width: 100%"
					:step="0.01"
					max="1"
					min="0"
					type="number"
					placeholder="请输入下级主播直接分成"
					@change="handleRateChange('onlineRate')"
				/>
			</el-form-item> -->
			<!-- <el-form-item v-if="!showUpdata" label="上级用户id" prop="parentUserId">
				<el-input v-model="dataForm.parentUserId" placeholder="请输入上级用户id" />
			</el-form-item> -->
			<!-- <el-form-item v-if="!showUpdata" label="用户类型" prop="userType" :rules="[{ required: true, message: '请选择用户类型', trigger: 'blur' }]">
				<el-radio-group v-model="dataForm.userType">
					<el-radio :value="1">主播</el-radio>
					<el-radio :value="2">代理</el-radio>
				</el-radio-group>
			</el-form-item> -->
		</el-form>
		<template #footer>
			<el-button @click="onCloseDialog">取消</el-button>
			<fetctButton :submit-handle="onSubmit" />
			<!-- <el-button v-auth="'sys:contact:modify'" type="primary" @click="onSubmit">确定</el-button> -->
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { fetchAddProxy, fetchUpdateProxy, ProxyAddReq } from '@/api/user/proxy'
import { ElMessage, FormInstance } from 'element-plus'
import { computed, reactive, ref } from 'vue'
import fetctButton from '@/components/fetct-button/index.vue'

// 对话框可见性状态
const visible = ref(false)
// 表单引用
const dataFormRef = ref<FormInstance>()
// 表单数据
const dataForm = reactive({
	userId: '',
	cosRate: 0,
	inRate: 0,
	onlineRate: 0,
	// parentUserId: '',
	userType: 1,
	parentUserId: ''
})
const tabsVModel = ref('proxy')
// 定义一个将比率转换为百分比字符串的函数
// const convertRateToPercentage = (rate: number) => {
// 	return (rate * 100).toFixed(0)
// }
// 定义一个将百分比字符串恢复为比率数字的函数
// const convertPercentageToRate = (percentage?: string): number => {
// 	if (!percentage) {
// 		return 0
// 	}
// 	const parsedPercentage = parseFloat(percentage)
// 	return isNaN(parsedPercentage) ? 0 : parsedPercentage / 100
// }
// 处理比率输入的公共函数
const handleRateChange = (field: 'cosRate' | 'inRate' | 'onlineRate') => {
	const value = dataForm[field]
	// 确保值在 1 到 100 之间
	const validValue = Math.min(100, Math.max(1, parseFloat(Number(value).toFixed(2))))
	dataForm[field] = validValue
}

// 表单验证规则
const dataRules = reactive({
	userId: [{ required: true, message: '请输入用户Id', trigger: 'blur' }],
	cosRate: [{ required: true, message: '请输入代理消费分成', trigger: 'blur' }],
	inRate: [{ required: true, message: '请输入代理收益分成', trigger: 'blur' }],
	onlineRate: [{ required: true, message: '请输入主播收益分成比例', trigger: 'blur' }]
})
const title = computed(() => {
	if (showUpdata.value && !dataForm.parentUserId) {
		return '修改一级代理'
	} else if (dataForm.parentUserId) {
		return '新增下级代理'
	} else {
		return '设置一级代理'
	}
})
// 重置表单数据和验证状态
const onReset = () => {
	dataForm.userId = ''
	dataForm.cosRate = 0
	dataForm.inRate = 0
	dataForm.onlineRate = 0
	// dataForm.parentUserId = ''
	dataForm.userType = 1
	showUpdata.value = false
	dataForm.parentUserId = ''
	dataFormRef.value?.resetFields('userId')
	// dataFormRef.value?.resetFields()
	tabsVModel.value = 'proxy'
}

// 关闭对话框
const onCloseDialog = () => {
	visible.value = false
}
const emit = defineEmits(['refresh-list'])
// 提交表单
const onSubmit = async () => {
	const validate = await dataFormRef.value?.validate()
	if (!validate) {
		return
	}
	let params = {} as ProxyAddReq
	if (tabsVModel.value === 'proxy') {
		if (!dataForm.cosRate || !dataForm.inRate) {
			return ElMessage.error('代理消费分成和代理收益分成不能为空')
		}
		params = {
			userId: dataForm.userId,
			cosRate: dataForm.cosRate.toString(),
			inRate: dataForm.inRate.toString(),
			parentUserId: dataForm.parentUserId ? dataForm.parentUserId : undefined
		}
	} else {
		if (!dataForm.onlineRate) {
			return ElMessage.error('主播收益分成比例不能为空')
		}
		params = {
			userId: dataForm.userId,
			onlineRate: dataForm.onlineRate.toString()
		}
	}
	let res
	if (showUpdata.value) {
		res = await fetchUpdateProxy(params)
	} else {
		res = await fetchAddProxy(params)
	}
	if (res) {
		emit('refresh-list')
		ElMessage.success('设置成功')
		onCloseDialog()
	}
}
const showUpdata = ref(false)
// 初始化对话框
const init = (row?: ProxyAddReq, isAdd?: boolean) => {
	if (row?.userId && !isAdd) {
		dataForm.userId = row.userId
		dataForm.cosRate = Number(row.cosRate)
		dataForm.inRate = Number(row.inRate)
		dataForm.onlineRate = Number(row.onlineRate)
		showUpdata.value = true
	} else {
		onReset()
		if (isAdd) {
			dataForm.parentUserId = row?.userId || ''
		}
	}
	visible.value = true
}

// 暴露初始化方法供外部调用
defineExpose({
	init
})
</script>
