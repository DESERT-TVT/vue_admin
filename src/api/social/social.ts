import service from '@/utils/request'

export const APIRecommended = (params: any) => {
	return service.post('/admin/social/recommend', params)
}
