<template>
	<el-row :gutter="20">
		<el-col :span="4">
			<el-card shadow="always">
				<el-statistic title="用户总数" :value="countForm.userCount" />
			</el-card>
		</el-col>
		<el-col :span="4" :offset="1">
			<el-card shadow="always">
				<el-statistic :value="countForm.userVipCount">
					<template #title>
						<div style="display: inline-flex; align-items: center">VIP用户总数</div>
					</template>
				</el-statistic>
			</el-card>
		</el-col>
		<el-col :span="4" :offset="1">
			<el-card shadow="always">
				<el-statistic title="主播总数" :value="countForm.onlineCount" />
			</el-card>
		</el-col>

		<el-col :span="4" :offset="1">
			<el-card shadow="always">
				<el-statistic title="女神认证总数" :value="countForm.goddessCount"></el-statistic>
			</el-card>
		</el-col>
		<el-col :span="4" :offset="1">
			<el-card shadow="always">
				<el-statistic title="真人认证总数" :value="countForm.realerCount"></el-statistic>
			</el-card>
		</el-col>
	</el-row>

	<el-card>
		<template #header>
			<div class="card-header">
				<span>时效数据统计</span>
			</div>
		</template>
		<el-row :gutter="20">
			<el-col :span="8">
				<el-form :inline="true" :model="form" label-width="auto">
					<el-form-item>
						<el-date-picker
							v-model="dateTimeValue"
							type="datetimerange"
							start-placeholder="Start date"
							end-placeholder="End date"
							format="YYYY-MM-DD HH:mm:ss"
							date-format="YYYY-MM-DD"
							time-format="HH:mm:ss"
							value-format="YYYY-MM-DD HH:mm:ss"
						/>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="getData">查询</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="4">
				<el-statistic title="新增用户数量" :value="agingCountForm.addUserCount" />
			</el-col>
			<el-col :span="4" :offset="1">
				<el-statistic :value="agingCountForm.addOnlineCount">
					<template #title>
						<div style="display: inline-flex; align-items: center">新增主播数量</div>
					</template>
				</el-statistic>
			</el-col>
			<el-col :span="4" :offset="1">
				<el-statistic title="新增购买VIP金额" :value="agingCountForm.addVipMoneyCount" />
			</el-col>
			<el-col :span="4" :offset="1">
				<el-statistic title="新增购买金币金额" :value="agingCountForm.addGoldCoinsCount">
					<template #suffix>
						<el-icon style="vertical-align: -0.125em">
							<Money />
						</el-icon>
					</template>
				</el-statistic>
			</el-col>
			<el-col :span="4" :offset="1">
				<el-statistic title="提现金额" :value="agingCountForm.addExtractCount">
					<template #suffix>
						<el-icon style="vertical-align: -0.125em">
							<Money />
						</el-icon>
					</template>
				</el-statistic>
			</el-col>
		</el-row>
	</el-card>

	<el-card style="margin-top: 20px">
		<template #header>
			<div class="card-header">
				<span>数据图示</span>
			</div>
		</template>
		<el-row :gutter="20">
			<div ref="main" style="width: 100%; height: 500px"></div>
		</el-row>
	</el-card>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { reactive, ref } from 'vue'
import { Money } from '@element-plus/icons-vue'
import { getAgingCount, getCount, getDiagramCount } from '@/api/index'

const main = ref()
const dateTimeValue = ref('')

const countForm = reactive({
	userCount: 0,
	onlineCount: 0,
	goddessCount: 0,
	realerCount: 0,
	userVipCount: 0
})

const agingCountForm = reactive({
	addUserCount: 0,
	addOnlineCount: 0,
	addVipMoneyCount: 0,
	addGoldCoinsCount: 0,
	addExtractCount: 0
})

const diagramCountForm = reactive({
	addOnlineCount: [] as any[],
	addUserCount: [] as any[],
	countDate: [] as any[],
	extractCount: [] as any[],
	goldCoinsCount: [] as any[],
	vipMoneyCount: [] as any[],
	activeUserCount: [] as any[]
})

const form = reactive({
	startDate: '',
	endDate: ''
})

