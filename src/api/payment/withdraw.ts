import service from '@/utils/request'

export const accessUserWithDraw = (dataForm: any) => {
	return service.post('/admin/payment/withdraw/check', dataForm)
}
