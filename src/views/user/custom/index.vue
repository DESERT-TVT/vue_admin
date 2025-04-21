<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query">
				<el-form ref="queryRef" :inline="true" :model="state.queryForm">
					<el-form-item>
						<el-popover :visible="addUserRoleVisible" placement="right-end" :width="300">
							<el-form ref="userRoleDataFormRef" :model="userRoleDataForm" :rules="userRoleDataFormRules" label-width="auto" style="margin-top: 20px">
								<el-form-item label="用户" prop="userId">
									<el-select v-model="userRoleDataForm.userId" filterable placeholder="请选择客服" clearable>
										<el-option v-for="user in userList" :key="user.id" :label="user.username" :value="user.id" />
									</el-select>
								</el-form-item>
								<el-form-item label="状态" prop="status">
									<el-select v-model="userRoleDataForm.status" placeholder="请选择用户状态" clearable>
										<el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
									</el-select>
								</el-form-item>
							</el-form>
							<div style="text-align: right; margin: 0">
								<el-button size="small" @click="addUserRoleVisible = false">取消</el-button>
								<fetctButton size="small" :submit-handle="onSubmitCustom"></fetctButton>
								<!-- <el-button size="small" type="primary" @click="submitUserRoleHandle()">确定</el-button> -->
							</div>
							<template #reference>
								<el-button v-auth="'admin:custom:add'" type="primary" @click="addUserRoleHandle()">添加客服</el-button>
							</template>
						</el-popover>
					</el-form-item>
					<el-form-item>
						<el-button icon="Search" type="primary" @click="getDataList()">查询</el-button>
					</el-form-item>
				</el-form>
			</el-card>

			<el-card>
				<el-table
					v-loading="state.dataListLoading"
					show-overflow-tooltip
					:data="state.dataList"
					border
					class="layout-table"
					height="70vh"
					@selection-change="selectionChangeHandle"
				>
					<el-table-column type="selection" header-align="center" align="center" width="38"></el-table-column>
					<el-table-column fixed prop="userId" label="userId" header-align="center" align="center"></el-table-column>
					<el-table-column fixed prop="userName" label="用户名" header-align="center" align="center"></el-table-column>
					<el-table-column fixed prop="status" label="状态" header-align="center" align="center">
						<template #default="scope">
							{{ scope.row.status == 1 ? '启用' : '禁用' }}
						</template>
					</el-table-column>
					<el-table-column label="操作" fixed="right" header-align="center" align="center">
						<template #default="scope">
							<el-button v-auth="'admin:custom:delete'" link type="primary" @click="onDeleteCustom(scope.row.userId)"> 删除 </el-button>
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
	<!-- 修改 -->
</template>
<script setup lang="ts">
import { CustomAddReq, fetchAdminList, fetchCustomAdd, fetchCustomDelete } from '@/api/user/custom'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import fetctButton from '@/components/fetct-button/index.vue'

const state: IHooksOptions = reactive({
	dataListUrl: '/admin/custom/page',
	queryForm: {}
})
const addUserRoleVisible = ref(false)
const userRoleDataFormRef = ref<FormInstance>()
const userRoleDataForm = reactive<Partial<CustomAddReq>>({
	userId: undefined,
	status: undefined
})
const userRoleDataFormRules = ref({
	userId: [{ required: true, message: '请选择用户', trigger: 'blur' }],
	status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
})
const userList = ref<
	{
		id: number
		username: string
	}[]
>([])
const statusOptions = [
	{
		value: 1,
		label: '启用'
	},
	{
		value: 0,
		label: '禁用'
	}
]
const onSubmitCustom = async () => {
	const valida = await userRoleDataFormRef.value?.validate()
	if (!valida) {
		return
	}
	if (userRoleDataForm.status == undefined || !userRoleDataForm.userId) {
		return
	}
	const parms = {
		userId: userRoleDataForm.userId,
		status: userRoleDataForm.status
	}
	const res = await fetchCustomAdd(parms)
	if (res) {
		ElMessage.success('添加成功')
		getDataList()
		addUserRoleVisible.value = false
	}
}
const addUserRoleHandle = () => {
	addUserRoleVisible.value = true
	userRoleDataForm.status = undefined
	userRoleDataForm.userId = undefined
}
const getAdminList = () => {
	fetchAdminList().then(res => {
		if (res) {
			userList.value = res.data.list.map(item => {
				return {
					id: item.id,
					username: item.username
				}
			})
		}
	})
}
const onDeleteCustom = (id: number) => {
	ElMessageBox.confirm('确定进行删除操作?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	})
		.then(() => {
			fetchCustomDelete(id).then(res => {
				if (res) {
					ElMessage.success('删除成功')
					getDataList()
				}
			})
		})
		.catch(() => {})
}
onMounted(() => {
	getAdminList()
})
const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, reset } = useCrud(state)
</script>
