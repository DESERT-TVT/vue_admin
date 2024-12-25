import service from '@/utils/request'

export const useUserInfoApi = () => {
	return service.get('/admin/sys/user/info')
}

export const useUserAvatarApi = (dataForm: any) => {
	return service.put('/admin/sys/user/avatar', dataForm)
}

export const updateIdentificationApi = (dataForm: any) => {
	return service.post('/admin/sys/user/update/identification', dataForm)
}

export const cancelIdentificationApi = (dataForm: any) => {
	return service.post('/admin/sys/user/cancel/identification', dataForm)
}

export const useUserSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/admin/sys/user', dataForm)
	} else {
		return service.post('/admin/sys/user', dataForm)
	}
}

export const useUserIsMuteApi = (dataForm: any) => {
	return service.post('/admin/sys/user/identification', dataForm)
}

export const getGoldCoinsDetailsApi = (dataForm: any) => {
	return service.get('/admin/sys/user/change-details/gold-or-integral', { params: dataForm })
}

export const getIntegralDetailsApi = (dataForm: any) => {
	return service.get('/admin/sys/user/change-details/gold-or-integral', { params: dataForm })
}

export const getRechargeCountApi = (dataForm: any) => {
	return service.get('/admin/sys/user/recharge-details', { params: dataForm })
}

export const getWithdrawCountApi = (dataForm: any) => {
	return service.get('/admin/sys/user/withdraw-details', { params: dataForm })
}

export const getUserInviteCountApi = (dataForm: any) => {
	return service.get('/admin/sys/user/user-invite', { params: dataForm })
}

export const getUserTemperamentLabelApi = (dataForm: any) => {
	return service.get('/server/user/label/list', { params: dataForm })
}

export const updateUserInfoApi = (dataForm: any) => {
	return service.post('/admin/sys/user/update', dataForm)
}
export const APIPostUserContactConfig = (dataForm: any) => {
	return service.post('/admin/sys/user/contact/config/modify', dataForm)
}
