<template>
	<el-card class="mod__menu">
		<el-button v-auth="'setting:userarea:add'" icon="Plus" type="primary" @click="addOrUpdateHandle(false, null)"> 新增省级单位 </el-button>
		<el-button plain @click="toggleExpandAll()">
			<template v-if="!isExpandAll">
				全部展开&nbsp;<el-icon>
					<ArrowDown />
				</el-icon>
			</template>
			<template v-else>
				全部收起&nbsp;<el-icon>
					<ArrowUp />
				</el-icon>
			</template>
		</el-button>

		<el-table
			v-if="refreshTable"
			v-loading="state.dataListLoading"
			:data="state.dataList"
			:default-expand-all="isExpandAll"
			border
			class="layout-table"
			row-key="id"
			show-overflow-tooltip
		>
			<el-table-column label="城市名称" min-width="150" prop="name"></el-table-column>
			<!--			<el-table-column prop="sort" label="排序" header-align="center" align="center"></el-table-column>-->
			<el-table-column align="center" fixed="right" header-align="center" label="操作" width="200">
				<template #default="scope">
					<el-button v-if="scope.row.pid === 0 || scope.row.pid === null" link type="primary" @click="addOrUpdateHandle(false, scope.row)"
						>新增
					</el-button>
					<el-button v-auth="'setting:userarea:edit'" link type="primary" @click="addOrUpdateHandle(true, scope.row)"> 修改 </el-button>
					<el-button v-auth="'setting:userarea:del'" link type="primary" @click="deleteHandle(scope.row.id)">删除 </el-button>
				</template>
			</el-table-column>
		</el-table>
		<add-or-update ref="addOrUpdateRef" @refresh-data-list="getDataList"></add-or-update>
	</el-card>
</template>

<script lang="ts" setup>
import { useCrud } from '@/hooks'
import { nextTick, reactive, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'

const state: IHooksOptions = reactive({
	dataListUrl: '/admin/config/area/list',
	deleteUrl: '/admin/config/area/deleted',
	isPage: false
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (isUpdate: Boolean, row: any) => {
	addOrUpdateRef.value.init(isUpdate, row)
}

const { getDataList, deleteHandle } = useCrud(state)

// 是否展开，默认全部折叠
const isExpandAll = ref(false)
// 是否重新渲染表格状态
const refreshTable = ref(true)

// 切换 展开和折叠
const toggleExpandAll = () => {
	refreshTable.value = false
	isExpandAll.value = !isExpandAll.value
	nextTick(() => {
		refreshTable.value = true
	})
}
</script>
