<template>
	<el-row :gutter="10">
		<!--    <el-col :span="5">-->
		<!--      <el-card>-->
		<!--        <OrgTree @node-click="handleOrgClick"/>-->
		<!--      </el-card>-->
		<!--    </el-col>-->
		<el-col :span="24">
			<el-card class="layout-query">
				<el-form ref="queryRef" :inline="true" :model="state.queryForm">
					<el-form-item prop="username">
						<el-input v-model="state.queryForm.userId" placeholder="UID"></el-input>
					</el-form-item>
					<el-form-item prop="mobile">
						<el-input v-model="state.queryForm.phoneOrEmail" placeholder="账户"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button icon="Search" v-auth="'sys:user:page'" type="primary" @click="getDataList()">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button icon="RefreshRight" @click="reset(queryRef)">重置</el-button>
					</el-form-item>
				</el-form>
			</el-card>

			<el-card>
				<el-space>
					<el-space>
						<el-button v-auth="'sys:user:save'" icon="Plus" type="primary" @click="addOrUpdateHandle()">新增</el-button>
					</el-space>
				</el-space>
				<el-table
					v-loading="state.dataListLoading"
					:data="state.dataList"
					border
					class="layout-table"
					show-overflow-tooltip
					@selection-change="selectionChangeHandle"
				>
					<el-table-column align="center" header-align="center" type="selection" width="38"></el-table-column>
					<el-table-column align="center" header-align="center" label="UID" prop="id"></el-table-column>
					<el-table-column align="center" header-align="center" label="用户名称" prop="username"></el-table-column>
					<el-table-column align="center" header-align="center" label="账户" prop="mobile"></el-table-column>
					<el-table-column align="center" header-align="center" label="密码" prop="password">
						<template #default="scope">
							<el-button type="text" @click="updatePwd(scope.row.id)">点击修改</el-button>
						</template>
					</el-table-column>
					<el-table-column align="center" header-align="center" label="平台ID" prop="platformId"></el-table-column>
					<el-table-column align="center" header-align="center" label="创建时间" prop="createTime"></el-table-column>
					<el-table-column align="center" label="状态" prop="status">
						<template #default="scope">
							<el-switch
								v-model="scope.row.status"
								v-auth="'sys:user:updateStatus'"
								:active-value="1"
								:inactive-value="0"
								active-text="禁用"
								class="mb-2"
								inactive-text="启用"
								inline-prompt
								style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
								@change="handleStatusChange(scope.row)"
							/>
						</template>
					</el-table-column>
					<el-table-column align="center" fixed="right" header-align="center" label="操作" width="120">
						<template #default="scope">
							<el-button v-auth="'sys:user:update'" link type="primary" @click="addOrUpdateHandle(scope.row.id)">修改 </el-button>
							<el-button type="primary" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
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

	<!-- 弹窗, 新增 / 修改 -->
	<add-or-update ref="addOrUpdateRef" @refresh-data-list="getDataList"></add-or-update>

	<!-- 修改密码 -->
	<el-dialog v-model="updatePwdVisible" :show-close="false" align-center width="300">
		<el-form ref="updatePwdRef" :model="updatePwdForm" :rules="updatePwdRules" label-width="80">
			<el-form-item label="新密码" prop="newPassword">
				<el-input v-model="updatePwdForm.newPassword" autocomplete="off" placeholder="请输入密码" show-password type="password" />
			</el-form-item>
			<el-form-item label="确认密码" prop="confirmPassword">
				<el-input v-model="updatePwdForm.confirmPassword" autocomplete="off" placeholder="请输入密码" show-password type="password" />
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button type="primary" @click="updatePwdSubmit"> 提交 </el-button>
				<el-button @click="updatePwdCancel">取消</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="SysUserIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'
import { ElMessage, UploadProps } from 'element-plus'
import cache from '@/utils/cache'
import constant from '@/utils/constant'
import { useUserStore } from '@/store/modules/user'
import { updatePwdSubmitApi, useUserSubmitApi, updateStatusApi } from '@/api/sys/user'

const state: IHooksOptions = reactive({
	dataListUrl: '/sys/user/page',
	deleteUrl: '/sys/user',
	queryForm: {
		username: '',
		phoneOrEmail: '',
		gender: '',
		orgId: ''
	}
})
const updatePwdRef = ref()
const updatePwdVisible = ref(false)
const updatePwdForm = reactive({
	id: '',
	newPassword: '',
	confirmPassword: ''
})

const queryRef = ref()
const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const handleStatusChange = (row: any) => {
	const dataForm = {
		id: row.id,
		status: row.status
	}
	updateStatusApi(dataForm).then(() => {
		ElMessage({
			message: '修改成功',
			type: 'success',
			plain: true
		})
	})
}

const handleOrgClick = (orgId: any) => {
	state.queryForm.orgId = orgId
	getDataList()
}

// 导入用户excel文件
const uploadUserExcelUrl = constant.apiUrl + '/sys/user/import?access_token=' + cache.getToken()

const downloadExcel = () => {
	downloadHandle('/sys/user/export')
}
const updatePwd = (id: any) => {
	updatePwdVisible.value = true
	updatePwdForm.id = id
}

const handleSuccess: UploadProps['onSuccess'] = (res, file) => {
	if (res.code !== 0) {
		ElMessage.error('上传失败：' + res.msg)
		return false
	}

	ElMessage.success({
		message: '上传成功',
		duration: 500,
		onClose: () => {
			getDataList()
		}
	})
}
const validatePass = (rule: any, value: any, callback: any) => {
	if (value === '') {
		callback(new Error('新密码不能为空'))
	} else {
		if (updatePwdForm.newPassword !== '') {
			if (!updatePwdRef.value) {
				return
			}
			updatePwdRef.value.validateField('checkPass')
		}
		callback()
	}
}
const validatePass2 = (rule: any, value: any, callback: any) => {
	if (value === '') {
		callback(new Error('请确认新密码'))
	} else if (value !== updatePwdForm.newPassword) {
		callback(new Error('两次输入的密码不一致!'))
	} else {
		callback()
	}
}

const updatePwdRules = ref({
	newPassword: [{ validator: validatePass, trigger: 'blur', required: true }],
	confirmPassword: [{ validator: validatePass2, trigger: 'blur', required: true }]
})

const updatePwdSubmit = () => {
	updatePwdRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		updatePwdSubmitApi(updatePwdForm)
			.then(() => {
				ElMessage({
					message: '修改成功',
					type: 'success',
					plain: true
				})
				updatePwdVisible.value = false
			})
			.catch(() => {
				ElMessage({
					message: '修改失败',
					type: 'error',
					plain: true
				})
				updatePwdVisible.value = false
			})
	})
}
const updatePwdCancel = () => {
	updatePwdVisible.value = false
	updatePwdForm.newPassword = ''
}

const beforeUpload: UploadProps['beforeUpload'] = file => {
	if (file.size / 1024 / 1024 / 1024 / 1024 > 1) {
		ElMessage.error('文件大小不能超过100M')
		return false
	}
	return true
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, downloadHandle, reset } = useCrud(state)
</script>
