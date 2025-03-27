<template>
	<el-dialog v-model="visible" title="修改" :close-on-click-modal="false" width="50%" @close="closeDialogHandle">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" @keyup.enter="submitHandle()">
			<el-form-item label="语言" prop="language">
				<el-select v-model="dataForm.language" placeholder="请选择语言" clearable>
					<el-option v-for="item in languageList" :key="item.value" :value="item.value" :label="item.label"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="内容" prop="content">
				<el-input v-model="dataForm.content" placeholder="请输入内容"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="closeDialogHandle">取消</el-button>
			<fetctButton :submit-handle="submitHandle" />
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { fetchUpdateGreet, UpdateGreetReq } from '@/api/social/greet'
import { ElMessage, FormInstance } from 'element-plus'
import { reactive, ref } from 'vue'
import fetctButton from '@/components/fetct-button/index.vue'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref<FormInstance>()

const dataForm = reactive<UpdateGreetReq>({
	id: 0,
	content: '',
	language: ''
})
const languageList = [
	{ label: 'English', value: 'en' },
	{ label: '简体中文', value: 'zh' },
	{ label: 'Indonesia', value: 'in' },
	{ label: 'Português', value: 'pt' },
	{ label: 'ไทย', value: 'th' },
	{ label: 'Tiếng Việt', value: 'vi' },
	{ label: '繁體中文', value: 'tc' }
]
const init = (row: UpdateGreetReq) => {
	visible.value = true
	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}
	if (row?.id) {
		Object.assign(dataForm, row)
	}
}

const closeDialogHandle = () => {
	visible.value = false
	dataForm.id = 0
	dataForm.content = ''
	dataForm.language = ''
}

const dataRules = ref({})

// 表单提交
const submitHandle = async () => {
	const validationResult = await dataFormRef.value?.validate()
	if (!validationResult) {
		return
	}
	// 调用接口添加数据
	const res = await fetchUpdateGreet(dataForm)
	if (res) {
		ElMessage.success({
			message: '操作成功',
			duration: 500,
			onClose: () => {
				closeDialogHandle()
				emit('refreshDataList')
			}
		})
	}
}
defineExpose({
	init
})
</script>
