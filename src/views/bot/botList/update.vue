<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" title="修改用户信息" width="50%" @close="closeDialogHandle">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="150px" @keyup.enter="submitHandle()">
			<el-form-item label="昵称" prop="nickname" style="width: 300px">
				<el-input v-model="dataForm.nickname" placeholder="昵称" />
			</el-form-item>
			<el-form-item label="头像" prop="avatar" style="height: 150px">
				<el-upload
					ref="coverAvatarFileRef"
					v-model:file-list="coverAvatarFile"
					:auto-upload="false"
					:limit="1"
					:on-exceed="coverAvatarFileExceed"
					action="#"
					list-type="picture-card"
				>
					<el-icon>
						<Plus />
					</el-icon>
					<template #file="{ file }">
						<img :src="(file as any).url" alt="" class="el-upload-list__item-thumbnail" />
						<span class="el-upload-list__item-actions">
							<span class="el-upload-list__item-delete" @click="videoDialogHandle(file.url[0], true)">
								<el-icon><ZoomIn /></el-icon>
							</span>
							<span class="el-upload-list__item-delete" @click="handleAvatarFileRemove">
								<el-icon><Delete /></el-icon>
							</span>
						</span>
					</template>
				</el-upload>
			</el-form-item>
			<el-form-item label="相册" prop="images" style="height: 150px">
				<div class="scrollable-form-item">
					<el-upload
						ref="coverImageFileRef"
						v-model:file-list="coverImageFile"
						:auto-upload="false"
						:limit="10"
						:multiple="true"
						:on-exceed="coverImageFileExceed"
						action="#"
						list-type="picture-card"
					>
						<el-icon>
							<Plus />
						</el-icon>
						<template #file="{ file }">
							<div v-if="file.url[0].indexOf(';') != -1" style="width: 100%">
								<img :src="file.url[0].split(';')[1]" alt="" class="el-upload-list__item-thumbnail" />
								<span class="el-upload-list__item-actions">
									<span class="el-upload-list__item-delete" @click="videoDialogHandle(file.url[0], false)">
										<el-icon><VideoPlay /></el-icon>
									</span>
									<span class="el-upload-list__item-delete" @click="handleCoverImageFileRemove(file)">
										<el-icon><Delete /></el-icon>
									</span>
								</span>
							</div>
							<div v-else style="width: 100%">
								<img :src="(file as any).url" alt="" class="el-upload-list__item-thumbnail" />
								<span class="el-upload-list__item-actions">
									<span class="el-upload-list__item-delete" @click="videoDialogHandle(file.url[0], true)">
										<el-icon><ZoomIn /></el-icon>
									</span>
									<span class="el-upload-list__item-delete" @click="handleCoverImageFileRemove(file)">
										<el-icon><Delete /></el-icon>
									</span>
								</span>
							</div>
						</template>
					</el-upload>
				</div>
			</el-form-item>
			<el-form-item label="气质类型" prop="type">
				<el-checkbox-group v-for="(item, index) in temperamentList" :key="index" v-model="dataForm.temperamentLabel">
					<el-checkbox :label="item.labelName" :value="item.labelValue" />
				</el-checkbox-group>
			</el-form-item>
			<el-form-item label="性别" prop="gender" style="width: 300px">
				<fast-dict-select v-model="dataForm.gender" clearable dict-type="user_gender" placeholder="性别"></fast-dict-select>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="closeDialogHandle">取消</el-button>
			<el-button v-auth="'sys:user:update'" type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
	<!-- 视频弹窗 -->
	<video-dialog ref="videoDialogRef"></video-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage, UploadInstance } from 'element-plus/es'
import { Delete, Plus, VideoPlay, ZoomIn } from '@element-plus/icons-vue'
import { useUploadAwsApi } from '@/api/awsUpload'
import { Temperament } from '@/hooks/interface'
import { userPhotoListApi } from '@/api/user/userIdentification'
import { getUserTemperamentLabelApi, updateUserInfoApi } from '@/api/user/userManage'
import VideoDialog from '@/components/video-dialog/index.vue'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)

const dataFormRef = ref()

const coverAvatarFile = ref<any[]>([])
const coverAvatarFileRef = ref<UploadInstance>()

const coverImageFile = ref<any[]>([])
const coverImageFileRef = ref<UploadInstance>()

const temperamentList = ref<Temperament[]>([])

const dataForm = reactive({
	userId: '',
	userPhotoList: ref<any[]>([]),
	nickname: '',
	avatar: ref<any>(),
	temperamentLabel: ref<any[]>([]),
	gender: ''
})

const videoDialogRef = ref()
const videoDialogHandle = (row: any, isImg: boolean) => {
	let parms = {
		src: row.split(';')[0],
		poster: row.split(';')[1],
		isImg: isImg
	}
	videoDialogRef.value.init(parms)
}

