import service from '@/utils/request'

export interface ProxyAddReq {
	// 是否代理
	userId: string
	// 代理地址
	type2Rate: Record<number, string>
}
export const fetchAddProxy = (data: ProxyAddReq) => {
	return service.post('/admin/proxy/add', data)
}
