<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query">
				<el-form ref="queryRef" :inline="true" :model="state.queryForm">
					<el-form-item prop="userId">
						<el-input v-model="state.queryForm.userId" clearable placeholder="UID"></el-input>
					</el-form-item>
					<el-form-item prop="status">
						<fast-dict-select v-model="state.queryForm.status" dict-type="identification_status" clearable placeholder="审核状态"></fast-dict-select>
					</el-form-item>
					<el-form-item>
						<el-button v-auth="'sys:ident:list'" icon="Search" type="primary" @click="getDataList()">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button icon="RefreshRight" @click="reset(queryRef)">重置</el-button>
					</el-form-item>
				</el-form>
			</el-card>
			<el-card>
				<el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
					<el-tab-pane label="主播认证申请" name="3">
						<el-table
							v-loading="state.dataListLoading"
							show-overflow-tooltip
							:data="state.dataList"
							border
							class="layout-table"
							height="65vh"
							@selection-change="selectionChangeHandle"
						>
							<el-table-column type="selection" header-align="center" align="center" width="38"></el-table-column>
							<el-table-column prop="userId" label="UID" header-align="center" align="center"></el-table-column>
							<el-table-column prop="name" label="昵称" header-align="center" align="center"></el-table-column>
							<el-table-column prop="email" label="邮箱" header-align="center" align="center"></el-table-column>
							<el-table-column prop="weChat" label="微信" header-align="center" align="center"></el-table-column>
							<el-table-column align="center" header-align="center" label="昵称" width="150">
								<template #default="scope">
									<el-popover :width="383" placement="right" trigger="hover">
										<template #reference>
											<el-image :src="scope.row.avatar" style="margin-top: 7px; height: 60px; border-radius: 6px" />
										</template>
										<template #default>
											<el-image :src="scope.row.avatar" style="width: 356px" />
										</template>
									</el-popover>
									<br />
									{{ scope.row.nickname }}
								</template>
							</el-table-column>
							<fast-dict-column prop="type" label="申请类型" dict-type="identification_type"></fast-dict-column>
							<el-table-column prop="fileUrl" label="提交资料" header-align="center" align="center" width="150px">
								<template #default="scope">
									<div v-if="scope.row?.fileUrl">
										<el-image
											v-if="scope.row.type == 1"
											:initial-index="0"
											:max-scale="7"
											:min-scale="0.2"
											:preview-src-list="[scope.row?.fileUrl]"
											:preview-teleported="true"
											:src="scope.row?.fileUrl"
											:zoom-rate="1.2"
											fit="cover"
											style="margin-top: 7px; width: 100px; height: 100px; border-radius: 6px"
										/>
										<div v-else-if="scope.row.type == 2 || scope.row.type == 3" style="margin-left: 15px">
											<el-image
												:src="scope.row?.fileUrl?.split(';')[1]"
												class="image-with-mask"
												style="margin-top: 7px; width: 100px; height: 100px; border-radius: 6px; cursor: pointer"
												@click="videoDialogHandle(scope.row, false)"
											/>
										</div>
										<el-icon v-else>
											<icon-picture />
										</el-icon>
									</div>
								</template>
							</el-table-column>
							<el-table-column label="个人信息" header-align="center" align="center">
								<template #default="scope">
									<span>{{ scope.row.gender == 1 ? '女' : '男' }}</span
									><br />
									<span>{{ scope.row.age }}</span
									><br />
									<span>{{ scope.row.height + 'cm' }}</span
									><br />
									<span>{{ scope.row.weight + 'kg' }}</span>
								</template>
							</el-table-column>
							<el-table-column label="相册" header-align="center" align="center">
								<template #default="scope">
									<el-button type="primary" link @click="seePhoto(scope.row.userId)">查看</el-button>
								</template>
							</el-table-column>
							<fast-dict-column prop="status" label="审核状态" dict-type="identification_status"></fast-dict-column>
							<el-table-column prop="createTime" label="申请时间" header-align="center" align="center"></el-table-column>
							<el-table-column prop="updateTime" label="审批时间" header-align="center" align="center"></el-table-column>
							<el-table-column prop="updaterName" label="操作人" header-align="center" align="center"></el-table-column>
							<el-table-column label="操作" fixed="right" header-align="center" align="center" width="120">
								<template #default="scope">
									<el-button v-if="scope.row.status == 0" v-auth="'sys:ident:edit'" type="primary" link @click="submitForm(1, scope.row)"
										>通过
									</el-button>
									<el-button v-if="scope.row.status == 0" v-auth="'sys:ident:edit'" type="primary" link @click="auditHandle(scope.row)"
										>拒绝
									</el-button>
								</template>
							</el-table-column>
						</el-table>
						<el-pagination
							:current-page="state.page"
							:page-sizes="state.pageSizes"
							:page-size="state.limit"
							:total="state.total"
							layout="total, sizes, prev, pager, next, jumper"
							@size-change="sizeChangeHandle"
							@current-change="currentChangeHandle"
						>
						</el-pagination>
					</el-tab-pane>
					<el-tab-pane label="女神认证申请" name="2">
						<el-table
							v-loading="state.dataListLoading"
							show-overflow-tooltip
							:data="state.dataList"
							border
							class="layout-table"
							height="65vh"
							@selection-change="selectionChangeHandle"
						>
							<el-table-column type="selection" header-align="center" align="center" width="38"></el-table-column>
							<el-table-column prop="userId" label="UID" header-align="center" align="center"></el-table-column>
							<el-table-column align="center" header-align="center" label="昵称" width="150">
								<template #default="scope">
									<el-popover :width="383" placement="right" trigger="hover">
										<template #reference>
											<el-image :src="scope.row.avatar" style="margin-top: 7px; height: 60px; border-radius: 6px" />
										</template>
										<template #default>
											<el-image :src="scope.row.avatar" style="width: 356px" />
										</template>
									</el-popover>
									<br />
									{{ scope.row.nickname }}
								</template>
							</el-table-column>
							<fast-dict-column prop="type" label="申请类型" dict-type="identification_type"></fast-dict-column>
							<el-table-column prop="fileUrl" label="提交资料" header-align="center" align="center" width="150px">
								<template #default="scope">
									<div v-if="scope.row?.fileUrl">
										<el-image
											v-if="scope.row.type == 1"
											:initial-index="0"
											:max-scale="7"
											:min-scale="0.2"
											:preview-src-list="[scope.row?.fileUrl]"
											:preview-teleported="true"
											:src="scope.row?.fileUrl"
											:zoom-rate="1.2"
											fit="cover"
											style="margin-top: 7px; width: 100px; height: 100px; border-radius: 6px"
										/>
										<div v-else-if="scope.row.type == 2 || scope.row.type == 3" style="margin-left: 15px">
											<el-image
												:src="scope.row?.fileUrl?.split(';')[1]"
												class="image-with-mask"
												style="margin-top: 7px; width: 100px; height: 100px; border-radius: 6px; cursor: pointer"
												@click="videoDialogHandle(scope.row, false)"
											/>
										</div>
										<el-icon v-else>
											<icon-picture />
										</el-icon>
									</div>
								</template>
							</el-table-column>
							<el-table-column label="个人信息" header-align="center" align="center">
								<template #default="scope">
									<span>{{ scope.row.gender == 1 ? '女' : '男' }}</span
									><br />
									<span>{{ scope.row.age }}</span
									><br />
									<span>{{ scope.row.height + 'cm' }}</span
									><br />
									<span>{{ scope.row.weight + 'kg' }}</span>
								</template>
							</el-table-column>
							<el-table-column label="相册" header-align="center" align="center">
								<template #default="scope">
									<el-button type="primary" link @click="seePhoto(scope.row.userId)">查看</el-button>
								</template>
							</el-table-column>
							<fast-dict-column prop="status" label="审核状态" dict-type="identification_status"></fast-dict-column>
							<!--            <el-table-column prop="failureReason" label="拒绝原因" header-align="center" align="center"></el-table-column>-->
							<el-table-column prop="createTime" label="申请时间" header-align="center" align="center"></el-table-column>
							<el-table-column prop="updateTime" label="审批时间" header-align="center" align="center"></el-table-column>
							<el-table-column prop="updaterName" label="操作人" header-align="center" align="center"></el-table-column>
							<el-table-column label="操作" fixed="right" header-align="center" align="center" width="120">
								<template #default="scope">
									<el-button v-if="scope.row.status == 0" v-auth="'sys:ident:edit'" type="primary" link @click="submitForm(1, scope.row)"
										>通过
									</el-button>
									<el-button v-if="scope.row.status == 0" v-auth="'sys:ident:edit'" type="primary" link @click="auditHandle(scope.row)"
										>拒绝
									</el-button>
								</template>
							</el-table-column>
						</el-table>
						<el-pagination
							:current-page="state.page"
							:page-sizes="state.pageSizes"
							:page-size="state.limit"
							:total="state.total"
							layout="total, sizes, prev, pager, next, jumper"
							@size-change="sizeChangeHandle"
							@current-change="currentChangeHandle"
						>
						</el-pagination>
					</el-tab-pane>
					<el-tab-pane label="真人认证申请" name="1">
						<el-table
							v-loading="state.dataListLoading"
							show-overflow-tooltip
							:data="state.dataList"
							border
							class="layout-table"
							height="65vh"
							@selection-change="selectionChangeHandle"
						>
							<el-table-column type="selection" header-align="center" align="center" width="38"></el-table-column>
							<el-table-column prop="userId" label="UID" header-align="center" align="center"></el-table-column>
							<el-table-column align="center" header-align="center" label="昵称" width="150">
								<template #default="scope">
									<el-popover :width="383" placement="right" trigger="hover">
										<template #reference>
											<el-image :src="scope.row.avatar" style="margin-top: 7px; height: 60px; border-radius: 6px" />
										</template>
										<template #default>
											<el-image :src="scope.row.avatar" style="width: 356px" />
										</template>
									</el-popover>
									<br />
									{{ scope.row.nickname }}
								</template>
							</el-table-column>
							<fast-dict-column prop="type" label="申请类型" dict-type="identification_type"></fast-dict-column>
							<el-table-column prop="fileUrl" label="提交资料" header-align="center" align="center" width="150px">
								<template #default="scope">
									<div v-if="scope.row?.fileUrl">
										<el-image
											v-if="scope.row.type == 1"
											:initial-index="0"
											:max-scale="7"
											:min-scale="0.2"
											:preview-src-list="[scope.row?.fileUrl]"
											:preview-teleported="true"
											:src="scope.row?.fileUrl"
											:zoom-rate="1.2"
											fit="cover"
											style="margin-top: 7px; width: 100px; height: 100px; border-radius: 6px"
										/>
										<div v-else-if="scope.row.type == 2 || scope.row.type == 3" style="margin-left: 15px">
											<el-image
												:src="scope.row?.fileUrl?.split(';')[1]"
												class="image-with-mask"
												style="margin-top: 7px; width: 100px; height: 100px; border-radius: 6px; cursor: pointer"
												@click="videoDialogHandle(scope.row, false)"
											/>
										</div>
										<el-icon v-else>
											<icon-picture />
										</el-icon>
									</div>
								</template>
							</el-table-column>
							<el-table-column label="个人信息" header-align="center" align="center">
								<template #default="scope">
									<span>{{ scope.row.gender == 1 ? '女' : '男' }}</span
									><br />
									<span>{{ scope.row.age }}</span
									><br />
									<span>{{ scope.row.height + 'cm' }}</span
									><br />
									<span>{{ scope.row.weight + 'kg' }}</span>
								</template>
							</el-table-column>
							<el-table-column label="相册" header-align="center" align="center">
								<template #default="scope">
									<el-button type="primary" link @click="seePhoto(scope.row.userId)">查看</el-button>
								</template>
							</el-table-column>
							<fast-dict-column prop="status" label="审核状态" dict-type="identification_status"></fast-dict-column>
							<!--            <el-table-column prop="failureReason" label="拒绝原因" header-align="center" align="center"></el-table-column>-->
							<el-table-column prop="createTime" label="申请时间" header-align="center" align="center"></el-table-column>
							<el-table-column prop="updateTime" label="审批时间" header-align="center" align="center"></el-table-column>
							<el-table-column prop="updaterName" label="操作人" header-align="center" align="center"></el-table-column>
							<el-table-column label="操作" fixed="right" header-align="center" align="center" width="120">
								<template #default="scope">
									<el-button v-if="scope.row.status == 0" v-auth="'sys:ident:edit'" type="primary" link @click="submitForm(1, scope.row)"
										>通过
									</el-button>
									<el-button v-if="scope.row.status == 0" v-auth="'sys:ident:edit'" type="primary" link @click="auditHandle(scope.row)"
										>拒绝
									</el-button>
								</template>
							</el-table-column>
						</el-table>
						<el-pagination
							:current-page="state.page"
							:page-sizes="state.pageSizes"
							:page-size="state.limit"
							:total="state.total"
							layout="total, sizes, prev, pager, next, jumper"
							@size-change="sizeChangeHandle"
							@current-change="currentChangeHandle"
						>
						</el-pagination>
					</el-tab-pane>
				</el-tabs>
			</el-card>
		</el-col>
	</el-row>

	<!-- 审核 -->
	<el-dialog v-model="auditDialogVisible" width="500" center>
		<el-form :model="auditForm" label-width="auto" style="max-width: 600px">
			<el-form-item label="拒绝原因">
				<el-input v-model="auditForm.failureReason" type="textarea" />
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button v-auth="'sys:ident:edit'" type="danger" @click="submitForm(-1, '')">提交</el-button>
			</div>
		</template>
	</el-dialog>

	<el-dialog v-model="seePhotoImg" :close-on-click-modal="false" title="相册" width="800px">
		<el-form label-width="150px">
			<div class="scrollable-form-item">
				<el-form-item prop="images" style="height: 150px">
					<el-upload
						ref="coverImageFileRef"
						v-model:file-list="coverImageFile"
						:auto-upload="false"
						:limit="10"
						:multiple="true"
						action="#"
						list-type="picture-card"
					>
						<template #file="{ file }">
							<div v-if="file.url[0].indexOf(';') != -1" style="width: 100%">
								<img :src="file.url[0].split(';')[1]" alt="" class="el-upload-list__item-thumbnail" />
								<span class="el-upload-list__item-actions">
									<span class="el-upload-list__item-delete" @click="videoDialogHandle({ fileUrl: file.url[0] }, false)">
										<el-icon><VideoPlay /></el-icon>
									</span>
								</span>
							</div>
							<div v-else style="width: 100%">
								<img :src="(file as any).url" alt="" class="el-upload-list__item-thumbnail" />
								<span class="el-upload-list__item-actions">
									<span class="el-upload-list__item-delete" @click="videoDialogHandle({ fileUrl: file.url[0] }, true)">
										<el-icon><ZoomIn /></el-icon>
									</span>
								</span>
							</div>
						</template>
					</el-upload>
				</el-form-item>
			</div>
		</el-form>
	</el-dialog>

	<!-- 视频弹窗 -->
	<video-dialog ref="videoDialogRef"></video-dialog>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { ElMessage } from 'element-plus'