const init = (row: any) => {
	visible.value = true
	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}
	dataForm.userPhotoList = []
	dataForm.userId = row.userId
	dataForm.nickname = row.nickname
	dataForm.gender = row.gender.toString()
	dataForm.avatar = row.avatar
	getUserTemperamentLabel(row.temperamentLabel)
	coverAvatarFile.value.push({ url: [row.avatar] })
	getUserPhoto(row.userId)
}

const getUserPhoto = (userId: number) => {
	userPhotoListApi({ targetId: userId, page: 1, limit: 999 }).then(res => {
		if (res.data.list.length != 0) {
			res.data.list.forEach((item: any) => {
				coverImageFile.value.push({ url: [item.photo] })
				dataForm.userPhotoList.push(item.photo)
			})
		}
	})
}

const getUserTemperamentLabel = (temperamentLabel: any) => {
	getUserTemperamentLabelApi({ type: 2 }).then(res => {
		temperamentList.value = res.data
		if (temperamentLabel) {
			let split = temperamentLabel.split(',')
			split.forEach((item: any) => {
				dataForm.temperamentLabel.push(item)
			})
		}
	})
}

const closeDialogHandle = () => {
	visible.value = false
	coverImageFileRef.value!.clearFiles()
	dataForm.temperamentLabel = []
	handleAvatarFileRemove()
}

const coverAvatarFileExceed = (file: any) => {
	coverAvatarFileRef.value!.clearFiles()
	coverAvatarFileRef.value!.handleStart(file[0])
}

const handleAvatarFileRemove = () => {
	coverAvatarFileRef.value!.clearFiles()
	dataForm.avatar = ref<any>()
}

const coverImageFileExceed = (file: any) => {
	coverImageFileRef.value!.clearFiles()
	coverImageFileRef.value!.handleStart(file[0])
}

const handleCoverImageFileRemove = (uploadFile: any) => {
	// 找到具有给定uid的文件的索引
	const index = coverImageFile.value.findIndex(file => file.uid === uploadFile.uid)
	if (index > -1) {
		// 使用splice删除找到的文件
		coverImageFile.value.splice(index, 1)
	}
	dataForm.userPhotoList = dataForm.userPhotoList.filter((item: any) => {
		return item != uploadFile.url[0]
	})
}

const dataRules = ref({
	// name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	// images: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	// type: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = async () => {
	// 上传相册
	if (coverImageFile.value && coverImageFile.value.length > 0) {
		for (let i = 0; i < coverImageFile.value.length; i++) {
			if (coverImageFile.value.at(i).raw) {
				let raw = coverImageFile.value.at(i).raw
				const suffix = raw.name.substring(raw.name.lastIndexOf('.'))
				await useUploadAwsApi(raw, suffix, dataForm.userPhotoList[i]).then(r => dataForm.userPhotoList.push(r))
			}
		}
	}
	// 上传头像
	if (coverAvatarFile.value && coverAvatarFile.value.length > 0 && coverAvatarFile.value.at(0).raw) {
		let raw = coverAvatarFile.value.at(0).raw
		const suffix = raw.name.substring(raw.name.lastIndexOf('.'))
		await useUploadAwsApi(raw, suffix).then(r => (dataForm.avatar = r))
		if (!dataForm.avatar) {
			ElMessage.error({
				message: '修改失败!',
				duration: 500,
				onClose: () => {
					closeDialogHandle()
					emit('refreshDataList')
				}
			})
			return
		}
	}

	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		updateUserInfoApi(dataForm).then(() => {
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

<style lang="scss" scoped>
.image-with-mask {
	position: relative;
	display: block;
	width: 100%; /* 调整宽度 */
	height: auto; /* 保持原始比例 */
}

.image-with-mask::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5); /* 黑色半透明蒙版 */
	display: flex;
	justify-content: center;
	align-items: center;
	pointer-events: none; /* 允许事件穿透 */
}

.image-with-mask::after {
	content: '';
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-image: url('@/icons/svg/play.svg'); /* 替换为你的播放图标路径 */
	background-size: 30px; /* 调整图标大小 */
	width: 30px; /* 图标宽度 */
	height: 30px; /* 图标高度 */
	z-index: 0;
	pointer-events: none; /* 允许事件穿透 */
}

.scrollable-form-item {
	height: 100%;
	overflow-x: auto;
	white-space: nowrap; /* 防止文本换行，保持内容在一行内 */
}

/* 自定义滚动条样式（仅限 Webkit 浏览器） */
.scrollable-form-item::-webkit-scrollbar {
	height: 10px; /* 滚动条高度 */
}

.scrollable-form-item::-webkit-scrollbar-track {
	background-color: #f1f1f1; /* 轨道背景颜色 */
}

.scrollable-form-item::-webkit-scrollbar-thumb {
	background-color: #888; /* 滚动条颜色 */
	border-radius: 5px; /* 滚动条圆角 */
}

.scrollable-form-item::-webkit-scrollbar-thumb:hover {
	background-color: #555; /* 鼠标悬停时滚动条颜色 */
}

:deep(.el-upload-list--picture-card .el-upload-list__item-thumbnail) {
	object-fit: cover;
}
</style>
