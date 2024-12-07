<template>
	<el-dialog v-model="visible" :title="!dataForm.integral ? '新增' : '修改'" :close-on-click-modal="false" width="30%" @close="closeDialogHandle">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="积分数量" prop="level">
				<el-input-number v-model="dataForm.integral" placeholder="积分数量" min="0" />
			</el-form-item>
			<!--			<el-form-item label="兑换数量" prop="price">-->
			<!--				<el-input-number v-model="dataForm.settle" placeholder="兑换数量" min="0" />-->
			<!--			</el-form-item>-->
			<el-form-item label="类型" prop="type">
				<el-select v-model="dataForm.type" placeholder="请选择类型">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="closeDialogHandle">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'

import { APIAddOrUpdateIntegralConfig } from '@/api/config/setting'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	integral: '',
	settle: '',
	type: ''
})
const options = [
	{ value: 'integral2coin', label: '积分换金币' },
	{ value: 'integral2cache', label: '积分提现' }
]

const getTypeLabel = (value: string | number): string => {
	const option = options.find(opt => opt.value === String(value))
	return option ? option.label : ''
}
const init = (row?: any) => {
	visible.value = true
	if (row) {
		dataForm.id = row.id
		dataForm.integral = row.integral
		dataForm.settle = row.settle
		dataForm.type = row.type
	}
}

const closeDialogHandle = () => {
	visible.value = false
	dataFormRef.value.resetFields()
	dataForm.id = ''
	integral: ''
	settle: ''
	type: ''
}

const dataRules = ref({
	integral: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	settle: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	type: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = async () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		APIAddOrUpdateIntegralConfig(dataForm)
			.then(() => {
				ElMessage.success({
					message: '操作成功',
					duration: 500,
					onClose: () => {
						closeDialogHandle()
						emit('refreshDataList')
					}
				})
			})
			.catch(() => {
				ElMessage.error('操作失败')
			})
			.finally(() => {
				dataFormRef.value.resetFields()
			})
	})
}

defineExpose({
	init
})
</script>
