<template>
	<el-dialog v-model="visible" title="详情" :close-on-click-modal="false" draggable>
		<el-descriptions class="margin-top" :column="3" border>
			<el-descriptions-item>
				<template #label>
					<div class="cell-item">
						<el-icon>
							<user />
						</el-icon>
						年龄
					</div>
				</template>
				{{ dataForm.username }}
			</el-descriptions-item>
			<el-descriptions-item>
				<template #label>
					<div class="cell-item">
						<el-icon>
							<iphone />
						</el-icon>
						身高
					</div>
				</template>
				{{ dataForm.mobile }}
			</el-descriptions-item>
			<el-descriptions-item>
				<template #label>
					<div class="cell-item">
						<el-icon>
							<location />
						</el-icon>
						体重
					</div>
				</template>
				Suzhou
			</el-descriptions-item>
			<el-descriptions-item>
				<template #label>
					<div class="cell-item">
						<el-icon>
							<location />
						</el-icon>
						气质类型
					</div>
				</template>
				Suzhou
			</el-descriptions-item>
		</el-descriptions>
		<!--    <template #footer>-->
		<!--      <el-button @click="visible = false">取消</el-button>-->
		<!--      <el-button type="primary" @click="submitHandle()">确定</el-button>-->
		<!--    </template>-->
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useUserApi } from '@/api/sys/user'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	username: '',
	realName: '',
	orgId: '',
	password: '',
	gender: 0,
	email: '',
	mobile: ''
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	// id 存在则为修改
	if (id) {
		getUserInfo(id)
	}
}

// 获取信息
const getUserInfo = (id: number) => {
	useUserApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

defineExpose({
	init
})
</script>
