<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" draggable>
    <el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="120px" @keyup.enter="submitHandle()">
      <el-row>
        <el-col :span="12">
          <el-form-item prop="botNum" label="机器人个数">
            <el-input v-model="dataForm.botNum" placeholder="机器人个数"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="gender" label="性别">
            <el-radio-group v-model="dataForm.gender">
              <el-radio :label="1">女</el-radio>
              <el-radio :label="0">男</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button v-auth="'sys:bot'" type="primary" @click="submitHandle()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElLoading, ElMessage } from 'element-plus/es'
import { adminAddBot, useUserApi } from '@/api/sys/user'
import { usePostListApi } from '@/api/sys/post'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const postList = ref<any[]>([])
// const roleList = ref<any[]>([])
const dataFormRef = ref()

const dataForm = reactive({
  id: '',
  botNum: '',
  type: 1,
  gender: 1 // 默认性别为 "女"
})

const init = (id?: number) => {
  visible.value = true
  dataForm.id = ''

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  // id 存在则为修改
  if (id) {
    getUser(id)
  }

  getPostList()
}


// 获取岗位列表
const getPostList = async () => {
  let res = await usePostListApi()
  postList.value = res.data
}

// 获取信息
const getUser = (id: number) => {
  useUserApi(id).then(res => {
    Object.assign(dataForm, res.data)
  })
}

const dataRules = ref({
  botNum: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }]
})

// 表单提交
const submitHandle = () => {
  const loading = ElLoading.service({
    lock: true,
    text: '正在添加机器人，请稍等',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }

    adminAddBot(dataForm)
        .then(() => {
          ElMessage.success({
            message: '操作成功',
            duration: 500,
            onClose: () => {
              visible.value = false
              emit('refreshDataList')
            }
          })
        })
        .finally(() => {
          loading.close()
        })
  })
}

defineExpose({
  init
})
</script>
