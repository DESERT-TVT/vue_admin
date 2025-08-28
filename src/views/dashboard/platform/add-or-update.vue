<template>
	<el-dialog v-model="visible" :title="!dataForm.name ? $t('add') : $t('edit')" :close-on-click-modal="false" draggable width="30%">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="auto" style="margin-top: 20px">
			<el-form-item label="平台名称" prop="name">
				<el-input v-model="dataForm.name" placeholder="请输入平台名称" clearable></el-input>
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
import { useI18n } from 'vue-i18n'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { addPlatformSubmitApi, updatePlatformSubmitApi } from '@/api/dataStatistics'

const { t } = useI18n()

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const init = (row?: any) => {
	visible.value = true
	if(row){
		dataForm.id = row.id
		dataForm.name = row.name
	}
}

const dataFormRef = ref<FormInstance>()
const dataForm = reactive({
	name: ref<any>(),
	id: ref<any>()
})

const dataRules = reactive<FormRules<typeof dataForm>>({
	name: [{ required: true, message: t('required'), trigger: 'submit' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value?.validate((valid: boolean) => {
		if (!valid) {
			return
		}
		if (dataForm.id) {
			updatePlatformSubmitApi(dataForm).then(() => {
				ElMessage.success({
					message: '操作成功',
					duration: 1000,
					onClose: () => {
						visible.value = false
						emit('refreshDataList')
					}
				})
			})
		} else {
			addPlatformSubmitApi(dataForm).then(() => {
				ElMessage.success({
					message: '操作成功',
					duration: 1000,
					onClose: () => {
						visible.value = false
						emit('refreshDataList')
					}
				})
			})
		}
	})
}

defineExpose({
	init
})
</script>
