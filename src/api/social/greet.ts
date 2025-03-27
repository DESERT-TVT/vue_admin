import service from '@/utils/request'

export interface AddGreetReq {
	content: string
	language: string
}
export const fetchAddGreet = (data: AddGreetReq[]) => {
	return service.post('/admin/social/add/greet', data)
}
export interface UpdateGreetReq extends AddGreetReq {
	id: number
}
export const fetchUpdateGreet = (data: UpdateGreetReq) => {
	return service.put('/admin/social/update/greet', data)
}
export interface DeleteGreetReq {
	ids: string
}
export const fetchDeleteUrlList = (ids: string) => {
	return service.delete('/admin/social/delete/greet', {
		params: {
			ids
		}
	})
}
