<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item prop="userId">
				<el-input v-model="state.queryForm.userId" placeholder="用户ID" clearable style="width: 200px"></el-input>
			</el-form-item>
			<el-form-item prop="event">
				<fast-dict-select
					v-model="state.queryForm.client"
					placeholder="客户端"
					dict-type="client_type"
					clearable
					style="width: 200px"
				></fast-dict-select>
			</el-form-item>
			<el-form-item prop="client">
				<fast-dict-select
					v-model="state.queryForm.event"
					placeholder="事件"
					dict-type="communication_event"
					clearable
					style="width: 200px"
				></fast-dict-select>
			</el-form-item>
			<el-form-item>
				<el-date-picker
					v-model="datePickerValue"
					type="datetimerange"
					placeholder="选择时间搜索"
					start-placeholder="开始时间"
					end-placeholder="结束时间"
					format="YYYY-MM-DD HH:mm:ss"
					value-format="YYYY-MM-DD HH:mm:ss"
					@change="datePickerChange"
				/>
			</el-form-item>
			<el-form-item>
				<el-button icon="Search" type="primary" @click="getDataList()">查询</el-button>
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
			@sort-change="sortChangeHandle"
			:data="state.dataList"
			border
			class="layout-table"
		>
			<el-table-column prop="creator" label="用户ID" header-align="center" align="center"></el-table-column>
			<fast-dict-column prop="client" label="客户端" dict-type="client_type"></fast-dict-column>
			<fast-dict-column prop="event" label="事件" dict-type="communication_event"></fast-dict-column>
			<el-table-column prop="ip" label="IP" header-align="center" align="center"></el-table-column>
			<el-table-column prop="params" label="参数" header-align="center" align="center"></el-table-column>
			<el-table-column prop="log" label="日志" header-align="center" align="center"></el-table-column>
			<el-table-column prop="userAgent" label="User-Agent" header-align="center" align="center"></el-table-column>
			<el-table-column prop="createTime" label="创建时间" header-align="center" align="center" sortable="custom"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="80">
				<template #default="scope">
					<el-button type="primary" link @click="detailHandle(scope.row)">详情</el-button>
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

		<!-- 详情 -->
		<detail ref="detailRef"></detail>
	</el-card>
</template>

<script setup lang="ts" name="Communication">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import Detail from '@/views/monitor/communication/detail.vue'
import { FormInstance } from 'element-plus'

const state: IHooksOptions = reactive({
	dataListUrl: '/admin/communication/page',
	queryForm: {
		userId: '',
		event: '',
		client: '',
		startDate: '',
		endDate: ''
	}
})

const queryRef = ref<FormInstance>()

const datePickerValue = ref()
const datePickerChange = (value: any[]) => {
	state.queryForm.startDate = value[0]
	state.queryForm.endDate = value[1]
}

const detailRef = ref()
const detailHandle = (row: any) => {
	detailRef.value.init(row)
}

const { getDataList, sizeChangeHandle, sortChangeHandle, currentChangeHandle, reset } = useCrud(state)
</script>
