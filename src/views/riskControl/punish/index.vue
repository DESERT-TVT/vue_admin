<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query">
				<el-form ref="queryRef" :inline="true" :model="state.queryForm">
					<el-form-item prop="userId">
						<el-input v-model="state.queryForm.userId" clearable placeholder="UID"></el-input>
					</el-form-item>

					<el-form-item prop="status">
						<fast-dict-select v-model="state.queryForm.type" clearable dict-type="risk_control_punish_type" placeholder="处罚内容">
						</fast-dict-select>
					</el-form-item>

					<el-form-item>
						<el-date-picker
							v-model="dateTimeValue"
							type="datetimerange"
							start-placeholder="Start date"
							end-placeholder="End date"
							format="YYYY-MM-DD HH:mm:ss"
							date-format="YYYY-MM-DD"
							time-format="HH:mm:ss"
							value-format="YYYY-MM-DD HH:mm:ss"
						/>
					</el-form-item>

					<el-form-item>
						<el-button icon="Search" type="primary" @click="searchDataList()">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button icon="RefreshRight" @click="reset(queryRef)">重置</el-button>
					</el-form-item>
					<el-form-item>
						<el-button v-auth="'riskcontrol:punish:add'" icon="Plus" type="primary" @click="addPunish">添加处罚 </el-button>
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
					<el-table-column prop="userId" label="UID" header-align="center" align="center"></el-table-column>
					<fast-dict-column prop="type" label="处罚内容" dict-type="risk_control_punish_type"></fast-dict-column>
					<el-table-column align="center" header-align="center" label="处罚时长(天)" prop="duration"></el-table-column>
					<el-table-column prop="status" label="处罚状态" header-align="center" align="center">
						<template #default="scope">
							<el-tag v-if="scope.row.status == 1" type="warning">处罚中</el-tag>
							<el-tag v-else type="danger">已失效</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="createTime" label="被处罚时间" header-align="center" align="center"></el-table-column>
					<el-table-column align="center" header-align="center" label="操作人" prop="updater"></el-table-column>
					<el-table-column prop="remark" label="备注" header-align="center" align="center"></el-table-column>
					<el-table-column label="操作" fixed="right" header-align="center" align="center" width="120">
						<template #default="scope">
							<el-popconfirm
								v-auth="'riskcontrol:punish:edit'"
								cancel-button-text="取消"
								cancel-button-type="text"
								confirm-button-text="确认"
								confirm-button-type="text"
								icon-color="#E6A23C"
								title="确认取消处罚吗?"
								@confirm="cancelPunish(scope.row)"
							>
								<template #reference>
									<el-button v-if="scope.row.status == 1" link type="primary">解除</el-button>
								</template>
							</el-popconfirm>
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
	<el-dialog v-model="dialogVisible" :show-close="false" center title="添加处罚" width="400px">
		<el-form ref="dataFormRef" :model="submitForm" :rules="dataRules" label-width="auto">
			<el-form-item label="被处罚用户" prop="userId">
				<el-input v-model="submitForm.userId" clearable placeholder="UID"></el-input>
			</el-form-item>
			<el-form-item label="处罚类型" prop="type">
				<fast-dict-select v-model="submitForm.type" dict-type="risk_control_punish_type" clearable placeholder="处罚类型"> </fast-dict-select>
			</el-form-item>
			<el-form-item label="处罚天数" prop="duration">
				<el-input-number v-model="submitForm.duration" :min="0" :step="1" />
			</el-form-item>
			<el-form-item label="处罚提示" prop="remark">
				<el-input v-model="submitForm.remark" clearable placeholder="处罚提示内容"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button type="primary" @click="addPunishSubmit"> 提交 </el-button>
				<el-button @click="cancelHandle">取消</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { cancelPunishApi, addPunishApi } from '@/api/riskControl/punish'
import { ElMessage } from 'element-plus'

const state: IHooksOptions = reactive({
	dataListUrl: '/admin/sys/user/user-punish-list',
	createdIsNeed: true,
	queryForm: {
		userId: '',
		status: '',
		startDate: '',
		endDate: '',
		type: ''
	}
})

const submitForm = reactive({
	type: '',
	userId: '',
	duration: 0,
	remark: ''
})
const dataFormRef = ref()
const dialogVisible = ref(false)

const dateTimeValue = ref('')
const queryRef = ref()

const cancelPunish = (row: any) => {
	let dataForm = {
		id: row.id,
		type: row.type,
		userId: row.userId
	}
	cancelPunishApi(dataForm)
		.then(res => {
			ElMessage({
				message: '解除成功',
				type: 'success',
				plain: true
			})
			getDataList()
		})
		.catch(() => {
			ElMessage({
				message: '解除失败',
				type: 'error',
				plain: true
			})
		})
}

const addPunish = () => {
	dialogVisible.value = true
}

const addPunishSubmit = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		addPunishApi(submitForm)
			.then(res => {
				ElMessage({
					message: '添加成功',
					type: 'success',
					plain: true
				})
				dialogVisible.value = false
				dataFormRef.value.resetFields()
				getDataList()
			})
			.catch(() => {
				ElMessage({
					message: '添加失败',
					type: 'error',
					plain: true
				})
			})
	})
}
const dataRules = ref({
	type: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	userId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	duration: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	remark: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

const cancelHandle = () => {
	dialogVisible.value = false
	submitForm.type = ''
	submitForm.duration = 0
	submitForm.userId = ''
	submitForm.remark = ''
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

<style scoped lang="scss"></style>
