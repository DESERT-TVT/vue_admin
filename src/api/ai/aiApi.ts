import service from '@/utils/request'

export interface PostMessageParams {
	userId: number
	botId: number
	message: string
}

export interface PostDynamicParams {
	userId: number
	urls: string[]
	content: string
}

export interface SaveCargoParams {
	urls: string[]
	content: string
}

export const APIGetUserFriend = (userId: number) => {
	return service.get('/admin/sys/user/getUserFriendList?userId=' + userId)
}
export const APIModifyDistance = (distance: number) => {
	return service.get('/admin/sys/user/modifyBotDistance?distance=' + distance)
}
export const APIGetDistance = () => {
	return service.get('/admin/sys/user/getDistance')
}
export const APIGetChatHistory = (botId: number, userId: number) => {
	return service.get('/admin/sys/user/bot/messages?userId=' + userId + '&botId=' + botId)
}
export const APIPostMessage = (data: PostMessageParams) => {
	return service.post('/admin/sys/user/bot/postMessage', data)
}
export const APIPostDynamic = (data: PostDynamicParams) => {
	return service.post('/admin/sys/user/bot/screenshot/add', data)
}

export const APISaveCargo = (data: SaveCargoParams) => {
	return service.post('/admin/sys/user/bot/cargo/add', data)
}

export const APIGetModelList = () => {
	return service.get('/admin/sys/user/bot/model/list')
}
export const APISetBotModel = (data: any) => {
	return service.post('/admin/sys/user/bot/model/bind', data)
}
