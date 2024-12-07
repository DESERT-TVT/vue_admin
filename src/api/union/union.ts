import service from '@/utils/request'

// export const giftFormApi = (id: Number) => {
//     return service.get('/admin/social/gift/' + id)
// }

export const APIModifyUnionActive = (id: any, active: any, kickbackRate: any, status: any, kickbackRateOnline: any) => {
	const data = {
		unionId: id,
		active: active,
		kickbackRate: kickbackRate,
		status: status,
		kickbackRateOnline: kickbackRateOnline
	}
	return service.post('/admin/union/update/active', data)
}
export const APIGetUnionDetailList = (id: number) => {
	return service.get('/admin/union/detail/list/' + id)
}
export const APIGetUnionSettleDetailList = (params: any) => {
	return service.get('/admin/union/resettle/detail', { params })
}

export const APIApplyUnion = (params: any) => {
	return service.post('/admin/union/apply/add', params)
}

export const APIApplyUnionSubmit = (params: any) => {
	return service.post('/admin/union/apply/check', params)
}

export const APIGetSettleTotal = (params: any) => {
	return service.get('/admin/union/settle/total', { params })
}
