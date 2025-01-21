<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query">
				<el-form :inline="true" :model="state.queryForm">
					<el-form-item prop="userId">
						<el-input v-model="state.queryForm.userId" placeholder="UID"></el-input>
					</el-form-item>
					<el-form-item prop="status">
						<el-select v-model="state.queryForm.type" placeholder="Select" @change="changeType()">
							<el-option v-for="item in onlineType" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button icon="Search" type="primary" @click="queryHandle">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button icon="RefreshRight" @click="resetHandle">重置</el-button>
					</el-form-item>
					<el-form-item>
						<el-button v-auth="'sys:share:user:add'" icon="Plus" type="primary" @click="shareOnline">分享主播 </el-button>
					</el-form-item>
					<el-form-item>
						<el-button v-auth="'sys:share:user:del'" :disabled="state.queryForm.type === 2" icon="Plus" type="danger" @click="deleteBatchHandle()">
							批量收回主播
						</el-button>
					</el-form-item>
				</el-form>
			</el-card>
			<el-card>
				<div>
					当前站点主播抽成比例：
					<el-input-number
						v-model="state.extend"
						v-auth="'sys:share:user:rate'"
						:max="1"
						:min="0"
						:step="0.01"
						@change="changeExtend"
					></el-input-number>
				</div>

				<el-table
					v-loading="state.dataListLoading"
					:data="state.dataList"
					border
					class="layout-table"
					show-overflow-tooltip
					style="width: 100%"
					@selection-change="selectionChangeHandle"
				>
					<el-table-column align="center" header-align="center" type="selection" width="38"></el-table-column>
					<el-table-column align="center" header-align="center" label="UID" prop="userId"></el-table-column>
					<el-table-column align="center" header-align="center" label="名称" prop="nickname"></el-table-column>
					<el-table-column align="center" header-align="center" label="头像" width="150">
						<template #default="scope">
							<div v-if="scope.row.avatar">
								<el-image
									:initial-index="4"
									:max-scale="7"
									:min-scale="0.2"
									:preview-src-list="scope.row.avatar"
									:preview-teleported="true"
									:src="scope.row.avatar"
									:zoom-rate="1.2"
									fit="cover"
									style="width: 100px; height: 100px"
								/>
							</div>
						</template>
					</el-table-column>
					<el-table-column v-if="state.queryForm.type === 1" align="center" header-align="center" label="分享至" prop="siteName"></el-table-column>
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
	<add-or-update ref="addOrUpdateRef" @get-data-list="getDataList"></add-or-update>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import AddOrUpdate from '@/views/site/user/add-or-update.vue'
import { APIModifySiteUserRate } from '@/api/site/site'
import { ElMessage } from 'element-plus'

const changeExtend = (currentValue: number | undefined, oldValue: number | undefined) => {
	const params = {
		rate: currentValue
	}
	APIModifySiteUserRate(params).then((resp: any) => {
		if (resp.code === 0) {
			ElMessage.success('修改成功')
		}
	})
}
const loading = ref(false)
const state: IHooksOptions = reactive({
	dataListUrl: '/admin/sys/user/site/online/page',
	queryForm: {
		type: 1
	},
	deleteUrl: '/admin/sys/user/site/share/del'
})
const addOrUpdateRef = ref()

const changeType = () => {
	getDataList()
}

const onlineType = ref([
	{ value: 1, label: '本站共享' },
	{ value: 2, label: '外站主播' }
])
const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
const queryHandle = () => {
	loading.value = true
	getDataList()
	loading.value = false
}
const shareOnline = () => {
	addOrUpdateRef.value.init()
}

const resetHandle = () => {
	state.queryForm.userId = ''
	getDataList()
}
</script>

<style lang="scss" scoped>
body {
	margin: 0;
}

.example-showcase .el-loading-mask {
	z-index: 9;
}
</style>
