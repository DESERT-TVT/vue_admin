import service from '@/utils/request'

export const updateWalletApi = (dataForm: any) => {
	return service.post('/admin/payment/update/wallet', dataForm)
}
