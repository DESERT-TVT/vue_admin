<template>
	<el-dialog v-model="visible" :title="!dataForm.title ? '新增' : '修改'" :close-on-click-modal="false" width="30%" @close="closeDialogHandle">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="标题" prop="title">
				<el-input v-model="dataForm.title" placeholder="标题" />
			</el-form-item>

			<el-form-item label="描述" prop="textContent">
				<el-input v-model="dataForm.textContent" placeholder="文字内容（描述）" />
			</el-form-item>

			<el-form-item label="数量" prop="quantity">
				<el-input-number v-model="dataForm.quantity" min="0" />
			</el-form-item>
			<el-form-item label="赠送数量" prop="giftQuantity">
				<el-input-number v-model="dataForm.giftQuantity" min="0" />
			</el-form-item>
			<el-form-item label="价格" prop="price">
				<el-input-number v-model="dataForm.price" min="0" />
			</el-form-item>
			<el-form-item label="原价" prop="originalPrice">
				<el-input-number v-model="dataForm.originalPrice" min="0" />
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

import { APIAddOrUpdateIntegralConfig, APIAddOrUpdateLevelExpConfig, APIModifyGoldCoinModify } from '@/api/config/setting'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	title: '',
	textContent: '',
	quantity: 0,
	giftQuantity: 0,
	price: 0,
	originalPrice: 0
})
const init = (row?: any) => {
	visible.value = true
	if (row) {
		dataForm.id = row.id
		dataForm.title = row.title
		dataForm.textContent = row.textContent
		dataForm.quantity = row.quantity
		dataForm.giftQuantity = row.giftQuantity
		dataForm.price = row.price
		dataForm.originalPrice = row.originalPrice
	}
}

const closeDialogHandle = () => {
	visible.value = false
	dataFormRef.value.resetFields()
	resetDataForm()
}
const resetDataForm = () => {
	dataForm.id = ''
	dataForm.title = ''
	dataForm.textContent = ''
	dataForm.quantity = 0
	dataForm.giftQuantity = 0
	dataForm.price = 0
	dataForm.originalPrice = 0
}
const dataRules = ref({
	title: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	textContent: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	quantity: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	giftQuantity: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	price: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	originalPrice: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = async () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		APIModifyGoldCoinModify(dataForm)
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
			.finally(() => {})
	})
}

defineExpose({
	init
})
</script>
