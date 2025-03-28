import service from '@/utils/request'
import { pa } from 'element-plus/es/locale'

export interface ProxyAddReq {
	/** 目标用户id */
	userId: string
	/** 代理消费分成 */
	cosRate: string
	/** 代理收益分成 */
	inRate: string
	/** 下级主播直接分成 */
	onlineRate: string
	/** 上级用户id */
	parentUserId?: string
	/** 1主播 2 代理 */
	userType?: 1 | 2
}
export const fetchAddProxy = (data: ProxyAddReq) => {
	return service.post('/admin/proxy/add', data)
}
export interface ProxyListReq {
	/*总记录数 */
	total: number

	/*列表数据 */
	list: ProxyListData[]

	/*扩展数据 */
	extend: Record<string, unknown>
}
export interface ProxyListData {
	/** 用户id */
	userId: string

	/** 代理消费分成 */
	cosRate: number

	/** 代理收益分成 */
	inRate: number

	/** 下级主播直接分成 */
	onlineRate: number
}
export const fetchProxyList = (parentId: string) => {
	return service.get<ProxyListReq>('/admin/proxy/list/leve1', {
		params: {
			parentId,
			page: 1,
			limit: 100
		}
	})
}
