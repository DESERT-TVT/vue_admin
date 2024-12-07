import service from '@/utils/request'

export const bannerAdverformApi = (id: Number) => {
	return service.get('/admin/social/banner-adver/' + id)
}

export const bannerAdverformSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.post('/admin/social/banner-adver/update', dataForm)
	} else {
		return service.post('/admin/social/banner-adver/add', dataForm)
	}
}
