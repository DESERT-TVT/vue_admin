<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query">
				<el-form :inline="true" :model="state.queryForm">
					<el-form-item prop="userId">
						<el-input v-model="texts" placeholder="评论话术" style="width: 450px"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button icon="Plus" type="primary" @click="queryHandle">新增</el-button>
					</el-form-item>
					<el-form-item>
						<el-button icon="Search" type="primary" @click="getDataList()">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button v-auth="'sys:bot'" icon="Delete" plain type="danger" @click="deleteBatchHandle()">批量删除 </el-button>
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
					<el-table-column prop="text" label="打招呼话术列表" header-align="center" align="center"></el-table-column>
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
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import { ElDrawer, ElMessage } from 'element-plus'
import { APIGetUnionDetailList, APIModifyUnionActive } from '@/api/union/union'
import { APIGetGameDetailList } from '@/api/social/socialGame'
import { APISaveBotText } from '@/api/sys/user'

const parentBorder = ref(false)
const loading = ref(false)

const state: IHooksOptions = reactive({
	dataListUrl: '/admin/sys/user/bot/comment/text',
	deleteUrl: '/admin/sys/user/bot/comment/del',
	queryForm: {
		textType: 2
	}
})

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud(state)
const texts = ref('')
const queryHandle = () => {
	const params = {
		texts: texts.value,
		textType: 2
	}
	APISaveBotText(params).then(res => {
		if (res) {
			ElMessage.success('添加成功')
			texts.value = ''
		}
	})
	getDataList()
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
