import service from '@/utils/request'

export const cancelPunishApi = (dataForm: any) => {
	return service.post('/admin/sys/user/cancel-punish', dataForm)
}

export const addPunishApi = (dataForm: any) => {
	return service.post('/admin/sys/user/add-punish', dataForm)
}
