<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" width="50%" @close="closeDialogHandle">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="礼物名称" prop="giftName">
				<el-input v-model="dataForm.giftName" placeholder="礼物名称" />
			</el-form-item>
			<el-form-item label="礼物价值" prop="giftValue">
				<el-input-number v-model="dataForm.giftValue" placeholder="礼物价值" min="0" />
			</el-form-item>
			<el-form-item prop="giftImg" label="图片" style="height: 150px">
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
			<el-form-item label="礼物类别" prop="category">
				<fast-dict-select v-model="dataForm.category" dict-type="social_gift_category" placeholder="礼物类别" style="width: 100%"></fast-dict-select>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="closeDialogHandle">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { bannerAdverformApi, bannerAdverformSubmitApi } from '@/api/social/socialBannerAdver'
import { giftFormApi, giftSubmitApi } from '@/api/social/socialGift'
import { Delete, Plus } from '@element-plus/icons-vue'
import { UploadInstance } from 'element-plus'
import { useUploadAwsApi } from '@/api/awsUpload'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const coverFile = ref<any[]>([])
const coverFileRef = ref<UploadInstance>()

const dataForm = reactive({
	id: '',
	giftName: '',
	giftValue: '',
	category: '',
	giftImg: ref<any>()
})
const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getSmsPlatform(id)
	}
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
	dataForm.giftImg = ref<any>()
}

const getSmsPlatform = (id: number) => {
	giftFormApi(id).then(res => {
		Object.assign(dataForm, res.data)
		coverFile.value.push({ url: res.data.giftImg })
	})
}

const dataRules = ref({
	giftName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	giftValue: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	category: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = async () => {
	// 上传封面图
	if (coverFile.value && coverFile.value.length > 0 && coverFile.value.at(0).raw) {
		let raw = coverFile.value.at(0).raw
		const suffix = raw.name.substring(raw.name.lastIndexOf('.'))
		await useUploadAwsApi(raw, suffix).then(r => (dataForm.giftImg = r))
	}

	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		giftSubmitApi(dataForm).then(() => {
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
