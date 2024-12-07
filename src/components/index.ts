import type { App, Plugin } from 'vue'
import FastDictColumn from '@/components/fast-dict/fast-dict-column/index.vue'
import FastDictLabel from '@/components/fast-dict/fast-dict-label/index.vue'
import FastDictRadio from '@/components/fast-dict/fast-dict-radio/index.vue'
import FastDictSelect from '@/components/fast-dict/fast-dict-select/index.vue'
import FastDataColumn from '@/components/fast-data/fast-data-column/index.vue'
import FastDataLabel from '@/components/fast-data/fast-data-label/index.vue'
import FastDataSelect from '@/components/fast-data/fast-data-select/index.vue'
import FastDataTable from '@/components/fast-data/fast-data-table/index.vue'

import FastIcon from '@/components/fast-icon/index.vue'
import FastEditor from '@/components/fast-editor/index.vue'
import FastMarkdown from '@/components/fast-markdown/index.vue'
import FastAddress from '@/components/fast-address/index.vue'
import FastUserInput from '@/components/fast-user/fast-user-input/index.vue'
import FastUserDialog from '@/components/fast-user/fast-user-dialog/index.vue'
import FastOrgSelect from '@/components/fast-org/fast-org-select/index.vue'
import FastOrgInput from '@/components/fast-org/fast-org-input/index.vue'
import FastRoleInput from '@/components/fast-role-input/index.vue'
import FastPostInput from '@/components/fast-post-input/index.vue'
import FastUploadImage from '@/components/fast-upload/fast-upload-image/index.vue'
import FastUploadImages from '@/components/fast-upload/fast-upload-images/index.vue'

const components = [
	FastEditor,
	FastMarkdown,
	FastAddress,
	FastIcon,
	FastDictLabel,
	FastDictColumn,
	FastDictRadio,
	FastDictSelect,
	FastDataColumn,
	FastDataLabel,
	FastDataSelect,
	FastDataTable,
	FastUserInput,
	FastUserDialog,
	FastOrgSelect,
	FastOrgInput,
	FastRoleInput,
	FastPostInput,
	FastUploadImage,
	FastUploadImages
]

const FastComponent: Plugin = {
	install(Vue: App) {
		components.forEach((component: any) => {
			Vue.component(component.name, component)
		})
	}
}

export default FastComponent
