<template>
  <el-dialog
      v-model="visible"
      :close-on-click-modal="false"
      title="新增文案图片"
      width="50%"
      @close="closeDialogHandle"
  >
    <el-form ref="dataFormRef" :model="dataForm" label-width="150px" @keyup.enter="submitHandle()">
      <!-- 文案输入 -->
<!--      <el-form-item label="文案" prop="content">-->
<!--        <el-input-->
<!--            type="textarea"-->
<!--            v-model="dataForm.content"-->
<!--            placeholder="请输入文案，多个文案用  |  隔开"-->
<!--            :autosize="{ minRows: 3, maxRows: 5 }"-->
<!--        />-->
<!--      </el-form-item>-->

      <!-- 图片上传 -->
      <el-form-item label="图片" prop="media">
        <div class="scrollable-form-item">
          <el-upload
              ref="coverImageFileRef"
              v-model:file-list="coverImageFile"
              :auto-upload="false"
              :multiple="true"

              action="#"
              list-type="picture-card"
          >
            <el-icon>
              <Plus />
            </el-icon>
            <template #file="{ file }">
              <div style="width: 100%">
                <img :src="(file as any).url" alt="" class="el-upload-list__item-thumbnail" />
                <span class="el-upload-list__item-actions">
                  <span class="el-upload-list__item-delete" @click="handleCoverImageFileRemove(file)">
                    <el-icon><Delete /></el-icon>
                  </span>
                </span>
              </div>
            </template>
          </el-upload>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="closeDialogHandle">取消</el-button>
      <el-button type="primary" @click="submitHandle()">发布</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage, UploadInstance } from 'element-plus/es'
import { Delete, Plus } from '@element-plus/icons-vue'
import { useUploadAwsApi } from '@/api/awsUpload'
import {APIPostDynamic, APISaveCargo, PostDynamicParams, SaveCargoParams} from '@/api/ai/aiApi'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)

const dataFormRef = ref()
const coverImageFile = ref<any[]>([])
const coverImageFileRef = ref<UploadInstance>()

const dataForm = reactive({
  content: '', // 文案
  userId: 0,
  media: ref<string[]>([]) // 图片列表
})

// 初始化弹窗数据
const init = (row: any) => {
  visible.value = true
  dataForm.content = ''
  dataForm.userId = row.userId || 0
  dataForm.media = []
  coverImageFile.value = []
}

// 关闭弹窗
const closeDialogHandle = () => {
  visible.value = false
  dataForm.content = ''
  dataForm.media = []
  coverImageFileRef.value?.clearFiles()
}

// 图片上传限制
// const coverImageFileExceed = () => {
//   ElMessage.warning('最多只能上传10张图片！')
// }

// 移除图片
const handleCoverImageFileRemove = (file: any) => {
  const index = coverImageFile.value.findIndex((f) => f.uid === file.uid)
  if (index > -1) {
    coverImageFile.value.splice(index, 1)
    dataForm.media.splice(index, 1)
  }
}

// 提交数据
const submitHandle = async () => {
  // 上传图片
  if (coverImageFile.value && coverImageFile.value.length > 0) {
    for (const file of coverImageFile.value) {
      if (file.raw) {
        const suffix = file.raw.name.substring(file.raw.name.lastIndexOf('.'))
        const uploadedUrl = await useUploadAwsApi(file.raw, suffix)
        dataForm.media.push(uploadedUrl)
      }
    }
  }

  // if (!dataForm.content.trim()) {
  //   ElMessage.error('文案不能为空！')
  //   return
  // }

  const params: SaveCargoParams = {
    content: dataForm.content,
    urls: dataForm.media
  }

  APISaveCargo(params).then((res:any) => {
    if(res.code === 0){
      ElMessage.success('保存成功')

    }else {
      ElMessage.error(res.msg)
    }
  }).finally(()=>{
    emit('refreshDataList')
    closeDialogHandle()
  })

}
defineExpose({ init })
</script>

<style lang="scss" scoped>
.scrollable-form-item {
  height: 100%;
  overflow-x: auto;
  white-space: nowrap;
}

.scrollable-form-item::-webkit-scrollbar {
  height: 10px;
}

.scrollable-form-item::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

.scrollable-form-item::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 5px;
}

.scrollable-form-item::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

:deep(.el-upload-list--picture-card .el-upload-list__item-thumbnail) {
  object-fit: cover;
}
</style>
