<template>
	<div>
		<el-select-v2
			:model-value="props.modelValue"
			@update:model-value="handleChange"
			@clear="handleClear"
			style="width: 240px"
			filterable
			remote
			:remote-method="remoteMethod"
			clearable
			:options="options"
			:loading="loading"
			:placeholder="props.placeholder"
		/>
	</div>
</template>
<script lang="ts" setup>
import service from '@/utils/request'
import { ref } from 'vue'
export type FetchV2 = {
	url: string
	params: object
}
const props = defineProps<{
	modelValue: string | number | null
	placeholder: string
	fetch: FetchV2
}>()

// 定义事件
const emit = defineEmits<{
	(e: 'update:modelValue', value: typeof props.modelValue): void
	(e: 'changeLabel', label: string): void
}>()

function handleChange(value: string) {
	emit('update:modelValue', value)
	const selected = options.value.find((item: any) => item.value === value)
	emit('changeLabel', selected?.label ?? '')
}

function handleClear(value: string) {
	emit('update:modelValue', value)
	const selected = options.value.find((item: any) => item.value === value)
	if (selected) {
		emit('changeLabel', selected.label)
	}
}

const loading = ref(false)
const options = ref<{ value: string | number; label: string }[]>([])
const remoteMethod = async (query: string) => {
		loading.value = true
		try {
			const { data } = await service.get(props.fetch.url, {
				params: {
					...props.fetch.params,
					name: query
				}
			})
			options.value = data.list.map((item: any) => {
				return {
					value: item.id,
					label: item.name
				}
			})
		} finally {
			loading.value = false
		}
}
</script>

<style lang="scss" scoped></style>
