import service from '@/utils/request'

// 抽奖详情
export const APIGetGameDetailList = (id: Number, page?: any, size?: any) => {
	return service.get('/admin/social/game/record/' + id)
}

// export const giftSubmitApi = (dataForm: any) => {
//     if (dataForm.id) {
//         return service.post('/admin/social/gift/update', dataForm)
//     } else {
//         return service.post('/admin/social/gift/add', dataForm)
//     }
// }
