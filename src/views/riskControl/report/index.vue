<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query">
				<el-form ref="queryRef" :inline="true" :model="state.queryForm">
					<el-form-item prop="userId">
						<el-input v-model="state.queryForm.userId" clearable placeholder="UID"></el-input>
					</el-form-item>

					<el-form-item prop="userId">
						<el-input v-model="state.queryForm.targetUserId" clearable placeholder="被举报人UID"></el-input>
					</el-form-item>

					<!--					<el-form-item prop="status">-->
					<!--						<fast-dict-select v-model="state.queryForm.type" dict-type="identification_status" clearable placeholder="处罚内容"> </fast-dict-select>-->
					<!--					</el-form-item>-->

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
					<el-table-column prop="userId" label="举报人UID" header-align="center" align="center"></el-table-column>
					<el-table-column prop="targetUserId" label="被举报人UID" header-align="center" align="center"></el-table-column>
					<el-table-column prop="content" label="举报内容" header-align="center" align="center"></el-table-column>
					<el-table-column prop="images" label="文件" header-align="center" align="center">
						<template #default="scope">
							<el-popover placement="right" trigger="hover" :width="383">
								<template #reference>
									<el-image :src="scope.row.file" style="margin-top: 7px; height: 60px; border-radius: 6px" />
								</template>
								<template #default>
									<el-image :src="scope.row.file" style="width: 356px" />
								</template>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column prop="createTime" label="举报时间" header-align="center" align="center"></el-table-column>
					<el-table-column align="center" header-align="center" label="操作人" prop="updater"></el-table-column>
					<el-table-column align="center" header-align="center" label="状态" prop="status">
						<template #default="scope">
							<el-tag v-if="scope.row.status == 1" type="danger">未处理</el-tag>
							<el-tag v-else-if="scope.row.status == 2" type="success">已处理</el-tag>
							<el-tag v-else-if="scope.row.status == 3" type="warning">驳回</el-tag>
						</template>
					</el-table-column>
					<el-table-column align="center" fixed="right" header-align="center" label="操作" width="150">
						<template #default="scope">
							<div v-if="scope.row.status == 1">
								<el-button v-auth="'riskcontrol:report:edit'" link type="primary" @click="handleReportClick(scope.row)">处理 </el-button>
								<el-popconfirm
									v-auth="'riskcontrol:report:edit'"
									:icon="InfoFilled"
									cancel-button-text="取消"
									confirm-button-text="确认"
									icon-color="#e6a23c"
									title="确认不处理本条举报吗?"
									width="200px"
									@confirm="notHandleReportClick(scope.row)"
								>
									<template #reference>
										<el-button link type="primary"> 不处理</el-button>
									</template>
								</el-popconfirm>
							</div>
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

	<el-dialog v-model="dialogVisible" :show-close="false" center title="举报处理" width="400px">
		<el-form ref="dataFormRef" :model="submitForm" :rules="dataRules">
			<el-form-item label="处罚类型" prop="type">
				<fast-dict-select v-model="submitForm.type" clearable dict-type="risk_control_punish_type" placeholder="处罚类型"></fast-dict-select>
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
				<el-button type="primary" @click="handleReport"> 提交 </el-button>
				<el-button @click="cancelHandle">取消</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { handleReportApi, notHandleReportApi } from '@/api/riskControl/report'
import { ElMessage } from 'element-plus'
import { InfoFilled } from '@element-plus/icons-vue'

const state: IHooksOptions = reactive({
	dataListUrl: '/admin/sys/user/user-report-list',
	createdIsNeed: true,
	queryForm: {
		userId: '',
		status: '',
		targetUserId: '',
		startDate: '',
		endDate: ''
	}
})

const submitForm = reactive({
	id: '',
	type: '',
	duration: 0,
	targetUserId: '',
	remark: ''
})
const dataFormRef = ref()
const cancelHandle = () => {
	dialogVisible.value = false
	submitForm.id = ''
	submitForm.type = ''
	submitForm.duration = 0
	submitForm.remark = ''
}

const dialogVisible = ref(false)

const dateTimeValue = ref('')
const queryRef = ref()

const dataRules = ref({
	type: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	duration: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	remark: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

const handleReportClick = (row: any) => {
	dialogVisible.value = true
	submitForm.id = row.id
	submitForm.targetUserId = row.targetUserId
}

const notHandleReportClick = (row: any) => {
	submitForm.id = row.id
	notHandleReportApi(submitForm)
		.then(res => {
			ElMessage({
				message: '处理成功',
				type: 'success',
				plain: true
			})
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
}

const handleReport = (row: any) => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		handleReportApi(submitForm)
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

<style scoped lang="scss"></style>
