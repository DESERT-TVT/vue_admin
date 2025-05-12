<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" :title="!dataForm.id ? '新增' : '修改'" width="50%" @close="onCloseDialog">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="150px" @keyup.enter="submitHandle()">
			<el-form-item label="昵称" prop="userIds">
				<el-input v-model="dataForm.userIds" :readonly="dataForm.id" placeholder="用户id，支持输入多个，使用'，'分割" />
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-select v-model="dataForm.status" placeholder="请选择状态" clearable>
					<el-option :value="1" label="开启"></el-option>
					<el-option :value="0" label="关闭"></el-option>
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
import { DiscoveryPageRes, fetchDiscoveryAdd, fetchDiscoveryEdit } from '@/api/social/discovery'
import { ElMessage } from 'element-plus'
import fetctButton from '@/components/fetct-button/index.vue'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)

const dataFormRef = ref()

const dataForm = reactive({
	id: undefined as number | undefined,
	userIds: '',
	status: 1
})

const init = (row?: DiscoveryPageRes) => {
	visible.value = true
	if (row?.id) {
		dataForm.id = row.id
		dataForm.userIds = row.userId.toString()
	}
}
const onCloseDialog = () => {
	dataForm.id = undefined
	dataForm.userIds = ''
	dataForm.status = 1
	visible.value = false
}
const dataRules = ref({
	userIds: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	status: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = async () => {
	const valid = await dataFormRef.value.validate()
	if (!valid) {
		return
	}

	const userIds = dataForm.userIds
		.split(/[，,\s;]+/)
		.map(id => id.trim())
		.filter(id => id.length > 0)
	const params = {
		userIds,
		status: dataForm.status
	}
	let res
	if (dataForm.id) {
		res = await fetchDiscoveryEdit(params)
	} else {
		res = await fetchDiscoveryAdd(params)
	}
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
