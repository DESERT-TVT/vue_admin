<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query">
				<el-form ref="queryRef" :inline="true" :model="state.queryForm">
					<el-form-item prop="UID">
						<el-input v-model="state.queryForm.userId" placeholder="UID"></el-input>
					</el-form-item>

					<el-form-item prop="gender">
						<fast-dict-select v-model="state.queryForm.botType" dict-type="bot_var" placeholder="功能"></fast-dict-select>
					</el-form-item>
					<el-form-item>
						<el-button icon="Search" type="primary" @click="getDataList()">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button v-auth="'sys:bot'" icon="Delete" plain type="danger" @click="deleteBatchHandle()">批量删除 </el-button>
					</el-form-item>
					<el-form-item>
						<el-button v-auth="'sys:bot'" icon="Plus" type="primary" @click="addOrUpdateHandle()">新增</el-button>
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
					:data="state.dataList"
					border
					class="layout-table"
					@selection-change="selectionChangeHandle"
				>
					<el-table-column type="selection" header-align="center" align="center" width="38"></el-table-column>
					<el-table-column fixed prop="userId" label="UID" header-align="center" align="center"></el-table-column>
					<el-table-column prop="nickname" label="昵称" header-align="center" align="center">
						<template #default="scope">
							<!--              <el-button @click="showUserInfo(scope.row.userId)" type="success" text>{{ scope.row.nickname }} </el-button>-->
							{{ scope.row.nickname }}
						</template>
					</el-table-column>
					<el-table-column prop="type" label="类型" header-align="center" align="center">
						<template #default="scope">
							<div v-if="scope.row.botType === 1">点赞</div>
							<div v-if="scope.row.botType === 2">评论</div>
						</template>
					</el-table-column>
					<!--          <fast-dict-column prop="gender" label="性别" dict-type="user_gender"></fast-dict-column>-->

					<el-table-column label="操作" fixed="right" header-align="center" align="center">
						<template #default="scope">
							<el-button v-auth="'user:update'" link type="primary" @click="updateRefHandle(scope.row)"> 修改信息 </el-button>
							<el-button v-auth="'user:update'" type="primary" link @click="deleteBatchHandle(scope.row.userId)"> 删除 </el-button>
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
	<!-- 弹窗, 新增 / 修改 -->
	<add-or-update ref="addOrUpdateRef" @refresh-data-list="getDataList"></add-or-update>
	<!-- 详情 -->
	<user-info ref="userInfoRef" @refresh-data-list="getDataList"></user-info>

	<update ref="updateRef" @refresh-data-list="getDataList"></update>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import UserInfo from './info.vue'
import { IHooksOptions } from '@/hooks/interface'
import AddOrUpdate from '@/views/bot/botList/add-or-update.vue'
import Update from '@/views/bot/botList/update.vue'

const state: IHooksOptions = reactive({
	dataListUrl: '/admin/sys/user/page',
	deleteUrl: '/admin/sys/user/bot/delete',
	queryForm: {
		userId: '',
		botType: 1,
		// 机器人标识
		bot: 1
	}
})
const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const queryRef = ref()
const userInfoRef = ref()
const showUserInfo = (id?: number) => {
	userInfoRef.value.init(id)
}
const updateRef = ref()
const updateRefHandle = (row: any) => {
	updateRef.value.init(row)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, reset, deleteBatchHandle } = useCrud(state)
</script>
