<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query">
				<el-form :inline="true" :model="state.queryForm">
					<el-form-item prop="userId">
						<el-input v-model="state.queryForm.userId" placeholder="UID"></el-input>
					</el-form-item>
					<el-form-item prop="account">
						<el-input v-model="state.queryForm.account" placeholder="账户"></el-input>
					</el-form-item>

          <el-form-item>
            <el-date-picker
                v-model="datePickerValue"
                type="datetimerange"
                start-placeholder="Start date"
                end-placeholder="End date"
                format="YYYY-MM-DD HH:mm:ss"
                date-format="YYYY-MM-DD"
                time-format="HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                @change="datePickerChange"
            />
          </el-form-item>

					<el-form-item>
						<el-button v-auth="'sys:settle:list'" icon="Search" type="primary" @click="queryHandle">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button icon="RefreshRight" @click="resetHandle">重置</el-button>
					</el-form-item>
				</el-form>
			</el-card>

			<!-- table -->
			<el-card>
        总计分成积分：{{totalShareIntegral}}<span style="margin-left: 20px">总计消耗金币数量：{{totalCoin}}</span>
				<el-table
					v-loading="state.dataListLoading"
					show-overflow-tooltip
					:data="state.dataList"
					border
					class="layout-table"
					style="width: 100%"
					@selection-change="selectionChangeHandle"
				>
					<el-table-column type="selection" header-align="center" align="center" width="38"></el-table-column>
          <el-table-column prop="userId" label="UID" header-align="center" align="center"></el-table-column>
<!--					<el-table-column prop="account" label="账号" header-align="center" align="center"></el-table-column>-->
					<el-table-column prop="settleValue" label="分成(积分)" header-align="center" align="center"></el-table-column>
<!--					<el-table-column prop="kickbackRate" label="分成比例" header-align="center" align="center">-->
<!--            <template #default="scope">-->
<!--              <span>{{ scope.row.kickbackRate*100 }}%</span>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--					<el-table-column prop="settleStatus" label="结算状态" header-align="center" align="center">-->
<!--						<template #default="scope">-->
<!--							<div v-if="scope.row.settleStatus === 1">已结算</div>-->
<!--							<div v-if="scope.row.settleStatus === -1">未结算</div>-->
<!--						</template>-->
<!--					</el-table-column>-->
          <el-table-column prop="sourceId" label="来源用户" header-align="center" align="center"></el-table-column>
          <el-table-column prop="sourceCoinNum" label="来源金币数量" header-align="center" align="center"></el-table-column>

          <el-table-column prop="settleName" label="收益类型" header-align="center" align="center"></el-table-column>
          <el-table-column prop="extInfo" label="礼物/通话时长(秒)" header-align="center" align="center"></el-table-column>
<!--					<el-table-column label="操作" fixed="right" header-align="center" align="center" width="120">-->
<!--						<template #default="scope">-->
<!--							<el-button type="text" @click="() => getSettleDetail(scope.row)">详情</el-button>-->
<!--						</template>-->
<!--					</el-table-column>-->
          <el-table-column prop="createTime" label="分成时间" header-align="center" align="center"></el-table-column>

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
	<!-- 主播详情抽屉 -->
	<el-drawer v-model="drawer" title="明细" :with-header="true" direction="rtl">
		<el-table :data="anchorData" style="width: 100%">
			<el-table-column prop="userId" label="主播ID"></el-table-column>
			<el-table-column prop="value" label="分成数量"></el-table-column>
			<el-table-column prop="dateKey" label="结算时间"></el-table-column>
			<!-- 根据需求添加其他列 -->
		</el-table>
	</el-drawer>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import { ElDrawer, ElMessage } from 'element-plus'
import {
  APIGetSettleTotal,
  APIGetUnionDetailList,
  APIGetUnionSettleDetailList,
  APIModifyUnionActive
} from '@/api/union/union'

const loading = ref(false)
const drawer = ref(false)

// const queryRef = ref()
const state: IHooksOptions = reactive({
	dataListUrl: '/admin/union/resettle/list',
	queryForm: {
		userId: '',
		account: ''
    // dateTimeValue:''
	}
})
const datePickerValue = ref()
const datePickerChange = (value: any[]) => {
  state.queryForm.startDate = value[0]
  state.queryForm.endDate = value[1]
}
const anchorData = ref([])
const totalShareIntegral = ref('0')
const totalCoin = ref('0')

const getSettleTotal = () => {
  APIGetSettleTotal(state.queryForm).then(resp =>{
    if(resp.code === 0){
      totalShareIntegral.value = resp.data.totalIntegral
      totalCoin.value = resp.data.totalCoin
    }
  })
}
getSettleTotal()
const getSettleDetail = async (row: any) => {
	drawer.value = true
	const params = {
		userId: row.userId,
		dateKey: row.dateKey
	}
	APIGetUnionSettleDetailList(params)
		.then(resp => {
			anchorData.value = resp.data
			console.log(resp)
		})
		.catch(() => {
			ElMessage({
				message: '操作失败',
				type: 'error',
				plain: true
			})
			loading.value = false
		})
		.finally(() => {})
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, reset } = useCrud(state)

const queryHandle = () => {
	loading.value = true
	getDataList()
	loading.value = false
}

const resetHandle = () => {
	state.queryForm.userId = ''
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
