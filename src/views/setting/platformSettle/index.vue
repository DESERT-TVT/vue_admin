<template>
	<el-row>
		<el-col :span="24">
			<el-card class="layout-query"> </el-card>

			<el-card>
				<div>
					<el-input v-model="REAL_FEE" placeholder="分成比例，例如10%则填写0.1" style="max-width: 600px">
						<template #prepend>
							<samp style="width: 200px"> 真人认证结算比例(0.01＝1%) </samp>
						</template>
					</el-input>
				</div>

				<div>
					<el-input v-model="GODNESS_FEE" placeholder="分成比例，例如10%则填写0.1" style="max-width: 600px">
						<template #prepend>
							<samp style="width: 200px"> 女神认证结算比例(0.01＝1%) </samp>
						</template>
					</el-input>
				</div>

				<div>
					<el-input v-model="FEMALE_FEE" placeholder="分成比例，例如10%则填写0.1" style="max-width: 600px">
						<template #prepend>
							<samp style="width: 200px"> 普通用户结算比例(0.01＝1%) </samp>
						</template>
					</el-input>
				</div>

				<div>
					<el-input v-model="NON_UNION_GIFT_PLATFORM_FEE" placeholder="分成比例，例如10%则填写0.1" style="max-width: 600px">
						<template #prepend>
							<samp style="width: 200px"> 平台主播结算比例(0.01＝1%) </samp>
						</template>
					</el-input>
				</div>

				<!--        <div>-->
				<!--          <el-input-->
				<!--              v-model="UNION_GIFT_PLATFORM_FEE"-->
				<!--              style="max-width: 600px"-->
				<!--              placeholder="分成比例，例如10%则填写0.1"-->
				<!--          >-->
				<!--            <template #prepend>-->
				<!--              <samp style="width: 200px">-->
				<!--                主播结算比例（加入公会）-->
				<!--              </samp>-->
				<!--            </template>-->
				<!--          </el-input>-->
				<!--        </div>-->

				<!--        <div>-->
				<!--          <el-input-->
				<!--              v-model="UNION_MASTER_SETTLE"-->
				<!--              style="max-width: 600px"-->
				<!--              placeholder="分成比例，例如10%则填写0.1"-->
				<!--          >-->
				<!--            <template #prepend>-->
				<!--              <samp style="width: 200px">-->
				<!--                公会长结算比例-->
				<!--              </samp>-->
				<!--            </template>-->
				<!--          </el-input>-->
				<!--        </div>-->
			</el-card>
			<el-button v-auth="'setting:platformsettle:edit'" icon="Setting" type="primary" @click="() => modifySettleConfig()"> 保存修改 </el-button>
		</el-col>
	</el-row>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useCrud } from '@/hooks'
import AddOrUpdate from '@/views/setting/levelExp/add-or-update.vue'
import { APIModifyConfigList, APIModifyConfigModify } from '@/api/config/setting'
import { ElMessage } from 'element-plus'
import { IHooksOptions } from '@/hooks/interface'

//真人认证结算比例
const REAL_FEE = ref('0')
// 女神认证结算比例
const GODNESS_FEE = ref('0')
// 普通女性结算比例
const FEMALE_FEE = ref('0')
// 未加入工会人员主播结算比例
const NON_UNION_GIFT_PLATFORM_FEE = ref('0')
// 加入工会人员结算比例
const UNION_GIFT_PLATFORM_FEE = ref('0')
// 公会长结算比例
const UNION_MASTER_SETTLE = ref('0')

// const closeDialogHandle = () =>{
//
// }
const queryConfig = () => {
	APIModifyConfigList()
		.then(resp => {
			if (resp.data) {
				REAL_FEE.value = resp.data.realFee
				GODNESS_FEE.value = resp.data.godnessFee
				FEMALE_FEE.value = resp.data.femaleFee
				NON_UNION_GIFT_PLATFORM_FEE.value = resp.data.nonUnionGiftPlatformFee
				UNION_GIFT_PLATFORM_FEE.value = resp.data.unionGiftPlatformFee
				UNION_MASTER_SETTLE.value = resp.data.unionMasterSettle
			}
			ElMessage.success({
				message: '配置刷新成功',
				plain: true
			})
		})
		.catch(() => {
			ElMessage.error('操作失败')
		})
		.finally(() => {})
}
queryConfig()

const modifySettleConfig = () => {
	const params = {
		realFee: REAL_FEE.value,
		godnessFee: GODNESS_FEE.value,
		femaleFee: FEMALE_FEE.value,
		nonUnionGiftPlatformFee: NON_UNION_GIFT_PLATFORM_FEE.value,
		unionGiftPlatformFee: UNION_GIFT_PLATFORM_FEE.value,
		unionMasterSettle: UNION_MASTER_SETTLE.value
	}
	APIModifyConfigModify(params).then(resp => {
		if (resp.code === 0) {
			ElMessage.success({
				message: '配置刷新成功',
				plain: true
			})
		}else{
      ElMessage.error({
        message: resp.msg,
        plain: true
      })
    }
	})
}

// const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, reset } = useCrud(state)
</script>

<style scoped lang="scss">
body {
	margin: 0;
}
.example-showcase .el-loading-mask {
	z-index: 9;
}
</style>
