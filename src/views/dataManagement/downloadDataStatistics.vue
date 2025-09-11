<template>
	<el-card>
		<!-- 查询 -->
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item label="选择平台:">
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
			<div style="border: 1px solid #eee; padding: 10px; margin-bottom: 10px">
				<h1 style="margin-bottom: 10px">筛选数据</h1>
				<el-form-item>
					<select-v2
						v-model="aggregation.queryForm.channelName"
						@changeLabel="aggregationDef[0].value = $event"
						:fetch="channelReq"
						placeholder="渠道名称搜索"
						v-if="state.queryForm.groupColumn != 'channel_name'"
						style="width: 240px"
					/>
				</el-form-item>
				<el-form-item>
					<el-select-v2
						@change="aggregationDef[1].value = TypeMap.find(item => item.value == $event)?.label || ''"
						v-model="aggregation.queryForm.type"
						v-if="state.queryForm.groupColumn != 'type'"
						clearable
						:options="TypeMap"
						placeholder="选择事件类型"
						style="width: 240px"
					/>
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
			</div>
			<div style="border: 1px solid #eee; padding: 10px; margin-bottom: 10px">
				<h1 style="margin-bottom: 10px">聚合数据</h1>
				<el-form-item>
					<el-select v-model="state.queryForm.groupColumn" placeholder="Select" style="width: 240px">
						<el-option v-for="item in groupColumn" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>
			</div>
			<el-form-item>
				<el-button type="primary" @click="getDataList()">查询</el-button>
			</el-form-item>
		</el-form>
		<!-- 表格 -->
		<el-table show-overflow-tooltip :data="state.dataList" border style="width: 100%; margin-bottom: 20px">
			<el-table-column prop="name" :label="valueToLabelMap[state.startValue ?? '']" header-align="center" align="center" min-width="170" />
			<el-table-column v-for="value in aggregationList" :label="value.label" header-align="center" align="center" min-width="170">
				<default slot="default" slot-scope="scope"> {{ value.value }} </default>
			</el-table-column>
			<el-table-column prop="value" label="数量" header-align="center" align="center" min-width="150" />
		</el-table>
		<el-card>
			<div ref="main" style="width: 100%; height: calc(100vh - 110px - var(--theme-header-height))"></div>
		</el-card>
	</el-card>
</template>
<script setup lang="ts" name="DataManagementDataStatistics">
import { IHooksOptions } from '@/hooks/interface'
import { onMounted, reactive, ref, watch } from 'vue'
import { platformApi, PlatformList, downStaticApi, StaticListList } from '@/api/dataStatistics'
import selectV2, { FetchV2 } from '@/components/select-v2/index.vue'
import * as echarts from 'echarts'
import dayjs from 'dayjs'
// 数据分组字段
const groupColumn: { label: string; value: string; labelName: string }[] = [
	{ label: '渠道', value: 'channel_name', labelName: 'channelName' },
	{ label: '事件', value: 'type', labelName: 'type' }
]
const state: IHooksOptions = reactive({
	dataList: [] as StaticListList[],
	queryForm: {
		platformId: 1,
		start: dayjs().format('YYYY-MM-DD'),
		end: dayjs().format('YYYY-MM-DD'),
		groupColumn: groupColumn[0].value,
		type: null,
		channelName: null
	},
	startValue: groupColumn[0].value
})

const aggregation: IHooksOptions = reactive({
	queryForm: {
		type: null,
		channelName: null
	}
})

const shortcuts = [
	{
		text: 'Last week',
		value: () => {
			const end = new Date()
			const start = new Date()
			start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
			return [start, end]
		}
	},
	{
		text: 'Last month',
		value: () => {
			const end = new Date()
			const start = new Date()
			start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
			return [start, end]
		}
	},
	{
		text: 'Last 3 months',
		value: () => {
			const end = new Date()
			const start = new Date()
			start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
			return [start, end]
		}
	}
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

// 事件类型
const TypeMap = [
	{
		label: '下载',
		value: 1
	},
	{
		label: '安装',
		value: 2
	}
]

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

const valueToLabelMap = Object.fromEntries((groupColumn ?? []).map(item => [item.value, item.label]))
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
//聚合方法
const aggregationDef = reactive<{ label: string; value: string; valueField: string }[]>([
	{
		label: '渠道',
		value: '',
		valueField: 'channel_name'
	},
	{
		label: '事件',
		value: '',
		valueField: 'type'
	}
])
let aggregationList = reactive<{ label: string; value: string }[]>([])

const handleAggregation = () => {
	aggregationList = aggregationDef
		.filter(item => item.value)
		.map(item => {
			return {
				label: item.label,
				value: item.value
			}
		})
}

function getLabelNameByValue(value: any) {
	const item = groupColumn.find((col: { label: string; value: string; labelName: string }) => col.value === value)
	return item ? item.labelName : null
}

const getDataList = async () => {
	state.startValue = state.queryForm.groupColumn
	const merged: any = { ...state.queryForm }
	for (const key in state.queryForm) {
		if (merged[key] == null && key != getLabelNameByValue(state.queryForm.groupColumn)) {
			merged[key] = aggregation.queryForm[key]
		}
	}
	// 聚合数据
	handleAggregation()
	await downStaticApi(merged).then(res => {
		state.dataList = res.data
	})
	// 绘制图表
	init()
}

onMounted(async () => {
	await getDataList()
})
</script>
