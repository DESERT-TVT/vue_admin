<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item prop="giftName">
				<el-input v-model="state.queryForm.giftName" clearable placeholder="名称"></el-input>
			</el-form-item>
			<el-form-item prop="type">
				<fast-dict-select v-model="state.queryForm.category" clearable dict-type="social_gift_category" placeholder="类型"></fast-dict-select>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'sys:gift:list'" icon="Search" type="primary" @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button icon="RefreshRight" @click="reset(queryRef)">重置</el-button>
			</el-form-item>
		</el-form>
	</el-card>
	<el-card class="layout-query">
		<el-form :inline="true">
			<!--			<el-form-item>-->
			<!--				<div>-->
			<!--					<span>默认解锁个人首页所需礼物</span>-->
			<!--				</div>-->
			<!--			</el-form-item>-->
			<!--			<el-form-item>-->
			<!--				<el-select v-model="defaultPersonalValue" placeholder="默认解锁个人首页所需礼物">-->
			<!--					<el-option v-for="item in defaultPersonalOptions" :key="item.id" :label="item.name" :value="item.id" />-->
			<!--				</el-select>-->
			<!--			</el-form-item>-->
			<el-form-item>
				<div>
					<span>默认解锁个人联系方式所需礼物</span>
				</div>
			</el-form-item>
			<el-form-item>
				<el-select v-model="defaultSocialAccountValue" placeholder="默认解锁个人联系方式所需礼物">
					<el-option v-for="item in defaultPersonalOptions" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="saveDefaultGift()">保存</el-button>
			</el-form-item>
		</el-form>
	</el-card>

	<el-card>
		<el-space>
			<el-space>
				<el-button v-auth="'sys:gift:list'" icon="Plus" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-space>
			<el-space>
				<el-button v-auth="'sys:gift:list'" icon="Delete" plain type="danger" @click="deleteBatchHandle()"> 批量删除 </el-button>
			</el-space>
		</el-space>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table" @selection-change="selectionChangeHandle">
			<el-table-column align="center" header-align="center" type="selection" width="38"></el-table-column>
			<el-table-column align="center" header-align="center" label="ID" prop="id"></el-table-column>
			<el-table-column align="center" header-align="center" label="礼物名称" prop="giftName"></el-table-column>
			<el-table-column align="center" header-align="center" label="礼物价值" prop="giftValue"></el-table-column>
			<el-table-column align="center" header-align="center" label="礼物图片" prop="giftImg">
				<template #default="scope">
					<el-popover :width="383" placement="right" trigger="hover">
						<template #reference>
							<el-image :src="scope.row.giftImg" style="margin-top: 7px; height: 60px; border-radius: 6px" />
						</template>
						<template #default>
							<el-image :src="scope.row.giftImg" style="width: 356px" />
						</template>
					</el-popover>
				</template>
			</el-table-column>
			<fast-dict-column dict-type="social_gift_category" label="礼物类别" prop="category"></fast-dict-column>
			<el-table-column align="center" header-align="center" label="创建时间" prop="createTime"></el-table-column>
			<el-table-column align="center" header-align="center" label="创建者" prop="creatorName"></el-table-column>
			<el-table-column align="center" label="状态" prop="status">
				<template #default="scope">
					<el-switch
						v-model="scope.row.status"
						:active-value="1"
						:inactive-value="0"
						active-text="启用"
						class="mb-2"
						inactive-text="禁用"
						inline-prompt
						style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
						@change="handleStatusChange(scope.row)"
					/>
				</template>
			</el-table-column>
			<el-table-column align="center" header-align="center" label="飘屏通知" prop="bannerNotify">
				<template #default="scope">
					<el-switch
						v-model="scope.row.bannerNotify"
						:active-value="1"
						:inactive-value="0"
						active-text="开启"
						inactive-text="关闭"
						inline-prompt
						@click="() => handleStatusChange(scope.row)"
					></el-switch>
				</template>
			</el-table-column>
			<el-table-column align="center" fixed="right" header-align="center" label="操作" width="160">
				<template #default="scope">
					<el-button link type="primary" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button link type="primary" @click="deleteBatchHandle(scope.row.id)">删除</el-button>
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
import { ElLoading, ElMessage } from 'element-plus'
import { APIGetAllGiftList, APISaveDefaultGift, giftSubmitApi } from '@/api/social/socialGift'
import { DefaultGiftSaveVO, Gift } from '@/types/social'

const state: IHooksOptions = reactive({
	dataListUrl: '/admin/social/gift/page',
	deleteUrl: '/admin/social/gift/delete',
	queryForm: {
		category: '',
		giftName: ''
	}
})

const queryRef = ref()
const addOrUpdateRef = ref()

// const defaultPersonalValue = ref('')
const defaultSocialAccountValue = ref('')

const defaultPersonalOptions = ref<Gift[]>([])

const getDefaultGiftList = () => {
	APIGetAllGiftList()
		.then(resp => {
			console.log('默认礼物', resp.data.giftList)
			defaultPersonalOptions.value = resp.data.giftList
			// defaultPersonalValue.value = resp.data.defaultPersonalGift
			defaultSocialAccountValue.value = resp.data.defaultSocialAccountGift
		})
		.catch(err => {
			ElMessage({
				message: '获取礼物列表失败',
				type: 'error',
				duration: 2 * 1000
			})
		})
}
getDefaultGiftList()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}
const handleStatusChange = (row: any) => {
	const dataForm = {
		id: row.id,
		status: row.status,
		bannerNotify: row.bannerNotify
	}
	giftSubmitApi(dataForm).then(() => {
		ElMessage({
			message: '修改成功',
			type: 'success',
			plain: true
		})
	})
}
//  保存默认礼物
const saveDefaultGift = () => {
	const loading = ElLoading.service({
		lock: true,
		text: '保存默认礼物',
		background: 'rgba(0, 0, 0, 0.7)'
	})
	const params: DefaultGiftSaveVO = {
		// defaultPersonalGift: defaultPersonalValue.value,
		defaultSocialAccountGift: defaultSocialAccountValue.value
	}
	APISaveDefaultGift(params)
		.then(resp => {
			if (resp.data) {
				ElMessage({
					message: '保存成功',
					type: 'success',
					plain: true
				})
			} else {
				ElMessage({
					message: '保存失败,稍后再试',
					type: 'error',
					plain: true
				})
			}
		})
		.catch(err => {
			ElMessage({
				message: '保存失败,稍后再试',
				type: 'error',
				plain: true
			})
		})
		.finally(() => {
			loading.close()
		})
}

const sendRef = ref()
const sendHandle = (row: any) => {
	sendRef.value.init(row)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud(state)
</script>
