<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item prop="type">
				<el-input v-model="state.queryForm.name" clearable placeholder="支付平台名称"></el-input>
			</el-form-item>
			<el-form-item prop="payType">
				<fast-dict-select v-model="state.queryForm.payType" clearable dict-type="pay_platform_config_type" placeholder="类型"></fast-dict-select>
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
				<el-button v-auth="'setting:payplatform:add'" icon="Plus" type="primary" @click="addOrUpdateHandle()">新增 </el-button>
			</el-space>
			<el-space>
				<el-button v-auth="'setting:payplatform:del'" icon="Delete" plain type="danger" @click="deleteBatchHandle()"> 批量删除 </el-button>
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
			<el-table-column align="center" header-align="center" label="名称" prop="name"></el-table-column>
			<el-table-column align="center" header-align="center" label="商户ID" prop="merchantId"></el-table-column>
			<el-table-column align="center" header-align="center" label="通道" prop="channel"></el-table-column>
			<el-table-column align="center" header-align="center" label="网关地址" prop="gateway"></el-table-column>
			<el-table-column align="center" header-align="center" label="标签" prop="tag"></el-table-column>
			<el-table-column align="center" header-align="center" label="最小金额" prop="minAmount"></el-table-column>
			<el-table-column align="center" header-align="center" label="最大金额" prop="maxAmount"></el-table-column>
			<el-table-column align="center" header-align="center" label="每日额度" prop="dailyQuota"></el-table-column>
			<fast-dict-column dict-type="pay_platform_config_type" label="支付类型" prop="payType"></fast-dict-column>
			<el-table-column align="center" header-align="center" label="文档地址" prop="docUrl"></el-table-column>
			<el-table-column align="center" header-align="center" label="序号（权重）" min-width="120" prop="sort" sortable="custom">
				<template #header="{ column }">
					{{ column.label }}
					<el-tooltip content="根据此值使用权重算法从相同支付类型的渠道中取一个" effect="dark" placement="top">
						<el-text type="info">
							<el-icon>
								<QuestionFilled />
							</el-icon>
						</el-text>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column align="center" fixed="right" header-align="center" label="操作" width="160">
				<template #default="scope">
					<el-button v-auth="'setting:payplatform:edit'" link type="primary" @click="addOrUpdateHandle(scope.row.id)"> 修改 </el-button>
					<el-button v-auth="'setting:payplatform:del'" link type="primary" @click="deleteBatchHandle(scope.row.id)"> 删除 </el-button>
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
import { QuestionFilled } from '@element-plus/icons-vue'

const state: IHooksOptions = reactive({
	dataListUrl: '/admin/config/pay/platform/list',
	deleteUrl: '/admin/config/pay/platform/deleted',
	queryForm: {
		payType: '',
		name: ''
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
