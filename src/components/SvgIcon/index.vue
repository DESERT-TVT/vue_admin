<script lang="ts" setup>
import { computed, CSSProperties } from 'vue'

type SvgIconProps = {
	prefix?: string
	name: string
	size?: number | string
	classNames?: string
}
const props = withDefaults(defineProps<SvgIconProps>(), {
	prefix: 'icon',
	size: 14
})
const symbolId = computed(() => `#${props.prefix}-${props.name}`)
const styles = computed<CSSProperties>(() => {
	const res = {
		width: props.size + 'px',
		height: props.size + 'px'
	}
	return res
})
</script>
<template>
	<svg :class="classNames" :style="styles" aria-hidden="true" class="svg-icon">
		<use :xlink:href="symbolId" />
	</svg>
</template>
<style lang="scss" scoped>
.svg-icon {
	vertical-align: -0.1em; /* 因icon大小被设置为和字体大小一致，而span等标签的下边缘会和字体的基线对齐，故需设置一个往下的偏移比例，来纠正视觉上的未对齐效果 */
	overflow: hidden;
}
</style>
