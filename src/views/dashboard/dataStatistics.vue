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
				<el-select v-model="state.queryForm.groupColumn" placeholder="Select" style="width: 240px">
					<el-option v-for="item in groupColumn" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.equipmentId" placeholder="设备id搜索" :prefix-icon="Search" clearable style="width: 215px"></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.channelId" placeholder="渠道id搜索" :prefix-icon="Search" clearable style="width: 215px"></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.eventId" placeholder="事件id搜索" :prefix-icon="Search" clearable style="width: 215px"></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.nodeId" placeholder="节点id搜索" :prefix-icon="Search" clearable style="width: 215px"></el-input>
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
        start-placeholder="开始时间"
        end-placeholder="结束时间"
      />
      </el-form-item>
			<el-form-item>
				<el-button type="primary" @click="getDataList()">查询</el-button>
			</el-form-item>
		</el-form>
		<el-card>
			<div ref="main" style="width: 100%; height: calc(100vh - 110px - var(--theme-header-height))"></div>
		</el-card>
	</el-card>
</template>
<script setup lang="ts">
import { IHooksOptions } from '@/hooks/interface'
import { onMounted, reactive, ref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { platformApi, PlatformList, staticApi, StaticListList } from '@/api/dataStatistics'
import * as echarts from 'echarts'
import { fa } from 'element-plus/es/locale'

// 数据分组字段
const groupColumn = [
	{ label: '设备', value: 'equipment_id' },
	{ label: '渠道', value: 'channel_id' },
	{ label: '事件', value: 'event_id' },
	{ label: '节点', value: 'node_id' }
]
const state: IHooksOptions = reactive({
	dataList: [] as StaticListList[],
	queryForm: {
		platformId: 1,
		start: '2025-01-01',
		end: '2026-01-01',
		groupColumn: groupColumn[0].value,
		equipmentId: null,
		channelId: null,
		eventId: null,
		nodeId: null
	}
})
const date = ref([state.queryForm.start, state.queryForm.end])


watch(date, (val) => {
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

const valueToLabelMap = Object.fromEntries(groupColumn.map(item => [item.value, item.label]))
// 图表数据
const main = ref()
const init = () => {
	const myChart = echarts.init(main.value)
	// 绘制图表
	myChart.setOption({
		title: {
			text: '数据统计'
		},
		tooltip: {
			trigger: 'item',
			formatter: '{a} <br/>{b}: {c} ({d}%)'
		},
		legend: {
			data: [valueToLabelMap[state.queryForm.groupColumn] + '数量']
		},
		toolbox: {
			feature: {
				saveAsImage: {}
			}
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		series: [
			{
				name: valueToLabelMap[state.queryForm.groupColumn] + '数量',
				type: 'pie',
				stack: 'Total',
				areaStyle: {},
				emphasis: {
					focus: 'series'
				},
				data: state.dataList
			}
		]
	})
}

const getDataList = async () => {
	await staticApi(state.queryForm).then(res => {
		state.dataList = res.data
	})
  init()
}

onMounted(async() => {
	await getDataList()
})
</script>
