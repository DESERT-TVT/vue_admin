import service from '@/utils/request'

export interface DiscoveryPageRes {
	/**Id */
	id: number
	/**用户Id */
	userId: number
	/**用户名 */
	userName: string
	/**昵称 */
	nickName: string
	/**状态 0停用 1启用 */
	status: number
	/** 性别 */
	gender: number
}
export interface DiscoveryEditOrAddReq {
	/**用户Id */
	userIds: string[]
	/**状态 0停用 1启用 */
	status: number
}
export const fetchDiscoveryAdd = (data: DiscoveryEditOrAddReq) => {
	return service.post('/admin/discovery/add', data)
}
export const fetchDiscoveryEdit = (data: DiscoveryEditOrAddReq) => {
	return service.post('/admin/discovery/edit', data)
}
export interface DiscoveryDeleteReq {
	/**用户Id */
	userIds: string[]
}
export const fetchDiscoveryDelete = (data: DiscoveryDeleteReq) => {
	return service.post('/admin/discovery/delete', data)
}
