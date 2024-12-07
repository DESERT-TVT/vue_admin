import service from '@/utils/request'

export const getWithdrawDetailsApi = (dataForm: any) => {
	return service.get('/admin/sys/user/users-withdraw-details', { params: dataForm })
}
