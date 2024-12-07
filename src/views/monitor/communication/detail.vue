<template>
	<el-dialog v-model="visible" title="日志详情" :close-on-click-modal="false" align-center destroy-on-close>
		<el-form label-width="100px">
			<el-row>
				<el-col :span="12">
					<el-form-item label="用户ID">
						<el-input v-model="dataForm.creator" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="IP">
						<el-input v-model="dataForm.ip" disabled></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item label="事件">
						<el-input v-model="dataForm.event" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="客户端">
						<el-input v-model="dataForm.client" disabled></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item label="User-Agent">
				<el-input v-model="dataForm.userAgent" disabled></el-input>
			</el-form-item>
			<el-form-item label="参数">
				<el-input v-model="dataForm.params" :rows="8" type="textarea" disabled />
			</el-form-item>
			<el-form-item label="日志">
				<el-input v-model="dataForm.log" :rows="8" type="textarea" disabled />
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button type="primary" @click="visible = false">关闭</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useLogOperateException } from '@/api/sys/log'

const visible = ref(false)
const dataForm = reactive({
	creator: '',
	client: '',
	event: '',
	ip: '',
	userAgent: '',
	params: '',
	log: ''
})

const init = (data?: any) => {
	visible.value = true

	Object.assign(dataForm, data)
}

defineExpose({
	init
})
</script>
