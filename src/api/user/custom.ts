import service from '@/utils/request'

export interface AdminListRes {
	list: {
		id: number
		username: string
	}[]
}
export const fetchAdminList = () => {
	return service.get<AdminListRes>('admin/sys/user/manage/page', {
		params: {
			page: 1,
			limit: 10000,
			asc: false
		}
	})
}

export interface CustomAddReq {
	userId: number
	status: number
}
export const fetchCustomAdd = (params: CustomAddReq) => {
	return service.get('/admin/custom/add', { params })
}

export const fetchCustomDelete = (userId: number) => {
	return service.get('/admin/custom/delete', {
		params: {
			userId
		}
	})
}
