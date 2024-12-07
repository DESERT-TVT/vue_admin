<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item prop="type">
				<el-input v-model="state.queryForm.name" clearable placeholder="名称"></el-input>
			</el-form-item>
			<el-form-item prop="type">
				<fast-dict-select v-model="state.queryForm.type" dict-type="social_banner_adver_type" clearable placeholder="类型"></fast-dict-select>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'sys:adv:list'" icon="Search" type="primary" @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button icon="RefreshRight" @click="reset(queryRef)">重置</el-button>
			</el-form-item>
		</el-form>
	</el-card>

	<el-card>
		<el-space>
			<el-space>
				<el-button v-auth="'sys:adv:add'" icon="Plus" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-space>
			<!--			<el-space>-->
			<!--				<el-button icon="Delete" plain type="danger" @click="deleteBatchHandle()"> 批量删除 </el-button>-->
			<!--			</el-space>-->
		</el-space>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="38"></el-table-column>
			<el-table-column prop="id" label="序号" header-align="center" align="center"></el-table-column>
			<fast-dict-column prop="type" label="类型" dict-type="social_banner_adver_type"></fast-dict-column>
			<el-table-column prop="name" label="广告名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="images" label="广告内容" header-align="center" align="center">
				<template #default="scope">
					<el-popover placement="right" trigger="hover" :width="383">
						<template #reference>
							<el-image :src="scope.row.images" style="margin-top: 7px; height: 60px; border-radius: 6px" />
						</template>
						<template #default>
							<el-image :src="scope.row.images" style="width: 356px" />
						</template>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column prop="jumpUrl" label="广告链接" header-align="center" align="center"></el-table-column>
			<el-table-column prop="status" label="状态" align="center">
				<template #default="scope">
					<el-switch
						v-model="scope.row.status"
						class="mb-2"
						inline-prompt
						style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
						active-text="可见"
						inactive-text="不可见"
						:active-value="1"
						:inactive-value="0"
						@change="handleStatusChange(scope.row)"
					/>
				</template>
			</el-table-column>
			<el-table-column prop="createTime" label="发布时间" header-align="center" align="center"></el-table-column>

			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="160">
				<template #default="scope">
					<el-button v-auth="'sys:adv:edit'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改 </el-button>
					<el-button v-auth="'sys:adv:del'" type="primary" link @click="deleteBatchHandle(scope.row.id)">删除 </el-button>
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
import AddOrUpdate from './add-or-update.vue'
import { bannerAdverformSubmitApi } from '@/api/social/socialBannerAdver'
import { ElMessage } from 'element-plus'

const state: IHooksOptions = reactive({
	dataListUrl: '/admin/social/banner-adver/page',
	deleteUrl: '/admin/social/banner-adver/delete',
	queryForm: {
		type: '',
		name: ''
	}
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
	bannerAdverformSubmitApi(dataForm).then(() => {
		ElMessage({
			message: '修改成功',
			type: 'success',
			plain: true
		})
	})
}

const sendRef = ref()
const sendHandle = (row: any) => {
	sendRef.value.init(row)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud(state)
</script>
