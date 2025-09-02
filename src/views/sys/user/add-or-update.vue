<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" :title="!dataForm.id ? '新增' : '修改'" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="120px" @keyup.enter="submitHandle()">
			<el-row>
				<el-col :span="12">
					<!--					<el-form-item prop="orgId" label="所属机构">-->
					<!--						<fast-org-select v-model="dataForm.orgId" placeholder="请选择"></fast-org-select>-->
					<!--					</el-form-item>-->
					<el-form-item label="登录账户" prop="mobile">
						<el-input v-model="dataForm.mobile" placeholder="手机号"></el-input>
					</el-form-item>
					<el-form-item label="设置用户名" prop="username">
						<el-input v-model="dataForm.username" placeholder="用户名"></el-input>
					</el-form-item>
					<el-form-item label="设置姓名" prop="realName">
						<el-input v-model="dataForm.realName" placeholder="姓名"></el-input>
					</el-form-item>
					<el-form-item v-if="showPassword" label="设置密码" prop="password">
						<el-input v-model="dataForm.password" placeholder="密码" type="password"></el-input>
					</el-form-item>
					<el-form-item label="设置角色" prop="roleIdList">
						<el-select v-model="dataForm.roleIdList" multiple placeholder="角色" style="width: 100%">
							<el-option v-for="role in roleList" :key="role.id" :label="role.name" :value="role.id"></el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="所属平台" prop="postIdList">
						<el-select v-model="dataForm.platformId" placeholder="所属平台" style="width: 100%">
							<el-option v-for="post in siteList" :key="post.id" :label="post.name" :value="post.id"></el-option>
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="12">
					<el-form-item label="性别" prop="gender">
						<fast-dict-radio v-model="dataForm.gender" dict-type="user_gender"></fast-dict-radio>
					</el-form-item>
					<el-form-item label="邮箱" prop="email">
						<el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
					</el-form-item>
					<el-form-item label="状态" prop="status">
						<fast-dict-radio v-model="dataForm.status" dict-type="user_status"></fast-dict-radio>
					</el-form-item>
				</el-col>
			</el-row>
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
import { useUserApi, useUserSubmitApi } from '@/api/sys/user'
import { usePostListApi } from '@/api/sys/post'
import { useRoleListApi } from '@/api/sys/role'
import { useSiteList } from '@/api/sys/site'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const postList = ref<any[]>([])
const roleList = ref<any[]>([])
const siteList = ref<any[]>([])
const dataFormRef = ref()
const showPassword = ref(true)

const dataForm = reactive({
	id: '',
	username: '',
	realName: '',
	orgId: '',
	password: '',
	gender: 0,
	email: '',
	nickname: '',
	mobile: '',
	roleIdList: [] as any[],
	postIdList: [] as any[],
	status: 1,
	tenantId: null,
	platformId: ''
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
		getUser(id)
		showPassword.value = false
	}

	getPostList()
	getRoleList()
	getSiteList()
}

// 获取岗位列表
const getPostList = async () => {
	let res = await usePostListApi()
	postList.value = res.data
}

// 获取角色列表
const getRoleList = async () => {
	let res = await useRoleListApi()
	roleList.value = res.data
}

const getSiteList = async () => {
	let res = await useSiteList()
	siteList.value = res.data.list
}

// 获取信息
const getUser = (id: number) => {
	useUserApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	username: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	// realName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	mobile: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	password: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
	// orgId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useUserSubmitApi(dataForm).then(() => {
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
