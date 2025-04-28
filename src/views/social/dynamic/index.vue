<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<!--			<el-form-item prop="nickname">-->
			<!--				<el-input v-model="state.queryForm.nickname" clearable placeholder="发布人昵称"></el-input>-->
			<!--			</el-form-item>-->
			<el-form-item prop="userId">
				<el-input v-model="state.queryForm.userId" clearable placeholder="UID"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'sys:dynamic:list'" icon="Search" type="primary" @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button icon="RefreshRight" @click="reset(queryRef)">重置</el-button>
			</el-form-item>
		</el-form>
	</el-card>

	<el-card>
		<el-space>
			<el-space>
				<el-button v-auth="'sys:dynamic:del'" icon="Delete" plain type="danger" @click="deleteBatchHandle()"> 批量删除 </el-button>
			</el-space>
		</el-space>
		<el-table
			v-loading="state.dataListLoading"
			:data="state.dataList"
			border
			class="layout-table"
			height="66vh"
			@selection-change="selectionChangeHandle"
		>
			<el-table-column type="selection" header-align="center" align="center" width="38"></el-table-column>
			<el-table-column align="center" header-align="center" label="UID" prop="userId"></el-table-column>
			<el-table-column prop="nickname" label="发布人昵称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="textContent" show-overflow-tooltip label="动态内容" header-align="center" align="center"></el-table-column>
			<el-table-column prop="mediaContentList" label="动态图片/视频" header-align="center" align="center">
				<template #default="scope">
					<el-image
						v-if="scope.row.type == 1"
						:preview-src-list="scope.row.mediaContentList"
						:preview-teleported="true"
						:src="scope.row.mediaContentList[0]"
						:zoom-rate="1.2"
						:max-scale="7"
						:min-scale="0.2"
						style="margin-top: 7px; width: 100px; height: 100px; border-radius: 6px"
						:initial-index="0"
						fit="cover"
					/>
					<div v-else-if="scope.row.type == 2" style="margin-left: 15px">
						<el-image
							class="image-with-mask"
							:src="scope.row.mediaContent.split(';')[1]"
							style="margin-top: 7px; width: 100px; height: 100px; border-radius: 6px; cursor: pointer"
							@click="videoDialogHandle(scope.row)"
						/>
					</div>
					<el-icon v-else>
						<icon-picture />
					</el-icon>
				</template>
			</el-table-column>
			<el-table-column prop="likeNum" show-overflow-tooltip label="点赞" header-align="center" align="center"></el-table-column>
			<el-table-column prop="commentNum" show-overflow-tooltip label="评论" header-align="center" align="center"></el-table-column>
			<el-table-column prop="giftValue" show-overflow-tooltip label="礼物" header-align="center" align="center"></el-table-column>
			<el-table-column prop="city" label="城市" header-align="center" align="center"></el-table-column>
			<el-table-column prop="createTime" label="发布时间" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="160">
				<template #default="scope">
					<el-button v-auth="'sys:dynamic:del'" type="primary" link @click="deleteBatchHandle(scope.row.id)">删除 </el-button>
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

		<!-- 弹窗, 新增 / 修改 -->
		<!--		<add-or-update ref="addOrUpdateRef" @refresh-data-list="getDataList"></add-or-update>-->
		<!-- 视频弹窗 -->
		<video-dialog ref="videoDialogRef"></video-dialog>
	</el-card>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { Picture as IconPicture, VideoPlay } from '@element-plus/icons-vue'
import MyVideo from '@/components/MyVideo/index.vue'
import VideoDialog from '@/components/video-dialog/index.vue'
import AddOrUpdate from '@/views/user/userInfo/update.vue'
const state: IHooksOptions = reactive({
	dataListUrl: '/admin/social/dynamic/page',
	deleteUrl: '/admin/social/dynamic/delete',
	queryForm: {
		userId: '',
		nickname: ''
	}
})
const showPlayButton = ref(false)
const queryRef = ref()
const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}
// 处理图片点击事件
const handleImageClick = () => {
	showPlayButton.value = true
}

const sendRef = ref()
const sendHandle = (row: any) => {
	sendRef.value.init(row)
}

const videoDialogRef = ref()
const videoDialogHandle = (row: any) => {
	let parms = {
		src: row.mediaContentList[0],
		poster: row.mediaContentList[1]
	}
	videoDialogRef.value.init(parms)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud(state)
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
</style>
