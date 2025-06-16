<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" :title="!dataForm.id ? $t('add') : $t('edit')" draggable width="30%">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="auto" style="margin-top: 20px" @keyup.enter="submitHandle()">
			<el-form-item label="提现类型" prop="type">
				<fast-dict-select v-model="dataForm.type" dict-type="pay_platform_config_type" placeholder="提现类型"></fast-dict-select>
			</el-form-item>
			<el-form-item label="名称" prop="name">
				<el-input v-model="dataForm.name" placeholder="名称" />
			</el-form-item>
			<el-form-item label="编码" prop="code">
				<el-input v-model="dataForm.code" placeholder="编码" />
			</el-form-item>
			<el-form-item label="汇率" prop="exchangeRate">
				<el-input v-model="dataForm.exchangeRate" placeholder="汇率" />
			</el-form-item>
			<el-form-item label="最大金额" prop="maxAmount">
				<el-input-number v-model="dataForm.maxAmount" :min="0" placeholder="请输入单次提现最大金额，不能小于零" precision="0"></el-input-number>
			</el-form-item>
			<el-form-item label="最小金额" prop="minAmount">
				<el-input-number v-model="dataForm.minAmount" :min="0" :precision="0" placeholder="请输入单次提现最小金额，不能小于零"></el-input-number>
			</el-form-item>
			<el-form-item label="序号" prop="sort">
				<el-input-number v-model="dataForm.sort" :min="0" placeholder="排序码，也用作权重标记"></el-input-number>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-switch
					v-model="dataForm.status"
					inline-prompt
					:active-value="0"
					active-text="正常"
					:inactive-value="1"
					inactive-text="禁用"
					style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
				/>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="closeDialogHandle">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { APIWithdrawPlatformConfigSubmit } from '@/api/config/setting'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)

const visibleEdit = ref(false)

const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	name: '',
	code: '',
	type: '',
	sort: 1,
	exchangeRate: '',
	status: 0,
	maxAmount: 0,
	minAmount: 0
})

const init = (row?: any) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (row) {
		visibleEdit.value = false
		Object.assign(dataForm, row)
	} else {
		dataForm.name = ''
		dataForm.code = ''
		dataForm.type = ''
		dataForm.minAmount = 0
		dataForm.maxAmount = 0
		visibleEdit.value = true
	}
}

const closeDialogHandle = () => {
	visible.value = false
}

const dataRules = ref({
	name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	code: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	type: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	status: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	exchangeRate: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	maxAmount: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	minAmount: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = async () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		APIWithdrawPlatformConfigSubmit(dataForm).then(() => {
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
