import service from '@/utils/request'

export const returnHandleApi = (dataForm: any) => {
	return service.post('/admin/payment/gift-order/refund', dataForm)
}
