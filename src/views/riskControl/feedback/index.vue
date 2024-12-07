<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query">
				<el-form ref="queryRef" :inline="true" :model="state.queryForm">
					<el-form-item prop="userId">
						<el-input v-model="state.queryForm.userId" clearable placeholder="反馈人UID"></el-input>
					</el-form-item>
					<el-form-item prop="questionType">
						<fast-dict-select
							v-model="state.queryForm.questionType"
							clearable
							dict-type="feedback_question_type"
							placeholder="反馈类型"
						></fast-dict-select>
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
					:data="state.dataList"
					border
					class="layout-table"
					height="70vh"
					show-overflow-tooltip
					@selection-change="selectionChangeHandle"
				>
					<el-table-column align="center" header-align="center" type="selection" width="38"></el-table-column>
					<el-table-column align="center" header-align="center" label="反馈人UID" prop="userId"></el-table-column>
					<fast-dict-column dict-type="feedback_question_type" label="反馈类型" prop="questionType"></fast-dict-column>
					<el-table-column align="center" header-align="center" label="反馈内容" prop="textContent"></el-table-column>
					<el-table-column align="center" header-align="center" label="反馈文件" prop="mediaContent">
						<template #default="scope">
							<el-image
								:initial-index="0"
								:max-scale="7"
								:min-scale="0.2"
								:preview-src-list="scope.row.mediaContent?.split(',')"
								:preview-teleported="true"
								:src="scope.row.mediaContent?.split(',')[0]"
								:zoom-rate="1.2"
								fit="cover"
								style="margin-top: 7px; width: 100px; height: 100px; border-radius: 6px"
							/>
						</template>
					</el-table-column>
					<el-table-column align="center" header-align="center" label="反馈时间" prop="createTime"></el-table-column>
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
</template>

<script lang="ts" setup>
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { Picture as IconPicture } from '@element-plus/icons-vue'

const state: IHooksOptions = reactive({
	dataListUrl: '/admin/sys/user/feedback',
	createdIsNeed: true,
	queryForm: {
		userId: '',
		questionType: '',
		startDate: '',
		endDate: ''
	}
})

const dateTimeValue = ref('')
const queryRef = ref()

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
