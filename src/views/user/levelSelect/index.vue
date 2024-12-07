<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query">
				<el-form ref="queryRef" :inline="true" :model="state.queryForm">
					<el-form-item prop="userId">
						<el-input v-model="state.queryForm.userId" clearable placeholder="父级UID" @change="userIdChange()"></el-input>
					</el-form-item>
					<el-form-item prop="phoneOrEmail">
						<el-input v-model="state.queryForm.phoneOrEmail" clearable placeholder="父级手机号/邮箱" @change="phoneOrEmailChange()"></el-input>
					</el-form-item>

					<el-form-item>
						<el-button v-auth="'sys:user:info'" icon="Search" type="primary" @click="getDataList()">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button icon="RefreshRight" @click="reset(queryRef)">重置</el-button>
					</el-form-item>
				</el-form>
			</el-card>
			<el-row :gutter="20">
				<el-col :span="8">
					<el-card class="statistic" shadow="always">
						<el-statistic :value="state.total" title="总人数" />
					</el-card>
				</el-col>
				<el-col :span="8">
					<el-card class="statistic" shadow="always">
						<el-statistic :value="state.extend ? state.extend.buyVipMoneyCount : 0">
							<template #title>
								<div style="display: inline-flex; align-items: center">购买VIP总金额</div>
							</template>
						</el-statistic>
					</el-card>
				</el-col>
				<el-col :span="8">
					<el-card class="statistic" shadow="always">
						<el-statistic :value="state.extend ? state.extend.buyGoldCoinsMoneyCount : 0" title="购买金币总金额" />
					</el-card>
				</el-col>
			</el-row>
			<el-card>
				<el-table
					v-loading="state.dataListLoading"
					:data="state.dataList"
					border
					class="layout-table"
					show-overflow-tooltip
					height="60vh"
					@selection-change="selectionChangeHandle"
				>
					<el-table-column align="center" header-align="center" type="selection" width="38"></el-table-column>
					<el-table-column align="center" header-align="center" label="父级UID" prop="parentUserId"></el-table-column>
					<el-table-column align="center" header-align="center" label="UID" prop="userId"></el-table-column>
					<el-table-column align="center" header-align="center" label="头像&昵称" width="150">
						<template #default="scope">
							<el-popover :width="383" placement="right" trigger="hover">
								<template #reference>
									<el-image :src="scope.row.avatar" style="margin-top: 7px; height: 60px; border-radius: 6px" />
								</template>
								<template #default>
									<el-image :src="scope.row.avatar" style="width: 356px" />
								</template>
							</el-popover>
							<br />
							{{ scope.row.nickname }}
						</template>
					</el-table-column>
					<el-table-column align="center" header-align="center" label="手机号" prop="mobile"></el-table-column>
					<el-table-column align="center" header-align="center" label="邮箱" prop="email"></el-table-column>
					<el-table-column align="center" header-align="center" label="认证信息">
						<template #default="scope">
							<span v-if="scope.row.online == 1">
								<el-tag type="primary">主播</el-tag>
							</span>
							<br />
							<span v-if="scope.row.realer == 1">
								<el-tag type="primary">真人</el-tag>
							</span>
							<br />
							<span v-if="scope.row.goddess == 1">
								<el-tag type="primary">女神</el-tag>
							</span>
						</template>
					</el-table-column>
					<el-table-column align="center" header-align="center" label="相册" prop="fileUrl">
						<template #default="scope">
							<el-button link type="primary" @click="getUserPhotoList(scope.row.userId)">相册 </el-button>
						</template>
					</el-table-column>
					<el-table-column align="center" header-align="center" label="购买VIP金额" prop="buyVipMoney"></el-table-column>
					<el-table-column align="center" header-align="center" label="购买金币金额" prop="buyGoldCoinsMoney"></el-table-column>
					<el-table-column align="center" header-align="center" label="VIP到期时间" prop="vipExpireTime"></el-table-column>
					<el-table-column align="center" header-align="center" label="注册时间" prop="createTime"></el-table-column>
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
	<el-image-viewer v-if="seePhotoImg" :url-list="fileUrlForm.seePhotoUrl" :zoom-rate="1.2" @close="closePreview" />
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { userPhotoListApi } from '@/api/user/userIdentification'
import { ElMessage } from 'element-plus'

const state: IHooksOptions = reactive({
	dataListUrl: '/admin/sys/user/child-users',
	queryForm: {
		userId: '',
		phoneOrEmail: ''
	}
})
const seePhotoImg = ref(false)
const auditDialogVisible = ref(false)
const queryRef = ref()

const fileUrlForm = reactive({
	imgFileUrl: '',
	seePhotoUrl: [] as any[]
})

const phoneOrEmailChange = () => {
	state.queryForm.userId = ''
}
const userIdChange = () => {
	state.queryForm.phoneOrEmail = ''
}

const getUserPhotoList = (userId: number) => {
	seePhotoImg.value = true
	let params = {
		targetId: userId,
		page: 1,
		limit: 1000
	}
	userPhotoListApi(params)
		.then(res => {
			fileUrlForm.seePhotoUrl = res.data.list.map(item => item.photo)
		})
		.catch(() => {
			ElMessage({
				message: '查看相册失败',
				type: 'error',
				plain: true
			})
		})
}

const closePreview = () => {
	seePhotoImg.value = false
}
const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, reset } = useCrud(state)
</script>

<style scoped>
.el-row {
	margin-bottom: 10px;
}
.statistic {
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
