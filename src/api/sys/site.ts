import service from '@/utils/request'

export const useSiteList = () => {
	return service.get('/sys/site/list')
}
