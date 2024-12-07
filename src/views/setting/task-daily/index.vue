<template>
  <el-card>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border class="layout-table" show-overflow-tooltip>
      <el-table-column align="center" header-align="center" label="任务名称" prop="taskName">
        <template #default="scope">
          签到{{scope.row.dayNumber}}天
        </template>
      </el-table-column>

      <el-table-column align="center" header-align="center" label="完成任务奖励金币">
        <template v-slot="{ row, rowIndex }">
          <el-input-number v-model="row.incomeAmount" :max="100" :min="0" style="max-width: 200px" @change="handleChange(row)" />
        </template>
      </el-table-column>
<!--      <el-table-column prop="status" label="状态" align="center">-->
<!--        <template #default="scope">-->
<!--          <el-switch-->
<!--              v-model="scope.row.status"-->
<!--              class="mb-2"-->
<!--              inline-prompt-->
<!--              style="&#45;&#45;el-switch-on-color: #13ce66; &#45;&#45;el-switch-off-color: #ff4949"-->
<!--              active-text="启用"-->
<!--              inactive-text="禁用"-->
<!--              :active-value="1"-->
<!--              :inactive-value="-1"-->
<!--              @change="handleChange(scope.row)"-->
<!--          />-->
<!--        </template>-->
<!--      </el-table-column>-->

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
  </el-card>
</template>

<script lang="ts" setup>
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import {APIModifyTaskCoin, APIModifyTaskCoinDaily, APIRechargeConfigEdit} from '@/api/config/setting'
import { ElMessage } from 'element-plus'

const state: IHooksOptions = reactive({
  dataListUrl: '/admin/task/task/list/daily',
  queryForm: {
    payType: '',
    name: ''
  }
})
const handleChange = (row: any) => {
  if (!row.rate) {
    row.rate = 0
  }
  // 在这里可以添加保存逻辑
  APIModifyTaskCoinDaily(row)
      .then(res => {
        ElMessage.success({
          message: '修改成功',
          duration: 1000
        })
      })
      .catch(err => {
        ElMessage.error({
          message: '修改失败',
          duration: 500
        })
      })
}

const { sizeChangeHandle, currentChangeHandle } = useCrud(state)
</script>

<style scoped>
:deep(.el-input__inner) {
  text-align: center; /* 居中文本 */
}
</style>
