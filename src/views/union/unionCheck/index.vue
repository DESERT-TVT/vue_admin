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
					<el-table-column prop="applyName" label="申请人" header-align="center" align="center"></el-table-column>
					<el-table-column prop="idCard" label="身份证号码" header-align="center" align="center"></el-table-column>
					<el-table-column prop="phone" label="联系方式" header-align="center" align="center"></el-table-column>
					<el-table-column prop="unionName" label="公会名称" header-align="center" align="center"></el-table-column>
					<el-table-column align="center" header-align="center" label="图片" width="150">
						<template #default="scope">
							<div v-if="scope.row.checkPhoto">
								<el-image
									:initial-index="4"
									:max-scale="7"
									:min-scale="0.2"
									:preview-src-list="scope.row.checkPhotoList"
									:preview-teleported="true"
									:src="scope.row.checkPhotoList[0]"
									:zoom-rate="1.2"
									fit="cover"
									style="width: 100px; height: 100px"
								/>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="status" label="状态" header-align="center" align="center">
						<template #default="scope">
							<el-tag v-if="scope.row.status === 1" type="success">通过</el-tag>
							<el-tag v-if="scope.row.status === -1" type="danger"> 已拒绝</el-tag>
							<el-tag v-if="scope.row.status === 0" type="info">待审核</el-tag>
						</template>
					</el-table-column>
					<el-table-column align="center" header-align="center" label="拒绝原因" prop="failureReason"></el-table-column>
					<el-table-column label="操作" fixed="right" header-align="center" align="center" width="120">
						<template #default="scope">
							<div v-if="scope.row.status === 0">
								<el-button type="primary" @click="() => auditHandle(scope.row)"> 操作</el-button>
							</div>
							<div v-else>已审核</div>
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
	<!-- 主播详情抽屉 -->
	<el-drawer v-model="drawer" title="主播详情" :with-header="true" direction="rtl">
		<el-table :data="anchorData" style="width: 100%">
			<el-table-column prop="nickName" label="主播名字"></el-table-column>
			<el-table-column prop="id" label="主播ID"></el-table-column>
			<!-- 根据需求添加其他列 -->
		</el-table>
	</el-drawer>
	<!-- 审核 -->
	<el-dialog v-model="auditDialogVisible" title="公会审核">
		<!--		<el-form :model="editForm" label-width="160px">-->
		<!--			<el-form-item label="公会长分成比例(1%=0.01)">-->
		<!--				<el-input v-model="editForm.kickbackRateMaster" style="width: 200px;margin-left: 100px"></el-input>-->
		<!--			</el-form-item>-->
		<!--      <el-form-item label="主播分成比例(1%=0.01)">-->
		<!--        <el-input v-model="editForm.kickbackRateOnline" style="width: 200px;margin-left: 100px"></el-input>-->
		<!--      </el-form-item>-->
		<!--		</el-form>-->
		<el-form :model="editForm" label-width="160px">
			<el-form-item label="申请人">
				<span>{{ editForm.applyName }}</span>
			</el-form-item>
			<el-form-item label="身份证号码">
				<span>{{ editForm.idCard }}</span>
			</el-form-item>
			<el-form-item label="联系方式">
				<span>{{ editForm.phone }}</span>
			</el-form-item>
			<el-form-item label="公会名称">
				<span>{{ editForm.unionName }}</span>
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button v-auth="'sys:union:edit'" type="primary" @click="() => confirmParas(1)">通过</el-button>
				<el-button v-auth="'sys:union:edit'" @click="() => confirmParas(-1)">拒绝</el-button>
			</div>
		</template>
	</el-dialog>

	<el-dialog v-model="refuse" center width="500">
		<el-form label-width="auto" style="max-width: 600px">
			<el-form-item label="拒绝原因">
				<el-input v-model="failureReason" type="textarea" />
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button v-auth="'sys:ident:edit'" type="danger" @click="confirmRefuse()">提交</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import { ElDrawer, ElMessage } from 'element-plus'
import { APIApplyUnionSubmit, APIGetUnionDetailList, APIModifyUnionActive } from '@/api/union/union'

const auditDialogVisible = ref(false)
const loading = ref(false)
const drawer = ref(false)
const refuse = ref(false)
const failureReason = ref('')
const editForm = reactive({
	id: '',
	guildLevel: '',
	// kickbackRateMaster: '',
	// kickbackRateOnline: '',
	active: '',
	status: '',
	applyName: '',
	idCard: '',
	phone: '',
	unionName: ''
})
// const queryRef = ref()
const state: IHooksOptions = reactive({
	dataListUrl: '/admin/union/apply',
	queryForm: {
		userId: '',
		account: '',
		type: 0
	}
})
const confirmRefuse = () => {
	const params = {
		id: editForm.id,
		flag: -1,
		failureReason: failureReason.value
	}
	APIApplyUnionSubmit(params)
		.then(resp => {
			if (resp.code === 0) {
				ElMessage({
					message: '操作成功',
					type: 'success',
					plain: true
				})
			} else {
				ElMessage({
					message: '操作失败',
					type: resp.msg,
					plain: true
				})
			}
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
			refuse.value = false
		})
}
const confirmParas = (flag: number) => {
	if (flag === -1) {
		refuse.value = true
		auditDialogVisible.value = false
		return
	}
	const params = {
		id: editForm.id,
		flag: flag
		// "kickbackRateMaster": editForm.kickbackRateMaster,
		// "kickbackRateOnline": editForm.kickbackRateOnline,
	}
	APIApplyUnionSubmit(params)
		.then(resp => {
			if (resp.code === 0) {
				ElMessage({
					message: '操作成功',
					type: 'success',
					plain: true
				})
			} else {
				ElMessage({
					message: '操作失败',
					type: resp.msg,
					plain: true
				})
			}
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
			auditDialogVisible.value = false
		})
}
const anchorData = ref([])

const auditHandle = (row: any) => {
	auditDialogVisible.value = true
	editForm.id = row.id
	editForm.guildLevel = row.guildLevel
	// editForm.kickbackRateMaster = row.kickbackRateMaster
	// editForm.kickbackRateOnline = row.kickbackRateOnline
	editForm.active = row.active
	editForm.status = row.status
	editForm.guildLevel = row.guildLevel
	editForm.applyName = row.applyName // 申请人
	editForm.idCard = row.idCard // 身份证号码
	editForm.phone = row.phone // 联系方式
	editForm.unionName = row.unionName // 公会名称
	editForm.active = row.active
	editForm.status = row.status
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
