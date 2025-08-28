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
	name: string
	value: number
}

export const staticApi = (params: StaticList) => {
	return service.get('/admin/data/static', { params })
}

export const addPlatformSubmitApi = (params: any) => {
	return service.get('/admin/add/platform', {params})
}

export const updatePlatformSubmitApi = (params: any) => {
	return service.get('/admin/update/platform', {params})
}

export const addNodeSubmitApi = (params: any) => {
	return service.get('/admin/add/node', {params})
}

export const updateNodeSubmitApi = (params: any) => {
	return service.get('/admin/update/node', {params})
}

export const addEventSubmitApi = (params: any) => {
	return service.get('/admin/add/event', {params})
}

export const updateEventSubmitApi = (params: any) => {
	return service.get('/admin/update/event', {params})
}

export const addEquipmentSubmitApi = (params: any) => {
	return service.get('/admin/add/equipment', {params})
}

export const updateEquipmentSubmitApi = (params: any) => {
	return service.get('/admin/update/equipment', {params})
}

export const addChannelSubmitApi = (params: any) => {
	return service.get('/admin/add/channel', {params})
}

export const updateChannelSubmitApi = (params: any) => {
	return service.get('/admin/update/channel', {params})
}