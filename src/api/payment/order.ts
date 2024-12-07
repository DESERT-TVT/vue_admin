import service from '@/utils/request'

export const handFinishOrderApi = (dataForm: any) => {
	return service.post('/admin/payment/hand-finish-order', dataForm)
}
