<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query">
				<el-form ref="queryRef" :inline="true" :model="state.queryForm">
					<el-form-item prop="userId">
						<el-input v-model="state.queryForm.userId" clearable placeholder="UID"></el-input>
					</el-form-item>

					<el-form-item prop="userId">
						<el-input v-model="state.queryForm.mobile" clearable placeholder="账号"></el-input>
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
					<el-table-column align="center" header-align="center" label="UID" prop="userId"></el-table-column>
					<el-table-column align="center" header-align="center" label="昵称" prop="nickname"></el-table-column>
					<el-table-column align="center" header-align="center" label="账号" prop="mobile"></el-table-column>
					<el-table-column align="center" header-align="center" label="登录设备" prop="device"></el-table-column>
					<el-table-column align="center" header-align="center" label="客户端版本号" prop="clientVersion"></el-table-column>
					<el-table-column align="center" header-align="center" label="IP">
						<template #default="scope">
							<span>{{ scope.row.address }}</span>
							<br />
							<span>{{ scope.row.ip }}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" header-align="center" label="登录状态">
						<template #default="scope">
							<el-tag v-if="scope.row.status === 1" type="success">成功</el-tag>
							<el-tag v-else type="danger">失败</el-tag>
						</template>
					</el-table-column>
					<!--					<el-table-column label="操作信息" header-align="center" align="center">-->
					<!--						<template #default="scope">-->
					<!--							<el-tag v-if="scope.row.operation == 0" type="primary">登录成功</el-tag>-->
					<!--							<el-tag v-if="scope.row.operation == 1" type="primary">退出成功</el-tag>-->
					<!--							<el-tag v-if="scope.row.operation == 2" type="primary">验证码错误</el-tag>-->
					<!--							<el-tag v-if="scope.row.operation == 3" type="primary">账号密码错误</el-tag>-->
					<!--						</template>-->
					<!--					</el-table-column>-->
					<el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
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
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'

const state: IHooksOptions = reactive({
	dataListUrl: '/admin/sys/user/front-end-login-records',
	createdIsNeed: true,
	queryForm: {
		userId: '',
		status: '',
		mobile: ''
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

<style scoped lang="scss"></style>
