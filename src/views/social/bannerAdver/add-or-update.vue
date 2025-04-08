<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" width="30%" @close="closeDialogHandle">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="名称" prop="name">
				<el-input v-model="dataForm.name" placeholder="名称" />
			</el-form-item>
			<el-form-item prop="images" label="图片" style="height: 150px">
				<el-upload
					ref="coverFileRef"
					v-model:file-list="coverFile"
					:auto-upload="false"
					:on-exceed="coverFileExceed"
					action="#"
					:limit="1"
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
			<el-form-item label="跳转链接" prop="jumpUrl">
				<el-input v-model="dataForm.jumpUrl" placeholder="平台内模块为路由path ,平台外则为url" />
			</el-form-item>
			<div v-if="visibleEdit">
				<el-form-item label="广告类别" prop="type">
					<fast-dict-select
						v-model="dataForm.type"
						dict-type="social_banner_adver_type"
						placeholder="广告类别"
						style="width: 100%"
					></fast-dict-select>
				</el-form-item>
				<el-form-item label="广告状态" prop="status">
					<el-select v-model="dataForm.status" placeholder="请选择" style="width: 100%">
						<el-option label="不可见" value="0"></el-option>
						<el-option label="可见" value="1"></el-option>
					</el-select>
				</el-form-item>
			</div>
		</el-form>
		<template #footer>
			<el-button @click="closeDialogHandle">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, UploadInstance } from 'element-plus/es'
import { bannerAdverformApi, bannerAdverformSubmitApi } from '@/api/social/socialBannerAdver'
import { Delete, Plus } from '@element-plus/icons-vue'
import { useUploadOssApi } from '@/api/upload'
import { useUploadAwsApi } from '@/api/awsUpload'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)

const visibleEdit = ref(false)

const dataFormRef = ref()

const coverFile = ref<any[]>([])
const coverFileRef = ref<UploadInstance>()

const dataForm = reactive({
	id: '',
	type: '',
	images: ref<any>(),
	name: '',
	jumpUrl: '',
	status: '0'
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
		getBannerAdverform(id)
	} else {
		visibleEdit.value = true
	}
}

const getBannerAdverform = (id: number) => {
	bannerAdverformApi(id).then(res => {
		Object.assign(dataForm, res.data)
		coverFile.value.push({ url: res.data.images })
	})
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
	dataForm.images = ref<any>()
}

const dataRules = ref({
	name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	images: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	type: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = async () => {
	// 上传封面图
	if (coverFile.value && coverFile.value.length > 0 && coverFile.value.at(0).raw) {
		let raw = coverFile.value.at(0).raw
		const suffix = raw.name.substring(raw.name.lastIndexOf('.'))
		await useUploadOssApi(raw, 'cover/', null, suffix).then(r => (dataForm.images = r))
		// await useUploadAwsApi(raw, suffix).then(r => (dataForm.images = r))
	}

	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		bannerAdverformSubmitApi(dataForm).then(() => {
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
