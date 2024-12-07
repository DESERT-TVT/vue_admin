import service from '@/utils/request'

export const handleRiskTipsApi = (dataForm: any) => {
	return service.post('/admin/sys/user/risk-status', dataForm)
}
