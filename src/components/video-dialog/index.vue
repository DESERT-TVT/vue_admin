<script lang="ts" setup>
import MyVideo from '@/components/MyVideo/index.vue'
import { reactive, ref } from 'vue'

const handleClose = () => {
	visible.value = false
}
const dataForm = reactive({
	poster: '',
	src: '',
	width: '',
	isImg: false
})
const visible = ref(false)
const init = (row: any) => {
	visible.value = true
	dataForm.poster = row.poster
	dataForm.src = row.src
	dataForm.isImg = row.isImg ? true : false
}
defineExpose({
	init
})
</script>

<template>
	<el-dialog v-if="dataForm.isImg" v-model="visible" :append-to-body="true" :destroy-on-close="true" width="1050" @close="handleClose">
		<img :src="dataForm.src" alt="Preview Image" style="width: 100%" />
	</el-dialog>
	<el-dialog v-else v-model="visible" :append-to-body="true" :destroy-on-close="true" width="1050" @close="handleClose">
		<div class="video-container">
			<MyVideo :poster="dataForm.poster" :src="dataForm.src" />
		</div>
	</el-dialog>
</template>

<style scoped>
.video-container {
	width: 1020px;
	height: 600px;
}
</style>
