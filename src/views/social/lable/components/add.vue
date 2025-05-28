<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" title="新增" width="50%" @close="onCloseDialog">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="150px" @keyup.enter="submitHandle">
			<el-form-item label="标签名" prop="labelName">
				<el-input v-model="dataForm.labelName" placeholder="请输入标签名" type="text" clearable />
			</el-form-item>
			<el-form-item label="标签类型" prop="labelType">
				<el-select v-model="dataForm.labelType" placeholder="请输入标签类型" clearable>
					<el-option :value="1" label="个性标签"></el-option>
					<el-option :value="2" label="我会的表演"></el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="onCloseDialog">取消</el-button>
			<fetctButton :submit-handle="submitHandle" />
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import fetctButton from '@/components/fetct-button/index.vue'
import { fetchLableAdd } from '@/api/social/lable'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)

const dataFormRef = ref()

const dataForm = reactive({
	labelType: 1,
	labelName: ''
})

const init = () => {
	visible.value = true
	dataForm.labelName = ''
	dataForm.labelType = 1
}
const onCloseDialog = () => {
	dataForm.labelName = ''
	dataForm.labelType = 1
	visible.value = false
}
const dataRules = ref({
	labelType: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	labelName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = async () => {
	const valid = await dataFormRef.value.validate()
	if (!valid) {
		return
	}
	const res = await fetchLableAdd(dataForm)
	if (res) {
		ElMessage.success({
			message: '操作成功',
			duration: 500,
			onClose: () => {
				onCloseDialog()
				emit('refreshDataList')
			}
		})
	}
}

defineExpose({
	init
})
</script>

<style lang="scss" scoped></style>
