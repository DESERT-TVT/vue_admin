import service from '@/utils/request'

export const handleReportApi = (dataForm: any) => {
	return service.post('/admin/sys/user/handle-report', dataForm)
}

export const notHandleReportApi = (dataForm: any) => {
	return service.post('/admin/sys/user/not/handle/report', dataForm)
}
