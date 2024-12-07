import service from '@/utils/request'
import { DefaultGiftSaveVO } from '@/types/social'

export const giftFormApi = (id: Number) => {
	return service.get('/admin/social/gift/' + id)
}

export const giftSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.post('/admin/social/gift/update', dataForm)
	} else {
		return service.post('/admin/social/gift/add', dataForm)
	}
}
export const APIGetAllGiftList = () => {
	return service.get('/admin/social/gift/page/all')
}

export const APISaveDefaultGift = (params: DefaultGiftSaveVO) => {
	return service.post('/admin/social/gift/default/save', params)
}
