<template>
	<el-dialog v-model="visible" :title="!dataForm.level ? '新增' : '修改'" :close-on-click-modal="false" width="30%" @close="closeDialogHandle">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="等级" prop="level">
				<el-input-number v-model="dataForm.level" placeholder="等级" min="0" />
			</el-form-item>
			<el-form-item label="文字价格" prop="price">
				<el-input-number v-model="dataForm.textChatPrice" placeholder="文字价格" min="0" />
			</el-form-item>
			<el-form-item label="语音价格" prop="price">
				<el-input-number v-model="dataForm.voiceChatPrice" placeholder="语音价格" min="0" />
			</el-form-item>
			<el-form-item label="视频价格" prop="price">
				<el-input-number v-model="dataForm.videoChatPrice" placeholder="视频价格" min="0" />
			</el-form-item>
			<el-form-item label="扣费周期" prop="feePeriod">
				<el-input-number v-model="dataForm.feePeriod" placeholder="扣费周期" min="0" />
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

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	level: '',
	textChatPrice: '',
	voiceChatPrice: '',
	videoChatPrice: '',
	type: '',
	feePeriod: '',
	operateType: 1
})

const init = (row?: any) => {
	visible.value = true
	if (row) {
		dataForm.level = row.level
		dataForm.textChatPrice = row.textChatPrice
		dataForm.voiceChatPrice = row.voiceChatPrice
		dataForm.videoChatPrice = row.videoChatPrice
		dataForm.type = row.type
		dataForm.feePeriod = row.feePeriod
	}
}

const closeDialogHandle = () => {
	visible.value = false
	resetForm()
}
const resetForm = () => {
	;(dataForm.level = ''),
		(dataForm.textChatPrice = ''),
		(dataForm.voiceChatPrice = ''),
		(dataForm.videoChatPrice = ''),
		(dataForm.type = ''),
		(dataForm.feePeriod = '')
}
const dataRules = ref({
	level: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	textChatPrice: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	voiceChatPrice: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	videoChatPrice: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	type: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	feePeriod: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = async () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		APIAddOrUpdatePriceConfig(dataForm).then(() => {
			ElMessage.success({
				message: '操作成功',
				duration: 500,
				onClose: () => {
					closeDialogHandle()
					emit('refreshDataList')
				}
			})
		})
	})
}

defineExpose({
	init
})
</script>
