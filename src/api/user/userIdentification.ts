import service from '@/utils/request'

export const userIdentificationExamine = (dataForm: any) => {
	return service.post('/admin/sys/user/examine/identification', dataForm)
}

export const userPhotoListApi = (dataForm: any) => {
	return service.get('/server/user/photo/list', { params: dataForm })
}
