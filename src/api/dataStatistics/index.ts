import service from '@/utils/request'

export type PlatformParams = {
	page: number
	limit: number
	name?: string
}

export type PlatformReq = {
	total: number
	list: PlatformList[]
}

export type PlatformList = {
	id: number
	name: string
	createTime: string
	creator: number
}

export const platformApi = (params: PlatformParams) => {
	return service.get('/admin/platform/page', { params })
}

export type StaticList = {
	platformId: number
	start: string
	end: string
	groupColumn: string
	equipmentId?: number
	channelId?: number
	eventId?: number
	nodeId?: number
	otherData?: string
}


export type StaticListList = {
	id: number
	name: string
	value: number
}

export const staticApi = (params: StaticList) => {
	return service.get('/admin/data/static', { params })
}
