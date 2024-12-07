import service from '@/utils/request'

export const APIAddOrUpdatePriceConfig = (params: any) => {
	return service.post('/admin/config/chat/price/modify', params)
}
// export const APIGetUnionDetailList = (id: Number) => {
//     return service.get('/admin/union/detail/list/' + id)
// }
