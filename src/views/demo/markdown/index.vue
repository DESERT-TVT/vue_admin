<template>
	<div>
		<fast-markdown v-model="editorValue" height="500px"></fast-markdown>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const editorValue = ref('video-call')
</script>
