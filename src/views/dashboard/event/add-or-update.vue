<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('edit')" :close-on-click-modal="false" draggable width="30%">
		<el-form  ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="auto" style="margin-top: 20px">
			<el-form-item v-if="!dataForm.id" label="选择平台:">
				<el-select
					v-model="dataForm.platformId"
					filterable
					remote
					:loading="loading"
					placeholder="请选择"
					style="width: 240px"
					@visible-change="handleVisibleChange"
					@popup-scroll="handleScroll"
				>
					<el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="事件名称" prop="name">
				<el-input v-model="dataForm.name" placeholder="请输入事件名称" clearable></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { addEventSubmitApi, platformApi, PlatformList, updateEventSubmitApi } from '@/api/dataStatistics'

const { t } = useI18n()

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const init = (row?: any) => {
	visible.value = true
	if(row){
		dataForm.name = row.name
		dataForm.id = row.id
	}
}

const dataFormRef = ref<FormInstance>()
const dataForm = reactive({
	name: ref<any>(),
	platformId: ref<any>(),
	id: ref<any>()
})

const dataRules = reactive<FormRules<typeof dataForm>>({
	name: [{ required: true, message: t('required'), trigger: 'submit' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value?.validate((valid: boolean) => {
		if (!valid) {
			return
		}
		if (dataForm.id) {
			delete dataForm.platformId
			updateEventSubmitApi(dataForm).then(() => {
				ElMessage.success({
					message: '操作成功',
					duration: 1000,
					onClose: () => {
						visible.value = false
						emit('refreshDataList')
					}
				})
			})
		} else {
			addEventSubmitApi(dataForm).then(() => {
				ElMessage.success({
					message: '操作成功',
					duration: 1000,
					onClose: () => {
						visible.value = false
						emit('refreshDataList')
					}
				})
			})
		}
	})
}

// 分页平台查询
const options = ref<PlatformList[]>([])
const loading = ref(false)
const pageParams = {
	page: 1,
	limit: 10,
	name: ''
}
const total = ref(0)

// 默认加载第一页并选择第一项
onMounted(async () => {
	pageParams.page = 1
	const data = await platformApi(pageParams)
	options.value = data.data.list
	total.value = data.data.total
	if (total.value > 0) {
		dataForm.platformId = options.value[0].id
	}
})

// 下拉展开时刷新第一页
const handleVisibleChange = async (visible: boolean) => {
	if (visible && options.value.length === 0) {
		pageParams.page = 1
		const data = await platformApi(pageParams)
		options.value = data.data.list
	}
}

// 下拉滚动触底加载更多
const handleScroll = async (e: HTMLElement) => {
	const wrap = document.querySelector('.el-select-dropdown .el-select-dropdown__wrap') as HTMLElement
	if (!wrap) return
	const { clientHeight, scrollHeight } = wrap
	if (e.scrollTop + clientHeight >= scrollHeight - 5) {
		if (options.value.length < total.value && !loading.value) {
			pageParams.page++
			const more = await platformApi(pageParams)
			options.value.push(...more.data.list)
		}
	}
}

defineExpose({
	init
})
</script>
