<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" :title="!dataForm.id ? '新增' : '修改'" width="50%" @close="closeDialogHandle">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="联系方式" prop="contactName">
				<el-input v-model="dataForm.contactName" placeholder="联系方式名称" />
			</el-form-item>
			<el-form-item label="图标" prop="contactIcon" style="height: 300px">
				<el-upload
					ref="coverFileRef"
					v-model:file-list="coverFile"
					:auto-upload="false"
					:limit="1"
					:on-exceed="coverFileExceed"
					action="#"
					list-type="picture-card"
				>
					<el-icon>
						<Plus />
					</el-icon>
					<template #file="{ file }">
						<img :src="(file as any).url" alt="" class="el-upload-list__item-thumbnail" />
						<span class="el-upload-list__item-actions">
							<span class="el-upload-list__item-delete" @click="handleCoverFileRemove">
								<el-icon><Delete /></el-icon>
							</span>
						</span>
					</template>
				</el-upload>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="closeDialogHandle">取消</el-button>
			<el-button v-auth="'sys:contact:modify'" type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { Delete, Plus } from '@element-plus/icons-vue'
import { UploadInstance } from 'element-plus'
import { useUploadAwsApi } from '@/api/awsUpload'
import { APIPostUserContactConfig } from '@/api/user/userManage'

const emit = defineEmits(['refreshDataList'])
const visible = ref(false)
const dataFormRef = ref()

const coverFile = ref<any[]>([])
const coverFileRef = ref<UploadInstance>()

const dataForm = reactive({
	id: '',
	contactName: '',
	contactIcon: ''
})
const init = (row: any) => {
	visible.value = true

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	dataForm.id = row.id
	dataForm.contactName = row.contactName
	dataForm.contactIcon = row.contactIcon
	coverFile.value.push({ url: [row.contactIcon] })
}

const closeDialogHandle = () => {
	visible.value = false
	handleCoverFileRemove()
}

const coverFileExceed = (file: any) => {
	coverFileRef.value!.clearFiles()
	coverFileRef.value!.handleStart(file[0])
}

const handleCoverFileRemove = () => {
	coverFileRef.value!.clearFiles()
	dataForm.contactIcon = ref<any>()
}

const dataRules = ref({
	contactName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	contactIcon: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = async () => {
	// 上传封面图
	if (coverFile.value && coverFile.value.length > 0 && coverFile.value.at(0).raw) {
		let raw = coverFile.value.at(0).raw
		const suffix = raw.name.substring(raw.name.lastIndexOf('.'))
		await useUploadAwsApi(raw, suffix).then(r => (dataForm.contactIcon = r))
	}

	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
	})
	console.log(dataForm)
	APIPostUserContactConfig(dataForm)
		.then((resp: any) => {
			if (resp.code === 0) {
				emit('refreshDataList')
			}
		})
		.finally(() => {
			visible.value = false
			emit('refreshDataList')
		})
}

defineExpose({
	init
})
</script>
