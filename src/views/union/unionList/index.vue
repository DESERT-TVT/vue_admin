<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query">
				<el-form ref="queryRef" :inline="true" :model="state.queryForm">
					<el-form-item prop="userId">
						<el-input v-model="state.queryForm.userId" placeholder="UID"></el-input>
					</el-form-item>
					<el-form-item prop="account">
						<el-input v-model="state.queryForm.account" placeholder="账户"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button v-auth="'sys:union:list'" icon="Search" type="primary" @click="getDataList">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button v-auth="'sys:union:add'" icon="Plus" type="primary" @click="addOrUpdateHandle(null)">新增</el-button>
					</el-form-item>
					<el-form-item>
						<el-button icon="RefreshRight" @click="reset(queryRef)">重置</el-button>
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
					@selection-change="selectionChangeHandle"
				>
					<el-table-column type="selection" header-align="center" align="center" width="38"></el-table-column>
					<el-table-column prop="userId" label="UID" header-align="center" align="center"></el-table-column>
					<el-table-column prop="account" label="账号" header-align="center" align="center"></el-table-column>
					<!--          <el-table-column prop="guildLevel" label="公会等级" header-align="center" align="center"></el-table-column>-->
					<el-table-column prop="anchorCount" label="主播人数" header-align="center" align="center">
						<template #default="scope">
							<el-button type="text" @click="() => getUnionDetailUser(scope.row)">{{ scope.row.anchorCount }} </el-button>
						</template>
					</el-table-column>

<!--					<el-table-column prop="kickbackRate" label="公会长分成比例" header-align="center" align="center">-->
<!--            <template #default="scope">-->
<!--              <span>{{ scope.row.kickbackRate*100 }}%</span>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--					<el-table-column prop="kickbackRateOnline" label="主播分成比例" header-align="center" align="center">-->
<!--            <template #default="scope">-->
<!--              <span>{{ scope.row.kickbackRateOnline*100 }}%</span>-->
<!--            </template>-->
<!--          </el-table-column>-->
					<el-table-column prop="establishTime" label="成立时间" header-align="center" align="center"></el-table-column>
					<el-table-column prop="operator" label="操作人" header-align="center" align="center"></el-table-column>
					<el-table-column prop="status" label="状态" header-align="center" align="center">
						<template #default="scope">
							<el-switch
								v-model="scope.row.active"
								:active-value="1"
								:inactive-value="-1"
								active-text="正常"
								inline-prompt
								inactive-text="冻结"
								@change="() => handleStatusChange(scope.row)"
							></el-switch>
						</template>
					</el-table-column>
<!--					<el-table-column label="操作" fixed="right" header-align="center" align="center" width="120">-->
<!--						<template #default="scope">-->
<!--							<el-button type="primary" @click="() => auditHandle(scope.row)"> 操作</el-button>-->
<!--						</template>-->
<!--					</el-table-column>-->
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
	<!-- 主播详情抽屉 -->
	<el-drawer v-model="drawer" title="主播详情" :with-header="true" direction="rtl">
		<el-table :data="anchorData" style="width: 100%">
			<el-table-column prop="nickname" label="主播名字"></el-table-column>
			<el-table-column prop="id" label="主播ID"></el-table-column>
			<!-- 根据需求添加其他列 -->
		</el-table>
	</el-drawer>
	<!-- 审核 -->
<!--	<el-dialog v-model="auditDialogVisible" title="操作 (0.01 ＝ 1%)">-->
<!--		<el-form :model="editForm" label-width="150px">-->
<!--			<el-form-item label="公会主播分成比例">-->
<!--				<el-input v-model="editForm.kickbackRateOnline"></el-input>-->
<!--			</el-form-item>-->
<!--			<el-form-item label="公会长分成比例">-->
<!--				<el-input v-model="editForm.kickbackRate"></el-input>-->
<!--			</el-form-item>-->
<!--		</el-form>-->
<!--		<template #footer>-->
<!--			<div class="dialog-footer">-->
<!--				<el-button v-auth="'sys:union:edit'" type="primary" @click="() => confirmParas()">提交</el-button>-->
<!--				<el-button @click="auditDialogVisible = false">取消</el-button>-->
<!--			</div>-->
<!--		</template>-->
<!--	</el-dialog>-->
	<add-or-update ref="addOrUpdateRef" @refresh-data-list="getDataList"></add-or-update>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import { ElDrawer, ElMessage } from 'element-plus'
import { APIGetUnionDetailList, APIModifyUnionActive } from '@/api/union/union'
import AddOrUpdate from '@/views/union/unionList/add-or-update.vue'

const auditDialogVisible = ref(false)
const loading = ref(false)
const drawer = ref(false)
const editForm = reactive({
	id: '',
	guildLevel: '',
	kickbackRate: '',
	status: '',
	active: '',
	kickbackRateOnline: ''
})
const addOrUpdateRef = ref()
const addOrUpdateHandle = (row: any) => {
	addOrUpdateRef.value.init(row)
}
const queryRef = ref()
const state: IHooksOptions = reactive({
	dataListUrl: '/admin/union/list',
	queryForm: {
		// startTime: '',
		// endTime: '',
		userId: '',
		account: '',
		type: 1
	}
})
const confirmParas = () => {
	loading.value = true

	APIModifyUnionActive(editForm.id, editForm.active, editForm.kickbackRate, editForm.status, editForm.kickbackRateOnline)
		.then(resp => {
			ElMessage({
				message: '操作成功',
				type: 'success',
				plain: true
			})
			loading.value = false
			console.log(resp)
		})
		.catch(() => {
			ElMessage({
				message: '操作失败',
				type: 'error',
				plain: true
			})
			loading.value = false
		})
		.finally(() => {
			getDataList()
			auditDialogVisible.value = false
		})
}

const dialogVisible = ref(false)
const anchorData = ref([])

const handleStatusChange = (row: any) => {
	loading.value = true
	APIModifyUnionActive(row.id, row.active, null, null, null)
		.then(resp => {
			ElMessage({
				message: '操作成功',
				type: 'success',
				plain: true
			})
		})
		.catch(() => {
			ElMessage({
				message: '操作失败',
				type: 'error',
				plain: true
			})
		})
		.finally(() => {
			getDataList()
			loading.value = false
		})
}
const getUnionDetailUser = async (row: any) => {
	drawer.value = true
	APIGetUnionDetailList(row.id)
		.then(resp => {
			anchorData.value = resp.data
			console.log(resp)
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
	// 获取 公会里面的具体人的信息
	// try {
	//   await APIModifyUnionActive(editForm);
	//   ElMessage.success('提交成功');
	//   auditDialogVisible.value = false;
	//   getDataList();
	// } catch (error) {
	//   ElMessage.error('提交失败');
	// }
}

const auditHandle = (row: any) => {
	auditDialogVisible.value = true
	editForm.id = row.id
	editForm.kickbackRateOnline = row.kickbackRateOnline
	editForm.kickbackRate = row.kickbackRate
	editForm.status = row.status
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, reset } = useCrud(state)

const resetHandle = () => {
	// state.queryForm.userId = ''
	// state.queryForm.account = ''
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
