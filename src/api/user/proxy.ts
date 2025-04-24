import service from '@/utils/request'
import { pa } from 'element-plus/es/locale'

export interface ProxyAddReq {
	/** 目标用户id */
	userId: string
	/** 代理消费分成 */
	cosRate?: string
	/** 代理收益分成 */
	inRate?: string
	/** 下级主播直接分成 */
	onlineRate?: string
	/** 上级用户id */
	parentUserId?: string
	/** 1主播 2 代理 */
	userType?: 1 | 2
}
export const fetchAddProxy = (data: ProxyAddReq) => {
	return service.post('/admin/proxy/add', data)
}
export const fetchUpdateProxy = (data: ProxyAddReq) => {
	return service.post('/admin/proxy/update', data)
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
export interface ProxyIncomeReq {
	userId: string
	begin: string
	end: string
}
export interface ProxyIncomeRes {
	/** 代理总收益 */
	proxyTotalIncome: number
	/** 主播收益 */
	onlineIncome: number
	/** 推广收益 */
	proxyIncome: number
}
export function fetchProxyIncome(params: ProxyIncomeReq) {
	return service.get<ProxyIncomeRes>('/admin/proxy/income', {
		params
	})
}
export interface ProxyInfoRes {
	/** 一级代理数据 */
	oneLevelNumber: number
	/** 一级代理代理收益 */
	oneLevelIncome: number
	/** 二级代理数据 */
	twoLevelNumber: number
	/** 二级代理收益 */
	twoLevelIncome: number
}
export function fetchProxyInfo(params: ProxyIncomeReq) {
	return service.get<ProxyInfoRes>('/admin/proxy/info/proxy', {
		params
	})
}
export interface OnlineInfoRes {
	/** 主播总数 */
	onlineNumber: number
	/** 主播总收益 */
	onlineIncome: number
}
export function fetchOnlineInfo(params: ProxyIncomeReq) {
	return service.get<ProxyInfoRes>('/admin/proxy/info/online', {
		params
	})
}
export interface UserInfoRes {
	/** 注册用户数 */
	registerNumber: number
	/** 支付用户数 */
	payNumber: number
	/** 活跃用户数 */
	dynamicNumber: number
	/** 相比增长 */
	increaseRate: number
}
export function fetchUserInfo(params: ProxyIncomeReq) {
	return service.get<UserInfoRes>('/admin/proxy/info/user', {
		params
	})
}
