<template>
	<div>
		<fast-icon icon="icon-ellipsis-v" @click="themeSettingsHandle"></fast-icon>
	</div>
</template>

<script setup lang="ts">
import emits from '@/utils/emits'

const themeSettingsHandle = () => {
	emits.emit('openThemeSettings')
}
</script>
