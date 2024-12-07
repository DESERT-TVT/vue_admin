import service from '@/utils/request'

export const getCount = () => {
	return service.get('/admin/index/count')
}

export const getAgingCount = (dataForm: any) => {
	let params = {
		startDate: dataForm.startDate,
		endDate: dataForm.endDate
	}
	if (dataForm.startDate && dataForm.endDate) {
		return service.get('/admin/index/aging/count', { params: params })
	} else {
		return service.get('/admin/index/aging/count')
	}
}

export const getDiagramCount = () => {
	return service.get('/admin/index/diagram/count')
}
