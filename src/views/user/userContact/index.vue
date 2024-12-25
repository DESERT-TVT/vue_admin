<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query">
				<el-form ref="queryRef" :inline="true" :model="state.queryForm">
					<el-form-item>
						<el-button icon="Delete" plain type="danger" @click="deleteBatchHandle()">批量删除 </el-button>
					</el-form-item>
					<el-form-item>
						<el-button icon="Plus" type="primary" @click="addOrUpdateHandle()">新增</el-button>
					</el-form-item>
				</el-form>
			</el-card>

			<el-card>
				<el-table
					v-loading="state.dataListLoading"
					show-overflow-tooltip
					:data="state.dataList"
					border
					class="layout-table"
					@selection-change="selectionChangeHandle"
				>
					<el-table-column type="selection" header-align="center" align="center" width="38"></el-table-column>
					<el-table-column fixed prop="contactName" label="联系方式" header-align="center" align="center"></el-table-column>
          <el-table-column align="center" header-align="center" label="图标" prop="giftImg">
            <template #default="scope">
              <el-popover :width="383" placement="right" trigger="hover">
                <template #reference>
                  <el-image :src="scope.row.contactIcon" style="margin-top: 7px; height: 60px; border-radius: 6px" />
                </template>
                <template #default>
                  <el-image :src="scope.row.contactIcon" style="width: 356px" />
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="status" width="80">
            <template #default="scope">
              <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="changeStatus(scope.row.id, scope.row.status)"></el-switch>
            </template>
          </el-table-column>
					<el-table-column label="操作" fixed="right" header-align="center" align="center">
						<template #default="scope">
							<el-button v-auth="'user:update'" link type="primary" @click="addOrUpdateHandle(scope.row)"> 修改 </el-button>
						</template>
					</el-table-column>
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
	<!-- 弹窗, 新增 / 修改 -->
	<add-or-update ref="addOrUpdateRef" @refresh-data-list="getDataList"></add-or-update>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import AddOrUpdate from '@/views/user/userContact/add-or-update.vue'
import {APIPostUserContactConfig} from "@/api/user/userManage";
import {ElMessage} from "element-plus";

const state: IHooksOptions = reactive({
	dataListUrl: '/admin/sys/user/contact/config/page',
	deleteUrl: '/admin/sys/user/contact/config/del',
	queryForm: {
		userId: ''
	}
})
const addOrUpdateRef = ref()
const addOrUpdateHandle = (row?: any) => {
	addOrUpdateRef.value.init(row)
}
const queryRef = ref()
const changeStatus = (id: number, status: number) => {
  const params = {
    id:id,
    status:status
  }
  APIPostUserContactConfig(params).then((resp:any)=>{
    if(resp.code == 0 && resp.data){
      ElMessage.success("修改成功")
    }
  }).finally(()=>{
    getDataList()
  })
}
const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, reset, deleteBatchHandle } = useCrud(state)
</script>
