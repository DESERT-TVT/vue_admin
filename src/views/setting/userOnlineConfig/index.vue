<template>
	<el-card class="layout-query">
		<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item prop="type">
				<el-input v-model="state.queryForm.userId" clearable placeholder="UID"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button icon="Search" type="primary" @click="getDataList()">查询</el-button>
			</el-form-item>
		</el-form>
	</el-card>

	<el-card>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table" @selection-change="selectionChangeHandle">
			<el-table-column align="center" header-align="center" label="UID" prop="userId"></el-table-column>
			<el-table-column align="center" header-align="center" label="是否开启视频通话" prop="openVideo">
				<template #default="scope">
					<template v-if="scope.row.openVideo === 1">
						<el-tag type="success">开启</el-tag>
					</template>
					<template v-else>
						<el-tag type="danger">关闭</el-tag>
					</template>
				</template>
			</el-table-column>
			<el-table-column align="center" header-align="center" label="视频私聊价格" prop="videoChatPrice"></el-table-column>
			<el-table-column align="center" header-align="center" label="文字私聊价格" prop="textChatPrice"></el-table-column>
			<el-table-column align="center" header-align="center" label="语音私聊价格" prop="voiceChatPrice"></el-table-column>
			<!--			<el-table-column align="center" header-align="center" label="主动外呼" prop="activeOutCall">-->
			<!--				<template #default="scope">-->
			<!--					<template v-if="scope.row.activeOutCall === 1">-->
			<!--						<el-tag type="success">开启</el-tag>-->
			<!--					</template>-->
			<!--					<template v-else>-->
			<!--						<el-tag type="danger">关闭</el-tag>-->
			<!--					</template>-->
			<!--				</template>-->
			<!--			</el-table-column>-->
			<!--			<el-table-column align="center" header-align="center" label="文字聊天自动设置价格" prop="autoText">-->
			<!--				<template #default="scope">-->
			<!--					<template v-if="scope.row.autoText === 1">-->
			<!--						<el-tag type="success">自动</el-tag>-->
			<!--					</template>-->
			<!--					<template v-else>-->
			<!--						<el-tag type="danger">手动</el-tag>-->
			<!--					</template>-->
			<!--				</template>-->
			<!--			</el-table-column>-->
			<!--			<el-table-column align="center" header-align="center" label="语音聊天自动设置价格" prop="autoVoice">-->
			<!--				<template #default="scope">-->
			<!--					<template v-if="scope.row.autoVoice === 1">-->
			<!--						<el-tag type="success">自动</el-tag>-->
			<!--					</template>-->
			<!--					<template v-else>-->
			<!--						<el-tag type="danger">手动</el-tag>-->
			<!--					</template>-->
			<!--				</template>-->
			<!--			</el-table-column>-->
			<!--			<el-table-column align="center" header-align="center" label="视频聊天自动设置价格" prop="autoVideo">-->
			<!--				<template #default="scope">-->
			<!--					<template v-if="scope.row.autoVideo === 1">-->
			<!--						<el-tag type="success">自动</el-tag>-->
			<!--					</template>-->
			<!--					<template v-else>-->
			<!--						<el-tag type="danger">手动</el-tag>-->
			<!--					</template>-->
			<!--				</template>-->
			<!--			</el-table-column>-->
			<!--			<el-table-column align="center" fixed="right" header-align="center" label="操作" width="160">-->
			<!--				<template #default="scope">-->
			<!--					<el-button link type="primary" @click="addOrUpdateHandle(scope.row.id)"> 修改</el-button>-->
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
	dataListUrl: '/admin/config/user/online/config/list',
	queryForm: {
		userId: ''
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
