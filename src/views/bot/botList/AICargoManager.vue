<template>
  <el-dialog
      v-model="visible"
      :close-on-click-modal="false"
      title="发布朋友圈"
      width="50%"
      @close="closeDialogHandle"
  >
    <el-form ref="dataFormRef" :model="dataForm" label-width="150px" @keyup.enter="submitHandle()">
      <!-- 文案输入 -->
      <el-form-item label="文案" prop="content">
        <el-input
            type="textarea"
            v-model="dataForm.content"
            placeholder="请输入文案"
            :autosize="{ minRows: 3, maxRows: 5 }"
        />
      </el-form-item>

      <!-- 图片或视频上传 -->
      <el-form-item label="视频或图片" prop="media">
        <div class="scrollable-form-item">
          <el-upload
              ref="coverImageFileRef"
              v-model:file-list="coverImageFile"
              :auto-upload="false"
              :limit="10"
              :multiple="true"
              :on-exceed="coverImageFileExceed"
              action="#"
              list-type="picture-card"
          >
            <el-icon>
              <Plus />
            </el-icon>
            <template #file="{ file }">
              <div v-if="file.url[0].indexOf(';') != -1" style="width: 100%">
                <img :src="file.url[0].split(';')[1]" alt="" class="el-upload-list__item-thumbnail" />
                <span class="el-upload-list__item-actions">
									<span class="el-upload-list__item-delete" @click="videoDialogHandle(file.url[0], false)">
										<el-icon><VideoPlay /></el-icon>
									</span>
									<span class="el-upload-list__item-delete" @click="handleCoverImageFileRemove(file)">
										<el-icon><Delete /></el-icon>
									</span>
								</span>
              </div>
              <div v-else style="width: 100%">
                <img :src="(file as any).url" alt="" class="el-upload-list__item-thumbnail" />
                <span class="el-upload-list__item-actions">
									<span class="el-upload-list__item-delete" @click="videoDialogHandle(file.url[0], true)">
										<el-icon><ZoomIn /></el-icon>
									</span>
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
import { Delete, Plus, VideoPlay, ZoomIn } from '@element-plus/icons-vue'
import { useUploadAwsApi } from '@/api/awsUpload'
import {APIPostDynamic, PostDynamicParams} from "@/api/ai/aiApi";

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)

const dataFormRef = ref()
const coverImageFile = ref<any[]>([])
const coverImageFileRef = ref<UploadInstance>()

const dataForm = reactive({
  content: '', // 文案
  userId: 0,
  media: ref<string[]>([]) // 图片或视频列表
})

// 打开弹窗初始化数据
const init = (row:any) => {
  visible.value = true
  dataForm.content = ''
  dataForm.userId = row.userId
  dataForm.media = []
}

// 关闭弹窗
const closeDialogHandle = () => {
  visible.value = false
  dataForm.content = ''
  dataForm.media = []
  coverImageFileRef.value?.clearFiles()
}

// 图片或视频上传限制
const coverImageFileExceed = (file: any) => {
  coverImageFileRef.value!.clearFiles()
  coverImageFileRef.value!.handleStart(file[0])
}

// 移除图片或视频
const handleCoverImageFileRemove = (uploadFile: any) => {
  const index = coverImageFile.value.findIndex(file => file.uid === uploadFile.uid)
  if (index > -1) {
    coverImageFile.value.splice(index, 1)
  }
  dataForm.media = dataForm.media.filter((item: any) => item !== uploadFile.url[0])
}

// 提交数据
const submitHandle = async () => {
  // 上传图片或视频
  if (coverImageFile.value && coverImageFile.value.length > 0) {
    for (let i = 0; i < coverImageFile.value.length; i++) {
      if (coverImageFile.value.at(i).raw) {
        let raw = coverImageFile.value.at(i).raw
        const suffix = raw.name.substring(raw.name.lastIndexOf('.'))
        await useUploadAwsApi(raw, suffix).then(r => dataForm.media.push(r))
      }
    }
  }
  console.log("aaaaaaaaaaaaaaa",dataForm.media)

  // 提交表单
  if (!dataForm.content.trim()) {
    ElMessage.error('文案不能为空！')
    return
  }
  const params: PostDynamicParams = {
    userId: dataForm.userId,
    content: dataForm.content,
    urls: dataForm.media
  }

  APIPostDynamic(params).then((resp:any)=>{
    if(resp.code === 0){
      ElMessage.success({
        message: '朋友圈发布成功！',
        duration: 500,
        onClose: () => {
          emit('refreshDataList')
        }
      })
    }else {
      ElMessage.error('朋友圈发布失败！')
    }
  }).finally(()=>{
    closeDialogHandle()
  })
}

defineExpose({
  init
})
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
