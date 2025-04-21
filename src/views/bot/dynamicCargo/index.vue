<template>
  <el-row>
    <el-col :span="24">
      <el-card class="layout-query">
        <el-form :inline="true" :model="state.queryForm">
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
          <el-table-column
              prop="content"
              label="内容"
              header-align="center"
              align="center"
          >
            <template #default="scope">
              <div v-if="scope.row.type === 2">
                <img
                    :src="scope.row.content"
                    alt="图片"
                    style="max-width: 100px; max-height: 100px;"
                />
              </div>
              <div v-else>
                {{ scope.row.content }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="类型" header-align="center" align="center">
            <template #default="scope">
              <el-tag :type="scope.row.type === 1 ? 'success' : 'danger'">{{ scope.row.type === 1 ? '文字' : scope.row.type === 2 ? '图片' : '视频' }}</el-tag></template>
          </el-table-column>
<!--          <el-table-column prop="status" label="状态" header-align="center" align="center">-->
<!--            <template #default="scope">-->
<!--              <el-switch-->
<!--                  v-model="scope.row.status"-->
<!--                  :active-value="1"-->
<!--                  :inactive-value="0"-->
<!--                  active-color="#13ce66"-->
<!--                  inactive-color="#ff4949"-->
<!--                  @change="handleStatusChange(scope.row)"-->
<!--              />-->
<!--            </template>-->
<!--          </el-table-column>-->
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
  <add-or-update ref="addOrUpdateRef"></add-or-update>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import { ElDrawer, ElMessage } from 'element-plus'
import { APIGetUnionDetailList, APIModifyUnionActive } from '@/api/union/union'
import { APIGetGameDetailList } from '@/api/social/socialGame'
import { APISaveBotText } from '@/api/sys/user'
import AddOrUpdate from "@/views/bot/dynamicCargo/add-or-update.vue";

const parentBorder = ref(false)
const addOrUpdateRef = ref()


const state: IHooksOptions = reactive({
  dataListUrl: '/admin/sys/user/bot/cargo/list',
  deleteUrl: '/admin/sys/user/bot/cargo/del',
})

const handleStatusChange = (row:any) =>{

}
const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle, reset } = useCrud(state)
const queryHandle = () => {
  addOrUpdateRef.value.init()
  // const params = {
  //   texts: texts.value,
  //   textType: 2
  // }
  // APISaveBotText(params).then(res => {
  //   if (res) {
  //     ElMessage.success('添加成功')
  //     texts.value = ''
  //   }
  // }).finally(()=>{
  //   getDataList()
  // })

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
