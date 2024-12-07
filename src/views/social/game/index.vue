<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query">
				<el-form :inline="true" :model="state.queryForm">
					<el-form-item prop="userId">
						<el-input v-model="state.queryForm.userId" placeholder="UID"></el-input>
					</el-form-item>
					<el-form-item prop="account">
						<el-input v-model="state.queryForm.account" placeholder="账户"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button icon="Search" type="primary" @click="queryHandle">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button icon="RefreshRight" @click="resetHandle">重置</el-button>
					</el-form-item>
				</el-form>
			</el-card>

			<!-- table -->
			<el-card>
				<el-table
					v-loading="state.dataListLoading"
					show-overflow-tooltip
					:data="state.dataList"
					border
					class="layout-table"
					style="width: 100%"
					:border="parentBorder"
					@selection-change="selectionChangeHandle"
				>
					<el-table-column type="selection" header-align="center" align="center" width="38"></el-table-column>
					<el-table-column type="expand" label="详情" header-align="center" align="center" width="68">
						<template #default="props">
							<div m="4">
								<el-table :data="props.row.detail" :border="childBorder">
									<el-table-column label="转盘选项：" prop="gameDetailName" />
									<!--                  <el-table-column label="gameId" prop="gameId" />-->
								</el-table>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="userId" label="UID" header-align="center" align="center"></el-table-column>
<!--					<el-table-column prop="gameName" label="道具名称" header-align="center" align="center"></el-table-column>-->
					<el-table-column prop="gamePrice" label="转盘价格" header-align="center" align="center"></el-table-column>
					<el-table-column label="详情" fixed="right" header-align="center" align="center" width="120">
						<template #default="scope">
							<el-button type="text" @click="() => getDetail(scope.row)">详情</el-button>
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

	<el-drawer v-model="drawer" title="明细" :with-header="true" direction="rtl" size="45%">
		<el-table :data="gameDetail" style="width: 100%">
			<el-table-column prop="uid" label="用户id"></el-table-column>
			<el-table-column prop="nickname" label="用户昵称"></el-table-column>
			<el-table-column prop="gameDetailName" label="中奖内容"></el-table-column>
			<el-table-column prop="createTime" label="中奖时间"></el-table-column>
		</el-table>
	</el-drawer>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import { ElDrawer, ElMessage } from 'element-plus'
import { APIGetUnionDetailList, APIModifyUnionActive } from '@/api/union/union'
import { APIGetGameDetailList } from '@/api/social/socialGame'

const parentBorder = ref(false)
const childBorder = ref(false)

const loading = ref(false)
const drawer = ref(false)

// const queryRef = ref()
const state: IHooksOptions = reactive({
	dataListUrl: '/admin/social/game/list',
	queryForm: {
		userId: '',
		account: ''
	}
})

const gameDetail = ref([])

const getDetail = async (row: any) => {
	drawer.value = true
	APIGetGameDetailList(row.id)
		.then(resp => {
			gameDetail.value = resp.data
		})
		.catch(() => {
			ElMessage({
				message: '操作失败',
				type: 'error',
				plain: true
			})
			loading.value = false
		})
		.finally(() => {})
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, reset } = useCrud(state)

const queryHandle = () => {
	loading.value = true
	getDataList()
	loading.value = false
}

const resetHandle = () => {
	state.queryForm.userId = ''
}
</script>

<style scoped lang="scss">
body {
	margin: 0;
}
.example-showcase .el-loading-mask {
	z-index: 9;
}
</style>
