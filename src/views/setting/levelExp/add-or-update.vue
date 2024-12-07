<template>
	<el-dialog v-model="visible" :title="!dataForm.level ? '新增' : '修改'" :close-on-click-modal="false" width="30%" @close="closeDialogHandle">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="等级" prop="level">
				<el-input-number v-model="dataForm.level" placeholder="等级" min="0" />
			</el-form-item>
			<el-form-item label="经验" prop="price">
				<el-input-number v-model="dataForm.exp" placeholder="经验" min="0" />
			</el-form-item>
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
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { APIAddOrUpdatePriceConfig } from '@/api/config/chatPrice'
import { APIAddOrUpdateLevelExpConfig } from '@/api/config/setting'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	level: '',
	exp: '',
	type: ''
})
const options = [
	{ value: 'charm_level', label: '魅力等级' },
	{ value: 'rich_level', label: '财富等级' }
]

const getTypeLabel = (value: string | number): string => {
	const option = options.find(opt => opt.value === String(value))
	return option ? option.label : ''
}
const init = (row?: any) => {
	visible.value = true
	if (row) {
		dataForm.level = row.level
		dataForm.exp = row.exp
		dataForm.type = row.type
	} else {
		resetForm()
	}
}
const resetForm = () => {
	dataForm.level = ''
	dataForm.exp = ''
	dataForm.type = ''
}
const closeDialogHandle = () => {
	visible.value = false
	dataFormRef.value.resetFields()
	resetForm()
}

const dataRules = ref({
	level: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	exp: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	type: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = async () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		APIAddOrUpdateLevelExpConfig(dataForm)
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
