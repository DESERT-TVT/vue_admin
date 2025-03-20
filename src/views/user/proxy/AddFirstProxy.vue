<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" title="设置一级代理" :width="500" @close="onReset">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="150px" @keyup.enter="onSubmit">
			<el-form-item label="用户id" prop="userId">
				<el-input v-model="dataForm.userId" placeholder="请输入用户Id" />
			</el-form-item>
			<el-form-item label="用户消费分成比例" prop="userRate">
				<el-input-number
					v-model="dataForm.userRate"
					style="width: 100%"
					:step="0.01"
					max="1"
					min="0"
					type="number"
					placeholder="请输入用户消费分成比例"
					@change="onChangeUserRate"
				/>
			</el-form-item>
			<el-form-item label="主播收益分成比例" prop="anchorRate">
				<el-input-number
					v-model="dataForm.anchorRate"
					style="width: 100%"
					:step="0.01"
					max="1"
					min="0"
					type="number"
					placeholder="请输入主播收益分成比例"
					@change="onChangeAnchorRate"
				/>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="onCloseDialog">取消</el-button>
			<el-button v-auth="'sys:contact:modify'" type="primary" @click="onSubmit">确定</el-button>
		</template>
	</el-dialog>
</template>
<script setup lang="ts">
import { fetchAddProxy, ProxyAddReq } from '@/api/user/proxy'
import { ElMessage, FormInstance } from 'element-plus'
import { reactive, ref } from 'vue'

const visible = ref(false)
const dataFormRef = ref<FormInstance>()
const dataForm = reactive({
	userId: '',
	userRate: 0,
	anchorRate: 0
})
const dataRules = reactive({
	userId: [{ required: true, message: '请输入用户Id', trigger: 'blur' }]
})
const handleRateChange = (value: string, field: 'userRate' | 'anchorRate') => {
	const numValue = parseFloat(value)
	const validValue = isNaN(numValue) ? 0 : parseFloat(numValue.toFixed(2))
	dataForm[field] = Math.min(1, Math.max(0, validValue))
}
const onChangeUserRate = (value: string) => {
	handleRateChange(value, 'userRate')
}

// 主播分成比例改变的处理函数
const onChangeAnchorRate = (value: string) => {
	handleRateChange(value, 'anchorRate')
}
const onReset = () => {
	dataForm.userId = ''
	dataForm.userRate = 0
	dataForm.anchorRate = 0
	dataFormRef.value?.resetFields()
}
const onCloseDialog = () => {
	visible.value = false
}
// 定义一个将比率转换为百分比字符串的函数
const convertRateToPercentage = (rate: string | number): string => {
	const parsedRate = typeof rate === 'string' ? parseFloat(rate) : rate
	return isNaN(parsedRate) ? '0' : (parsedRate * 100).toFixed(0)
}

const onSubmit = async () => {
	// // 创建一个新的 Map 对象
	// const type2RateMap = new Map<number, string>()
	// type2RateMap.set(1, convertRateToPercentage(dataForm.userRate))
	// type2RateMap.set(2, convertRateToPercentage(dataForm.anchorRate))
	// const mapToObject = Object.fromEntries(type2RateMap)
	if (!dataForm.userRate || !dataForm.anchorRate) {
		ElMessage.warning('请输入用户消费分成比例或主播收益分成比例')
		return
	}
	const res = await dataFormRef.value?.validate()
	if (!res) {
		return
	}
	const type2RateObject: Record<number, string> = {
		1: convertRateToPercentage(dataForm.userRate),
		2: convertRateToPercentage(dataForm.anchorRate)
	}
	// 生成符合 ProxyAddReq 接口的对象
	const params: ProxyAddReq = {
		userId: dataForm.userId,
		type2Rate: type2RateObject
	}
	fetchAddProxy(params).then(res => {
		if (res) {
			ElMessage.success('设置成功')
			onCloseDialog()
		}
	})
}
const init = () => {
	onReset()
	visible.value = true
}
defineExpose({
	init
})
</script>
