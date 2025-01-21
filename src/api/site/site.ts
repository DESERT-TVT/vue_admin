import service from '@/utils/request'

export const APIGetAbleShareOnline = (page?: any, size?: any, search?: any) => {
	return service.get('/admin/sys/user/site/online/able/share')
}
export const APIGetSiteList = () => {
	return service.get('/admin/sys/user/site/able/share')
}
export const APISaveShareOnline = (params: any) => {
	return service.post('/admin/sys/user/site/online/share', params)
}

export const APIModifySite = (params: any) => {
	return service.post('/admin/site/config/modify', params)
}
export const APIModifySiteUserRate = (params: any) => {
	return service.post('/admin/site/config/modify/ratio', params)
}
