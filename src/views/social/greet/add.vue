<template>
	<el-dialog v-model="visible" title="新增" :close-on-click-modal="false" width="50%" @close="closeDialogHandle">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" @keyup.enter="submitHandle()">
			<el-form-item v-for="item in languageList" :key="item.value" :label="'语言：' + item.label">
				<el-input v-model="tempContent[item.value]" :placeholder="'请输入' + item.label + '内容'" style="width: 100%"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="closeDialogHandle">取消</el-button>
			<fetctButton :submit-handle="submitHandle" />
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { fetchAddGreet } from '@/api/social/greet'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import fetctButton from '@/components/fetct-button/index.vue'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({})
const languageList = [
	{ label: 'English', value: 'en' },
	{ label: '简体中文', value: 'zh' },
	{ label: 'Indonesia', value: 'in' },
	{ label: 'Português', value: 'pt' },
	{ label: 'ไทย', value: 'th' },
	{ label: 'Tiếng Việt', value: 'vi' },
	{ label: '繁體中文', value: 'tc' }
]
const tempContent = reactive<Record<string, string>>({})
const init = () => {
	visible.value = true

	// 清空 tempContent 对象的所有属性
	Object.keys(tempContent).forEach(key => {
		delete tempContent[key]
	})

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}
}

const closeDialogHandle = () => {
	visible.value = false
}

const dataRules = ref({})

// 检查是否至少设置了一个语言
const hasAtLeastOneLanguage = () => {
	return Object.values(tempContent).some(content => content.trim() !== '')
}
// 表单提交
const submitHandle = async () => {
	// 检查是否至少设置了一个语言
	if (!hasAtLeastOneLanguage()) {
		ElMessage.warning('必须至少设置一个语言内容')
		return
	}
	// 将 tempContent 转换为 AddGreetReq 数组
	const addGreetReqList = Object.entries(tempContent).map(([language, content]) => ({
		content,
		language
	}))
	// 调用接口添加数据
	const res = await fetchAddGreet(addGreetReqList)
	if (res) {
		ElMessage.success({
			message: '操作成功',
			duration: 500,
			onClose: () => {
				closeDialogHandle()
				emit('refreshDataList')
			}
		})
	}
}

defineExpose({
	init
})
</script>
