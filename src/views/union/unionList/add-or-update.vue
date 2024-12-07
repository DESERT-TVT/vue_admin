<template>
	<el-dialog v-model="visible" :title="!dataForm.userId ? '新增' : '修改'" :close-on-click-modal="false" width="30%" @close="closeDialogHandle">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="公会长UID" prop="userId">
				<el-input v-model="dataForm.userId" placeholder="公会长UID" />
			</el-form-item>
			<!--      <el-button type="primary" @click="checkUserId()">验证UID</el-button>-->

<!--			<el-form-item label="公会长结算（1=100%）" prop="kickbackRate">-->
<!--				<el-input-number v-model="dataForm.kickbackRate" min="0" />-->
<!--			</el-form-item>-->
<!--			<el-form-item label="主播结算（1=100%）" prop="kickbackRateOnline">-->
<!--				<el-input-number v-model="dataForm.kickbackRateOnline" min="0" />-->
<!--			</el-form-item>-->
			<!--      <el-form-item label="公会等级" prop="price">-->
			<!--        <el-input-number v-model="dataForm.price" min="0"/>-->
			<!--      </el-form-item>-->
		</el-form>
		<template #footer>
			<el-button @click="closeDialogHandle">取消</el-button>
			<el-button v-auth="'sys:union:add'" type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'

import { APIAddOrUpdateIntegralConfig, APIAddOrUpdateLevelExpConfig, APIModifyGoldCoinModify } from '@/api/config/setting'
import { APIApplyUnion } from '@/api/union/union'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	userId: '',
	// /**
	//  * 公会抽成比例 0.1 = 10%
	//  */
	// kickbackRate: 0,
	// /**
	//  * 旗下主播结算比例
	//  */
	// kickbackRateOnline: 0
})
const init = (row?: any) => {
	visible.value = true
	if (row) {
		dataForm.userId = row.userId
		// dataForm.kickbackRate = row.kickbackRate
		// dataForm.kickbackRateOnline = row.kickbackRateOnline
	}
}

const closeDialogHandle = () => {
	visible.value = false
	dataFormRef.value.resetFields()
	resetDataForm()
}
const resetDataForm = () => {
	dataForm.userId = ''
	// dataForm.kickbackRate = 0
	// dataForm.kickbackRateOnline = 0
}
const dataRules = ref({
	title: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	textContent: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	quantity: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = async () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		APIApplyUnion(dataForm)
			.then(resp => {
        if(resp.code == 0){
          ElMessage.success({
            message: '操作成功',
            duration: 500,
            onClose: () => {
              closeDialogHandle()
              emit('refreshDataList')
            }
          })
        }else{
          ElMessage.error({
            message: resp.msg,
            duration: 2500,
            onClose: () => {
              closeDialogHandle()
              emit('refreshDataList')
            }
          })
        }
			})
			.catch(() => {
				ElMessage.error('操作失败')
			})
			.finally(() => {})
	})
}

defineExpose({
	init
})
</script>
