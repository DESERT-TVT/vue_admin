<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('edit')" :close-on-click-modal="false" draggable width="30%">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="auto" style="margin-top: 20px" @keyup.enter="submitHandle()">
			<el-form-item label="支付类型" prop="payType">
				<fast-dict-select v-model="dataForm.payType" dict-type="pay_platform_config_type" placeholder="支付类型"></fast-dict-select>
			</el-form-item>
			<el-form-item label="名称" prop="name">
				<el-input v-model="dataForm.name" placeholder="名称" />
			</el-form-item>
			<el-form-item label="商户ID" prop="merchantId">
				<el-input v-model="dataForm.merchantId" placeholder="商户ID" />
			</el-form-item>
			<el-form-item label="商户密钥" prop="merchantKey">
				<el-input v-model="dataForm.merchantKey" placeholder="商户密钥" />
			</el-form-item>
			<el-form-item label="通道" prop="channel">
				<el-input v-model="dataForm.channel" placeholder="通道" />
			</el-form-item>
			<el-form-item label="网关" prop="gateway">
				<el-input v-model="dataForm.gateway" placeholder="网关" />
			</el-form-item>
			<el-form-item label="最大金额" prop="maxAmount">
				<el-input-number v-model="dataForm.maxAmount" :min="1" placeholder="请输入单次支付最大金额，不能小于零" precision="0"></el-input-number>
			</el-form-item>
			<el-form-item label="最小金额" prop="minAmount">
				<el-input-number v-model="dataForm.minAmount" :min="1" :precision="0" placeholder="请输入单次支付最小金额，不能小于零"></el-input-number>
			</el-form-item>
			<el-form-item label="每日限额" prop="dailyQuota">
				<el-input v-model="dataForm.dailyQuota" placeholder="每日限额" />
			</el-form-item>
			<el-form-item label="序号" prop="sort">
				<el-input-number v-model="dataForm.sort" :min="0" placeholder="排序码，也用作权重标记"></el-input-number>
			</el-form-item>
			<el-form-item label="文档地址" prop="docUrl">
				<el-input v-model="dataForm.docUrl" placeholder="文档地址" />
			</el-form-item>
			<el-form-item label="标签" prop="tag">
				<el-input v-model="dataForm.tag" placeholder="如果是同一个支付平台，请使用相同的标签！" />
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
import { APIPayPlatformConfig, APIPayPlatformConfigSubmit } from '@/api/config/setting'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)

const visibleEdit = ref(false)

const dataFormRef = ref()

const coverFile = ref<any[]>([])

const dataForm = reactive({
	id: '',
	name: '',
	merchantId: '',
	merchantKey: '',
	channel: '',
	gateway: '',
	tag: '',
	minAmount: 0,
	maxAmount: 0,
	dailyQuota: 0,
	payType: '',
	docUrl: '',
	sort: ''
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		visibleEdit.value = false
		getPayPlatformConfig(id)
	} else {
		visibleEdit.value = true
	}
}

const getPayPlatformConfig = (id: number) => {
	APIPayPlatformConfig(id).then(res => {
		Object.assign(dataForm, res.data)
		coverFile.value.push({ url: res.data.images })
	})
}

const closeDialogHandle = () => {
	visible.value = false
}

const dataRules = ref({
	name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	merchantId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	merchantKey: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	channel: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	gateway: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	tag: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	minAmount: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	maxAmount: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	dailyQuota: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	payType: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	docUrl: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	sort: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = async () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		APIPayPlatformConfigSubmit(dataForm).then(() => {
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
