<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" :title="!update ? '新增' : '修改'" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="120px" @keyup.enter="submitHandle()">
			<el-form-item label="名称" prop="name">
				<el-input v-model="dataForm.name" placeholder="名称"></el-input>
			</el-form-item>
			<el-form-item label="上级名称" prop="pid">
				<el-tree-select
					v-model="dataForm.pid"
					:data="menuList"
					:props="{ label: 'name', children: 'children' }"
					:render-after-expand="false"
					check-strictly
					clearable
					style="width: 100%"
					value-key="id"
				/>
			</el-form-item>
			<el-form-item label="编号">
				<el-input v-model="dataForm.code" placeholder="名称"></el-input>
			</el-form-item>
			<!--			<el-form-item prop="sort" label="排序">-->
			<!--				<el-input-number v-model="dataForm.sort" controls-position="right" :min="0" label="排序"></el-input-number>-->
			<!--			</el-form-item>-->
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { APIAreaList, APIUseUserAreaSubmit } from '@/api/config/setting'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const menuList = ref([])
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	name: '',
	pid: '',
	parentName: '',
	sort: 0,
	code: 0,
	openStyle: 0
})

const update = ref(false)

const init = (isUpdate: boolean, row: any) => {
	visible.value = true
	update.value = isUpdate

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	// 存在则为修改
	if (row) {
		getUserArea(isUpdate, row)
	} else {
		dataForm.pid = ''
		dataForm.name = ''
		dataForm.code = 0
	}
	// 菜单列表
	getUserAreaList()
}

// 获取菜单列表
const getUserAreaList = async () => {
	const res = await APIAreaList()
	menuList.value = res.data
}

// 获取信息
const getUserArea = (isUpdate: boolean, row: any) => {
	Object.assign(dataForm, row)
	if (!isUpdate) {
		// 是新增，重置表单数据
		dataForm.pid = row.id
		dataForm.id = ''
		dataForm.name = ''
		dataForm.sort = 0
		dataForm.openStyle = 0
	}
}

const dataRules = ref({
	name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
	// parentName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		APIUseUserAreaSubmit(dataForm).then(() => {
			ElMessage.success({
				message: '操作成功',
				duration: 500,
				onClose: () => {
					visible.value = false
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
.mod__menu {
	::v-deep(.el-popover.el-popper) {
		overflow-x: hidden;
	}

	.popover-list {
		::v-deep(.el-input__inner) {
			cursor: pointer;
		}

		::v-deep(.el-input__suffix) {
			cursor: pointer;
		}
	}
}
</style>
