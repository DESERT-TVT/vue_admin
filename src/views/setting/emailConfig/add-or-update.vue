<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('edit')" :close-on-click-modal="false" draggable width="30%">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="auto" style="margin-top: 20px">
			<el-form-item label="服务器地址" prop="host">
				<el-input v-model="dataForm.host" placeholder="请输入服务器地址" clearable></el-input>
			</el-form-item>
			<el-form-item label="服务器端口" prop="port">
				<el-input v-model="dataForm.port" placeholder="请输入服务器端口" clearable></el-input>
			</el-form-item>
			<el-form-item label="发送方名称" prop="from">
				<el-input v-model="dataForm.from" placeholder="请输入发送方名称" clearable></el-input>
			</el-form-item>
			<el-form-item label="用户名" prop="username">
				<el-input v-model="dataForm.username" placeholder="请输入用户名" clearable></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input v-model="dataForm.password" placeholder="请输入密码" clearable></el-input>
			</el-form-item>
			<el-form-item label="启用SSL" prop="sslEnable">
				<fast-dict-radio v-model="dataForm.sslEnable" dict-type="enable_disable"></fast-dict-radio>
			</el-form-item>
			<el-form-item label="每日发送上限" prop="dailyTotal">
				<el-input v-model="dataForm.dailyTotal" placeholder="请输入每日发送上限" clearable></el-input>
			</el-form-item>

			<el-form-item label="状态" prop="status">
				<fast-dict-radio v-model="dataForm.status" dict-type="enable_disable"></fast-dict-radio>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { useEmailConfigSubmitApi } from '@/api/config/setting'
import { nextTick, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, FormInstance, FormRules } from 'element-plus'

const { t } = useI18n()

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const init = (row?: any) => {
	visible.value = true
	dataForm.id = ref<any>()

	// 重置表单数据
	dataFormRef.value?.resetFields()

	if (row) {
		nextTick(() => {
			Object.assign(dataForm, row)
		})
	}
}

const dataFormRef = ref<FormInstance>()
const dataForm = reactive({
	id: ref<any>(),
	host: ref<any>(),
	port: ref<any>(),
	from: ref<any>(),
	username: ref<any>(),
	password: ref<any>(),
	sslEnable: 1,
	dailyTotal: ref<any>(),
	status: 0
})

const dataRules = reactive<FormRules<typeof dataForm>>({
	host: [{ required: true, message: t('required'), trigger: 'submit' }],
	port: [{ required: true, message: t('required'), trigger: 'submit' }],
	from: [{ required: true, message: t('required'), trigger: 'submit' }],
	username: [{ required: true, message: t('required'), trigger: 'submit' }],
	password: [{ required: true, message: t('required'), trigger: 'submit' }],
	dailyTotal: [{ required: true, message: t('required'), trigger: 'submit' }],
	sslEnable: [{ required: true, message: t('required'), trigger: 'submit' }],
	status: [{ required: true, message: t('required'), trigger: 'submit' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value?.validate((valid: boolean) => {
		if (!valid) {
			return
		}

		useEmailConfigSubmitApi(dataForm).then(() => {
			ElMessage.success({
				message: '操作成功',
				duration: 1000,
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
