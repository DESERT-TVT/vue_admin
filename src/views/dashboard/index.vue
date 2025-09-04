<template>
	<el-card>
		<!-- 查询 -->
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-select
					v-model="state.queryForm.platformId"
					filterable
					remote
					:loading="loading"
					placeholder="请选择"
					style="width: 240px"
					@visible-change="handleVisibleChange"
					@popup-scroll="handleScroll"
				>
					<el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item>
				<select-v2 v-model="state.queryForm.equipmentId" :fetch="equipmentReq" placeholder="设备名称搜索" style="width: 240px" />
			</el-form-item>
			<el-form-item>
				<select-v2 v-model="state.queryForm.channelId" :fetch="channelReq" placeholder="渠道名称搜索" style="width: 240px" />
			</el-form-item>
			<el-form-item>
				<select-v2 v-model="state.queryForm.eventId" :fetch="eventReq" placeholder="事件名称搜索" style="width: 240px" />
			</el-form-item>
			<el-form-item>
				<select-v2 v-model="state.queryForm.nodeId" :fetch="nodeReq" placeholder="节点名称搜索" style="width: 240px" />
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.host" placeholder="输入域名" :prefix-icon="Search" clearable style="width: 215px"></el-input>
			</el-form-item>
			<el-form-item>
				<el-date-picker
					v-model="date"
					type="daterange"
					unlink-panels
					value-format="YYYY-MM-DD"
					range-separator="To"
					format="YYYY/MM/DD"
					:clearable="false"
					:shortcuts="shortcuts"
					start-placeholder="开始时间"
					end-placeholder="结束时间"
				/>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="getDataList()">查询</el-button>
			</el-form-item>
		</el-form>

		<!-- 表格 -->
		<el-table
			v-loading="state.dataListLoading"
			show-overflow-tooltip
			:data="state.dataList"
			border
			style="width: 100%"
			@selection-change="selectionChangeHandle"
			@sort-change="sortChangeHandle"
		>
			<el-table-column prop="userId" label="用户id" header-align="center" align="center" min-width="100" />
			<el-table-column prop="ipAddress" label="ip" header-align="center" align="center" min-width="100" />
			<el-table-column prop="equipmentName" label="设备名称" header-align="center" align="center" min-width="170" />
			<el-table-column prop="channelName" label="	渠道名称" header-align="center" align="center" min-width="200" />
			<el-table-column prop="eventName" label="事件名称" header-align="center" align="center" min-width="150" />
			<el-table-column prop="nodeName" label="节点名称" header-align="center" align="center" min-width="150" />
			<el-table-column prop="platformName" label="平台名称" header-align="center" align="center" min-width="150" />
			<el-table-column prop="host" label="域名" header-align="center" align="center" min-width="150" />
			<el-table-column prop="createTime" label="创建时间" header-align="center" align="center" min-width="150" />
			<el-table-column prop="extraInfo" label="	额外信息" header-align="center" align="center" min-width="150" />
			<el-table-column prop="clientId" label="设备号" header-align="center" align="center" min-width="150" />
		</el-table>

		<!-- 分页	-->
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
</template>
<script setup lang="ts">
import { IHooksOptions } from '@/hooks/interface'
import { onMounted, reactive, ref, watch } from 'vue'
import { useCrud } from '@/hooks'
import { Search } from '@element-plus/icons-vue'
import { platformApi, PlatformList } from '@/api/dataStatistics'
import selectV2, { FetchV2 } from '@/components/select-v2/index.vue'
import dayjs from 'dayjs'
const state: IHooksOptions = reactive({
	dataListUrl: '/admin/data/page',
	queryForm: {
		platformId: 1,
		start: dayjs().format("YYYY-MM-DD"),
		end: dayjs().format("YYYY-MM-DD"),
		sortColumn: 'create_time',
		equipmentId: null,
		channelId: null,
		eventId: null,
		nodeId: null,
		host: null,
	}
})

// 设备数据请求
const equipmentReq: FetchV2 = reactive({
	url: '/admin/equipment/page',
	params: {
		page: 1,
		limit: 1000,
		name: '',
		get platformId() {
      return state.queryForm.platformId
    }
	}
})

// 节点数据请求
const nodeReq: FetchV2 = {
	url: '/admin/node/page',
	params: {
		page: 1,
		limit: 1000,
		name: '',
		get platformId() {
      return state.queryForm.platformId
    }
	}
}

// 事件数据请求
const eventReq: FetchV2 = {
	url: '/admin/event/page',
	params: {
		page: 1,
		limit: 1000,
		name: '',
		get platformId() {
      return state.queryForm.platformId
    }
	}
}

//渠道数据请求
const channelReq: FetchV2 = {
	url: '/admin/channel/page',
	params: {
		page: 1,
		limit: 1000,
		name: '',
		get platformId() {
      return state.queryForm.platformId
    }
	}
}

const shortcuts = [
  {
    text: 'Last week',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: 'Last month',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: 'Last 3 months',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]

const date = ref([state.queryForm.start, state.queryForm.end])

watch(date, val => {
	if (val && val.length === 2) {
		state.queryForm.start = val[0]
		state.queryForm.end = val[1]
	} else {
		state.queryForm.start = ''
		state.queryForm.end = ''
	}
})

// 分页平台查询
const options = ref<PlatformList[]>([])
const loading = ref(false)
const pageParams = {
	page: 1,
	limit: 10,
	name: ''
}
const total = ref(0)

// 默认加载第一页并选择第一项
onMounted(async () => {
	pageParams.page = 1
	const data = await platformApi(pageParams)
	options.value = data.data.list
	total.value = data.data.total
	if (total.value > 0) {
		state.queryForm.platformId = options.value[0].id // 默认选中第一项
	}
})

// 下拉展开时刷新第一页
const handleVisibleChange = async (visible: boolean) => {
	if (visible && options.value.length === 0) {
		pageParams.page = 1
		const data = await platformApi(pageParams)
		options.value = data.data.list
	}
}

// 下拉滚动触底加载更多
const handleScroll = async (e: HTMLElement) => {
	const wrap = document.querySelector('.el-select-dropdown .el-select-dropdown__wrap') as HTMLElement
	if (!wrap) return
	const { clientHeight, scrollHeight } = wrap
	if (e.scrollTop + clientHeight >= scrollHeight - 5) {
		if (options.value.length < total.value && !loading.value) {
			pageParams.page++
			const more = await platformApi(pageParams)
			options.value.push(...more.data.list)
		}
	}
}
const { getDataList, selectionChangeHandle, sortChangeHandle, sizeChangeHandle, currentChangeHandle } = useCrud(state)
</script>