import { userIdentificationExamine, userPhotoListApi } from '@/api/user/userIdentification'
import VideoDialog from '@/components/video-dialog/index.vue'
import { VideoPlay, ZoomIn } from '@element-plus/icons-vue'

const seePhotoImg = ref(false)
const coverImageFile = ref<any[]>([])

const state: IHooksOptions = reactive({
	dataListUrl: '/admin/sys/user/identification/page',
	queryForm: {
		userId: '',
		type: '3',
		status: ''
	}
})
const activeName = ref('3')
const auditForm = reactive({
	userId: '',
	failureReason: '',
	type: 0,
	status: 0
})

const auditDialogVisible = ref(false)
const queryRef = ref()

const handleClick = (type: string) => {
	state.queryForm.type = type
	getDataList()
}

const seePhoto = (userId: string) => {
	coverImageFile.value = []
	seePhotoImg.value = true
	let params = {
		targetId: userId,
		page: 1,
		limit: 1000
	}
	userPhotoListApi(params)
		.then(res => {
			res.data.list.forEach((item: any) => {
				coverImageFile.value.push({ url: [item.photo] })
			})
		})
		.catch(() => {
			ElMessage({
				message: '查看相册失败',
				type: 'error',
				plain: true
			})
		})
}

const submitForm = (status: number, row: any) => {
	if (status == -1 && auditForm.failureReason == '') {
		ElMessage({
			message: '拒绝原因不能为空',
			type: 'error',
			plain: true
		})
		return
	}
	if (status == 1) {
		auditForm.userId = row.userId
		auditForm.type = row.type
	}
	auditForm.status = status
	userIdentificationExamine(auditForm)
		.then(() => {
			ElMessage({
				message: '审核成功！',
				type: 'success',
				plain: true
			})
			auditDialogVisible.value = false
			getDataList()
		})
		.catch(() => {
			ElMessage({
				message: '审核失败',
				type: 'error',
				plain: true
			})
		})
}

const auditHandle = (row: any) => {
	auditForm.userId = row.userId
	auditForm.type = row.type
	auditDialogVisible.value = true
}

const videoDialogRef = ref()
const videoDialogHandle = (row: any, isImg: boolean) => {
	let parms = {
		src: '',
		poster: '',
		isImg: isImg
	}
	if (isImg) {
		parms.src = row.fileUrl
	} else {
		if (row.fileUrl) {
			parms.src = row.fileUrl.split(';')[0]
			parms.poster = row.fileUrl.split(';')[1]
		}
	}
	videoDialogRef.value.init(parms)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, reset } = useCrud(state)
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

:deep(.el-upload--picture-card) {
	display: none;
}
</style>
