import service from '@/utils/request'

export const useSiteList = () => {
	return service.get('/admin/platform/page',{params:{
		page:1,
		limit:1000
	}})
}
