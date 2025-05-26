<template>
	<!-- 分享主播弹窗 -->
	<el-dialog v-model="visible" size="40%" title="推荐榜">
		<!--		<div style="display: flex; justify-content: start; margin-bottom: 20px">-->
		<!--			<el-select v-model="siteId" clearable placeholder="选择要分享的站点" style="width: 200px">-->
		<!--				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />-->
		<!--			</el-select>-->
		<!--		</div>-->
		<el-input v-model="state.queryForm.userId" placeholder="请输入要推荐的UID" style="width: 200px" />
		<el-button style="margin-left: 20px" type="primary" @click="getDataList">查询</el-button>
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
			<el-table-column v-if="false" align="center" header-align="center" label="魅力等级" prop="charmLevel">
				<template #default="scope">
					<el-tag>{{ scope.row.charmLevel }} </el-tag>
				</template>
			</el-table-column>
			<!--      如果被勾选则显示-->
			<!--			<el-table-column align="center" header-align="center" label="排序">-->
			<!--				<template #header="{ column }">-->
			<!--					{{ column.label }}-->
			<!--					<el-tooltip effect="dark" content="推荐榜排序，数字越高排名越靠前" placement="top">-->
			<!--						<el-text type="info">-->
			<!--							<el-icon>-->
			<!--								<QuestionFilled />-->
			<!--							</el-icon>-->
			<!--						</el-text>-->
			<!--					</el-tooltip>-->
			<!--				</template>-->
			<!--				<template #default="scope">-->
			<!--					<el-input-number v-model="scope.row.sort" min="0" step="1"></el-input-number>-->
			<!--				</template>-->
			<!--			</el-table-column>-->
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
		<template #footer>
			<div style="margin-top: 20px; display: flex; justify-content: end">
				<el-button @click="handleDrawerClose">取消</el-button>
				<el-button v-auth="'sys:recommended:anchor:add'" type="primary" @click="confirm">确定</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import { APIRecommended, APIRecommendedAnchor } from '@/api/social/social'
import { ElMessage } from 'element-plus'
import { ElLoading } from 'element-plus/es'
import { QuestionFilled } from '@element-plus/icons-vue'

const emit = defineEmits(['refreshDataList', 'getDataList'])
const availableUsers = ref([])
const visible = ref(false)
const state: IHooksOptions = reactive({
	primaryKey: 'userId',
	dataListUrl: '/admin/social/recommend/anchor/user/list',
	queryForm: {
		userId: ''
	}
})
const handleDrawerClose = () => {
	visible.value = false
}
const init = () => {
	getDataList()
	visible.value = true
}

const confirm = () => {
	availableUsers.value = state.dataListSelectionKeys
	if (availableUsers.value.length === 0) {
		ElMessage({
			message: '请选择要推荐的用户',
			type: 'warning',
			duration: 1000
		})
		return
	}
	console.log(availableUsers.value)
	const params = {
		userIds: availableUsers.value
	}
	// if (availableUsers.value.length % 3 != 0) {
	// 	ElMessage({
	// 		message: '推荐用户数量必须是3的倍数,例如3，6，9（方便前端显示分页）',
	// 		type: 'warning',
	// 		duration: 3000
	// 	})
	// 	return
	// }

	const loading = ElLoading.service({
		lock: true,
		text: '推荐中',
		background: 'rgba(0, 0, 0, 0.7)'
	})
	APIRecommendedAnchor(params)
		.then((resp: any) => {
			if (resp.code === 0) {
				ElMessage({
					message: '推荐成功',
					type: 'success',
					duration: 1000
				})
			}
		})
		.finally(() => {
			emit('refreshDataList')
			loading.close()
			handleDrawerClose()
		})
}
const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle } = useCrud(state)
defineExpose({
	init
})
</script>
