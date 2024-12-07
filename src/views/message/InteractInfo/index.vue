<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item prop="messageType">
				<fast-dict-select v-model="state.queryForm.messageType" dict-type="hudong_message_type" clearable placeholder="消息类型"></fast-dict-select>
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
		<el-space>
			<el-space>
				<el-button v-auth="'message:interactinfo:del'" icon="Delete" plain type="danger" @click="deleteBatchHandle()"> 批量删除 </el-button>
			</el-space>
		</el-space>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="38"></el-table-column>
			<el-table-column align="center" header-align="center" label="发起人UID" prop="creator">
				<template #default="scope">
					<span v-if="scope.row.creator"> {{ scope.row.creator }}</span>
					<span v-else>系统</span>
				</template>
			</el-table-column>
			<el-table-column align="center" header-align="center" label="接收人UID" prop="recipientId"></el-table-column>
			<fast-dict-column prop="messageType" label="消息类型" dict-type="hudong_message_type"></fast-dict-column>
			<el-table-column prop="content" label="消息内容" header-align="center" align="center"></el-table-column>
			<el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="160">
				<template #default="scope">
					<el-button v-auth="'message:interactinfo:del'" link type="primary" @click="deleteBatchHandle(scope.row.id)"> 删除 </el-button>
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

		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update ref="addOrUpdateRef" @refresh-data-list="getDataList"></add-or-update>
	</el-card>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'

const state: IHooksOptions = reactive({
	dataListUrl: '/admin/message/interactive/page',
	deleteUrl: '/admin/message/interactive/delete',
	queryForm: {
		messageType: '',
		isRead: ''
	}
})

const queryRef = ref()
const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const sendRef = ref()
const sendHandle = (row: any) => {
	sendRef.value.init(row)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud(state)
</script>
