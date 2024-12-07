<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query">
				<el-form ref="queryRef" :inline="true" :model="state.queryForm">
					<el-form-item>
						<el-button icon="Plus" type="primary" @click="handleUpdateClick(null)">添加</el-button>
					</el-form-item>
				</el-form>
			</el-card>
			<el-card>
				<el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table" show-overflow-tooltip>
					<el-table-column align="center" header-align="center" label="类型" prop="type">
						<template #default="scope">
							{{ scope.row.type == 1 ? '用户协议' : '隐私政策' }}
						</template>
					</el-table-column>
					<el-table-column align="center" header-align="center" label="内容" prop="content"></el-table-column>
					<el-table-column align="center" header-align="center" label="创建时间" prop="createTime"></el-table-column>
					<el-table-column align="center" header-align="center" label="操作人" prop="updater"></el-table-column>
					<el-table-column align="center" fixed="right" header-align="center" label="操作" width="150">
						<template #default="scope">
							<el-button v-auth="'sys:user:update'" link type="primary" @click="handleUpdateClick(scope.row)">修改 </el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination
					:current-page="state.page"
					:page-size="state.limit"
					:page-sizes="state.pageSizes"
					:total="state.total"
					layout="total, sizes, prev, pager, next, jumper"
					@size-change="sizeChangeHandle"
					@current-change="currentChangeHandle"
				>
				</el-pagination>
			</el-card>
		</el-col>
	</el-row>

	<el-dialog v-model="dialogVisible" :show-close="false" center title="添加协议" width="1200px">
		<el-form ref="dataFormRef" :model="submitForm" :rules="dataRules">
			<el-form-item label="类型" prop="type">
				<el-select v-model="submitForm.type" placeholder="请选择">
					<el-option label="用户协议" value="1" />
					<el-option label="隐私政策" value="2" />
				</el-select>
			</el-form-item>
			<el-form-item label="内容" prop="content">
				<fast-editor v-model="submitForm.content" placeholder="请输入..."></fast-editor>
			</el-form-item>
			{{}}
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button type="primary" @click="handleReport"> 提交</el-button>
				<el-button @click="cancelHandle">取消</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { ElMessage } from 'element-plus'
import { handleSaveOrUpdateApi } from '@/api/user/agreementPrivacy'

const state: IHooksOptions = reactive({
	dataListUrl: '/admin/sys/user/agreement-privacy/list',
	createdIsNeed: true,
	queryForm: {
		userId: '',
		status: ''
	}
})
const submitForm = reactive({
	id: '',
	type: '',
	content: ''
})
const dataFormRef = ref()
const cancelHandle = () => {
	dialogVisible.value = false
	submitForm.id = ''
	submitForm.type = ''
	submitForm.content = ''
}

const dialogVisible = ref(false)

const dateTimeValue = ref('')
const queryRef = ref()

const dataRules = ref({
	type: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	content: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

const handleUpdateClick = (row: any) => {
	dialogVisible.value = true
	if (row) {
		submitForm.id = row.id
		submitForm.content = row.content
		submitForm.type = row.type.toString()
	}
}

const handleReport = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		handleSaveOrUpdateApi(submitForm)
			.then(res => {
				ElMessage({
					message: '处理成功',
					type: 'success',
					plain: true
				})
				dialogVisible.value = false
				dataFormRef.value.resetFields()
				getDataList()
			})
			.catch(() => {
				ElMessage({
					message: '处理失败',
					type: 'error',
					plain: true
				})
				dialogVisible.value = false
			})
	})
}

const searchDataList = () => {
	if (dateTimeValue.value) {
		state.queryForm.startDate = dateTimeValue.value[0]
		state.queryForm.endDate = dateTimeValue.value[1]
	}
	getDataList()
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, reset } = useCrud(state)
</script>

<style lang="scss" scoped></style>
