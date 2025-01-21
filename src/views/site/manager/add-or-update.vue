<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" :title="!dataForm.id ? '新增' : '修改'" width="30%" @close="closeDialogHandle">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="120px" @keyup.enter="submitHandle()">
			<el-form-item label="站点名称" prop="siteName">
				<el-input v-model="dataForm.siteName" placeholder="站点名称" />
			</el-form-item>

			<el-form-item label="域名" prop="domain">
				<el-input v-model="dataForm.domain" placeholder="域名" />
			</el-form-item>

			<el-form-item label="平台收益率" prop="siteProfitRate">
				<el-input-number v-model="dataForm.siteProfitRate" :max="1" :min="0" :precision="2" :step="0.01" controls-position="right" />
			</el-form-item>

			<el-form-item label="跨站用户收益率" prop="siteUserProfitRate">
				<el-input-number v-model="dataForm.siteUserProfitRate" :max="1" :min="0" :precision="2" :step="0.01" controls-position="right" />
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="closeDialogHandle">取消</el-button>
			<el-button v-auth="'sys:site:modify'" type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { APIModifySite } from '@/api/site/site'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)

const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	domain: '',
	siteName: '',
	siteProfitRate: '',
	siteUserProfitRate: ''
})

const init = (row: any) => {
	visible.value = true
	if (row) {
		dataForm.id = row.id
		dataForm.domain = row.domain
		dataForm.siteName = row.siteName
		dataForm.siteProfitRate = row.siteProfitRate
		dataForm.siteUserProfitRate = row.siteUserProfitRate
	} else {
		dataForm.id = ''
		dataForm.domain = ''
		dataForm.siteName = ''
		dataForm.siteProfitRate = ''
		dataForm.siteUserProfitRate = ''
	}
}

const closeDialogHandle = () => {
	visible.value = false
}

const dataRules = ref({
	domain: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	siteName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	siteProfitRate: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	siteUserProfitRate: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = async () => {
	await dataFormRef.value.validate()
	APIModifySite(dataForm).then((resp: any) => {
		if (resp.code === 0) {
			visible.value = false
			ElMessage.success('操作成功')
			emit('getDataList')
		}
	})
}

defineExpose({
	init
})
</script>
