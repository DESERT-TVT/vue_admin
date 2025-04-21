<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query">
				<el-form :inline="true" :model="state.queryForm">
					<el-form-item prop="userId">
						<el-input v-model="texts" placeholder="打招呼第一句话" style="width: 450px"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button icon="Plus" type="primary" @click="queryHandle">新增文本</el-button>
					</el-form-item>
					<el-form-item>
						<el-button icon="Plus" type="primary" @click="showDialog">新增语音</el-button>
					</el-form-item>
					<el-form-item>
						<el-button icon="Search" type="primary" @click="getDataList()">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button v-auth="'sys:bot'" icon="Delete" plain type="danger" @click="deleteBatchHandle()">批量删除</el-button>
					</el-form-item>
				</el-form>
			</el-card>

			<!-- table -->
			<el-card>
				<el-table
					v-loading="state.dataListLoading"
					show-overflow-tooltip
					:data="state.dataList"
					border
					class="layout-table"
					style="width: 100%"
					:border="parentBorder"
					@selection-change="selectionChangeHandle"
				>
					<el-table-column type="selection" header-align="center" align="center" width="38"></el-table-column>
					<el-table-column prop="speechDemo" label="打招呼话术" header-align="center" align="center">
						<template #default="{ row }">
							<!-- 判定 speechDemo -->
							<div v-if="row.type === 1">
								{{ row.speechDemo }}
								<!-- 显示文字 -->
							</div>
							<div v-else-if="row.type === 2">
								<audio controls @play="handlePlay($event)">
									<source :src="row.speechDemo" type="audio/mpeg" />
									您的浏览器不支持音频播放。
								</audio>
							</div>
							<div v-else>无数据</div>
						</template>
					</el-table-column>
					<el-table-column prop="status" label="状态" header-align="center" align="center">
						<template #default="scope">
							<el-switch
								v-model="scope.row.status"
								:active-value="1"
								:inactive-value="0"
								active-color="#13ce66"
								inactive-color="#ff4949"
								@change="handleStatusChange(scope.row)"
							/>
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
			</el-card>
		</el-col>
	</el-row>

	<!-- 弹窗 -->
	<el-dialog title="新增打招呼话术" v-model="dialogVisible" width="600px">
		<el-form :model="dialogForm">
			<el-form-item label="选择文件" prop="files">
				<el-upload multiple :auto-upload="false" list-type="text" :file-list="files" :on-change="handleFileChange" :on-remove="handleFileRemove">
					<el-button size="small" type="primary">选择文件</el-button>
				</el-upload>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="dialogVisible = false">取消</el-button>
			<el-button type="primary" @click="confirmAdd">确认</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { APISaveBotText, APIUpdateBotTextStatus } from '@/api/sys/user'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import { useUploadAwsApi } from '@/api/awsUpload'
import { useUploadOssApi } from '@/api/upload'

const parentBorder = ref(false)

const dialogVisible = ref(false)
const dialogForm = reactive({
	texts: ''
})
const files = ref<any[]>([])
const voiceFile = ref<string[]>([])

const currentAudio = ref<HTMLAudioElement | null>(null)
const showDialog = () => {
	dialogVisible.value = true
}

const confirmAdd = async () => {
	if (!dialogForm.texts && files.value.length === 0) {
		ElMessage.error('请输入文本内容或选择文件')
		return
	}

	for (const file of files.value) {
		if (file.raw) {
			const mimeType = file.raw.type // 获取文件的 MIME 类型
			if (!mimeType.startsWith('audio/')) {
				console.error(`文件 ${file.raw.name} 不是音频文件`)
				continue // 跳过非音频文件
			}
			const suffix = file.raw.name.substring(file.raw.name.lastIndexOf('.'))

			// 获取文件时长
			const audio = new Audio(URL.createObjectURL(file.raw)) // 创建音频对象
			await new Promise(resolve => {
				audio.addEventListener('loadedmetadata', () => {
					const duration = Math.round(audio.duration) // 获取音频时长（秒）
					console.log(`文件名: ${file.raw.name}, 时长: ${duration} 秒`) // 打印文件名和时长
					resolve(duration) // 确保时长获取完成后再继续
				})
			})
			const uploadedUrl = await useUploadOssApi(file.raw, 'cover/', null, suffix)
			// const uploadedUrl = await useUploadAwsApi(file.raw, suffix)
			voiceFile.value.push(`${uploadedUrl}?${audio.duration}`)
		}
	}

	const params = {
		texts: voiceFile.value.join('|'),
		textType: 2
	}
	APISaveBotText(params).then((resp: any) => {
		if (resp.code === 0) {
			ElMessage.success('添加成功')
			dialogVisible.value = false
			dialogForm.texts = ''
			getDataList()
		}
	})
}
const handlePlay = (event: Event) => {
	const target = event.target as HTMLAudioElement

	// 如果有其他正在播放的音频，先暂停它
	if (currentAudio.value && currentAudio.value !== target) {
		currentAudio.value.pause()
	}

	// 更新当前正在播放的音频
	currentAudio.value = target
}
const handleFileChange = (file: any, fileList: any) => {
	files.value = fileList
}

const handleFileRemove = (file: any, fileList: any) => {
	files.value = fileList
}

const state: IHooksOptions = reactive({
	dataListUrl: '/admin/sys/user/bot/comment/text',
	deleteUrl: '/admin/sys/user/bot/comment/del',
	queryForm: {
		textType: 2
	}
})

const handleStatusChange = (row: any) => {
	const params = {
		id: row.id,
		status: row.status
	}
	APIUpdateBotTextStatus(params)
		.then(() => {
			ElMessage.success('状态更新成功')
		})
		.catch(() => {
			ElMessage.error('状态更新失败')
		})
}
const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud(state)
const texts = ref('')
const queryHandle = () => {
	if (texts.value === '') {
		ElMessage.error('请输入打招呼第一句话')
		return
	}
	const params = {
		texts: texts.value,
		textType: 1
	}
	APISaveBotText(params)
		.then(res => {
			if (res) {
				ElMessage.success('添加成功')
				texts.value = ''
			}
		})
		.finally(() => {
			getDataList()
		})
}
</script>

<style scoped lang="scss">
body {
	margin: 0;
}
.example-showcase .el-loading-mask {
	z-index: 9;
}
</style>
