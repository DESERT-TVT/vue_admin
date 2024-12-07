import service from '@/utils/request'

export const sysMessageformSubmitApi = (dataForm: any) => {
	return service.post('/admin/message/add', dataForm)
}