const count = () => {
	getCount().then((res: any) => {
		const { userCount, onlineCount, goddessCount, realerCount, userVipCount } = res.data
		Object.assign(countForm, { userCount, onlineCount, goddessCount, realerCount, userVipCount })
	})
}
count()

const agingCount = (form: any) => {
	getAgingCount(form).then((res: any) => {
		agingCountForm.addExtractCount = res.data.addExtractCount
		agingCountForm.addGoldCoinsCount = res.data.addGoldCoinsCount
		agingCountForm.addVipMoneyCount = res.data.addVipMoneyCount
		agingCountForm.addUserCount = res.data.addUserCount
		agingCountForm.addOnlineCount = res.data.addOnlineCount
	})
}
agingCount(form)

const diagramCount = () => {
	getDiagramCount().then((res: any) => {
		res.data.forEach((item: any) => {
			diagramCountForm.addUserCount.push(item.addUserCount)
			diagramCountForm.extractCount.push(item.extractCount)
			diagramCountForm.goldCoinsCount.push(item.goldCoinsCount)
			diagramCountForm.vipMoneyCount.push(item.vipMoneyCount)
			diagramCountForm.addOnlineCount.push(item.addOnlineCount)
			diagramCountForm.countDate.push(item.countDate)
			diagramCountForm.activeUserCount.push(item.activeUserCount)
		})
		// 初始化数据
		init()
	})
}
diagramCount()
const getData = () => {
	let form = {
		startDate: '',
		endDate: ''
	}
	if (dateTimeValue.value) {
		form.startDate = dateTimeValue.value[0]
		form.endDate = dateTimeValue.value[1]
	}
	getAgingCount(form).then((res: any) => {
		agingCountForm.addExtractCount = res.data.addExtractCount
		agingCountForm.addGoldCoinsCount = res.data.addGoldCoinsCount
		agingCountForm.addVipMoneyCount = res.data.addVipMoneyCount
		agingCountForm.addUserCount = res.data.addUserCount
		agingCountForm.addOnlineCount = res.data.addOnlineCount
	})
}

const init = () => {
	const myChart = echarts.init(main.value)
	// 绘制图表
	myChart.setOption({
		// title: {
		//   text: '数据图示',
		// },
		legend: {},
		tooltip: {
			trigger: 'axis'
		},
		dataset: {
			source: {
				product: diagramCountForm.countDate,
				新增用户数量: diagramCountForm.addUserCount,
				新增主播数量: diagramCountForm.addOnlineCount,
				购买VIP金额: diagramCountForm.vipMoneyCount,
				购买金币金额: diagramCountForm.goldCoinsCount,
				活跃用户数量: diagramCountForm.activeUserCount,
				提现金额: diagramCountForm.extractCount
			}
		},
		xAxis: { type: 'category' },
		yAxis: { gridIndex: 0 },
		series: [
			{
				type: 'line',
				smooth: true,
				seriesLayoutBy: 'row',
				emphasis: { focus: 'series' },
				lineStyle: {
					width: 4
				}
			},
			{
				type: 'line',
				smooth: true,
				seriesLayoutBy: 'row',
				emphasis: { focus: 'series' },
				lineStyle: {
					width: 4
				}
			},
			{
				type: 'line',
				smooth: true,
				seriesLayoutBy: 'row',
				emphasis: { focus: 'series' },
				lineStyle: {
					width: 4
				}
			},
			{
				type: 'line',
				smooth: true,
				seriesLayoutBy: 'row',
				emphasis: { focus: 'series' },
				lineStyle: {
					width: 4
				}
			},
			{
				type: 'line',
				smooth: true,
				seriesLayoutBy: 'row',
				emphasis: { focus: 'series' },
				lineStyle: {
					width: 4
				}
			},
			{
				type: 'line',
				smooth: true,
				seriesLayoutBy: 'row',
				emphasis: { focus: 'series' },
				lineStyle: {
					width: 4
				}
			}
		]
	})
}
</script>

<style scoped>
.el-col {
	text-align: center;
	border-radius: 20px;
}

.el-row {
	margin-bottom: 20px;
}

.el-row:last-child {
	margin-bottom: 0;
}

.grid-content {
	border-radius: 4px;
	min-height: 36px;
}
</style>
