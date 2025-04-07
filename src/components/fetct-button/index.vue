<template>
	<el-button :loading="submitLoading" type="primary" @click="handleClick">
		<template #default>
			<slot>确定</slot>
		</template>
	</el-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
	submitHandle: () => Promise<any>
}>()

const submitLoading = ref(false)

const handleClick = () => {
	if (submitLoading.value) {
		return
	}
	submitLoading.value = true
	props.submitHandle().finally(() => {
		setTimeout(() => {
			submitLoading.value = false
		}, 500)
	})
}
</script>
