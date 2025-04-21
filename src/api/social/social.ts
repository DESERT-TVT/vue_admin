import service from '@/utils/request'

export const APIRecommended = (params: any) => {
	return service.post('/admin/social/recommend', params)
}

export const APIRecommendedAnchor = (params: any) => {
	return service.post('/admin/social/recommend/anchor', params)
}

export const APIRecommendedAnchorSort = (params: any) => {
	return service.post('/admin/social/recommend/anchor/sort', params)
}
