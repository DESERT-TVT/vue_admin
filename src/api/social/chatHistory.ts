import service from '@/utils/request'

export const getUsernameByUserId = (id: string) => {
	return service.get('/sys/user/' + id)
}

export const getUsernameByUserIds = (userNames: string) => {
	let params = {
		userNames: userNames
	}
	return service.get('/server/user/user/list/info', { params: params })
}
