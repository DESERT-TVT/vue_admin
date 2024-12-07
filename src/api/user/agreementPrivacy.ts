import service from '@/utils/request'

export const handleSaveOrUpdateApi = (dataForm: any) => {
	return service.post('/admin/sys/user/agreement-privacy', dataForm)
}
