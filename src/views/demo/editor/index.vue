<template>
	<div>
		<fast-editor v-model="editorValue" placeholder="请输入..."></fast-editor>
		<!--		<fast-editor v-model="editorValue2" :disabled="true" placeholder=""></fast-editor>-->
	</div>
</template>

<script lang="ts" setup name="DemoEditorIndex">
import { ref } from 'vue'

const editorValue = ref('<p>video-call</p>')
// const editorValue2 = ref('<p>video-call</p>')
</script>
