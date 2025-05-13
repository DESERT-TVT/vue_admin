import service from '@/utils/request'

export interface LablePageRes {
	/** 标签名称 */
	labelName: string
	/** 标签类型 1 个性标签 2 我会的 */
	labelType: number
	/** 创作者 */
	creator: number
	/** 创建时间 */
	createTime: string
	/**  */
	id: number
}
export interface LableDeleteReq {
	ids: number[]
	/** 标签类型 1 个性标签 2 我会的 */
	type: number
}
export const fetchLableDelete = (data: LableDeleteReq) => {
	return service.post('/admin/label/delete', data)
}
export interface LableAddReq {
	/** 标签名称 */
	labelName: string
	/** 标签类型 1 个性标签 2 我会的 */
	labelType: number
}
export const fetchLableAdd = (params: LableAddReq) => {
	return service.get('/admin/label/add', { params })
}
