<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item prop="giftName">
				<el-input v-model="state.queryForm.userId" clearable placeholder="UID"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button icon="Plus" type="primary" @click="add()">新增</el-button>
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
				<el-button v-auth="'sys:recommended:add'" icon="Plus" type="primary" @click="addOrUpdateHandle()">新增 </el-button>
			</el-space>
			<el-space>
				<el-button v-auth="'sys:recommended:del'" icon="Delete" plain type="danger" @click="deleteBatchHandle()"> 批量删除 </el-button>
			</el-space>
		</el-space>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table" @selection-change="selectionChangeHandle">
			<el-table-column align="center" header-align="center" type="selection" width="38"></el-table-column>
			<el-table-column align="center" header-align="center" label="ID" prop="id"></el-table-column>
			<el-table-column align="center" header-align="center" label="用户id" prop="userId"></el-table-column>
			<el-table-column align="center" header-align="center" label="昵称" prop="nickname"></el-table-column>
			<el-table-column align="center" header-align="center" label="发布动态数量" prop="dynamicCount"></el-table-column>
			<el-table-column align="center" header-align="center" label="头像" prop="avatar">
				<template #default="scope">
					<el-popover :width="383" placement="right" trigger="hover">
						<template #reference>
							<el-image :src="scope.row.avatar" style="margin-top: 7px; height: 60px; border-radius: 6px" />
						</template>
						<template #default>
							<el-image :src="scope.row.avatar" style="width: 356px" />
						</template>
					</el-popover>
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

		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update ref="addOrUpdateRef" @refresh-data-list="getDataList"></add-or-update>
	</el-card>
</template>

<script lang="ts" setup>
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import AddOrUpdate from './add-or-update.vue'

const state: IHooksOptions = reactive({
	dataListUrl: '/admin/social/recommend/page',
	deleteUrl: '/admin/social/recommend/del',
	queryForm: {
		userId: ''
	}
})

const queryRef = ref()
const addOrUpdateRef = ref()

const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const add = () => {
	addOrUpdateRef.value.init()
}
const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud(state)
</script>
