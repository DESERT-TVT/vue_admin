<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" width="30%">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="消息类型" prop="messageType">
				<fast-dict-select v-model="dataForm.messageType" dict-type="message_type" placeholder="消息类型" style="width: 100%"></fast-dict-select>
			</el-form-item>
			<el-form-item label="接收人" prop="messageType">
				<el-input v-model="dataForm.recipientId" placeholder="用户UID" />
			</el-form-item>
			<el-form-item label="内容">
				<el-input v-model="dataForm.content" type="textarea" />
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { sysMessageformSubmitApi } from '@/api/message/sysmessage'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	messageType: '',
	createTime: '',
	content: '',
	recipientId: ''
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''
	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}
}

const dataRules = ref({
	messageType: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		sysMessageformSubmitApi(dataForm).then(() => {
			ElMessage.success({
				message: '操作成功',
				duration: 500,
				onClose: () => {
					visible.value = false
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
