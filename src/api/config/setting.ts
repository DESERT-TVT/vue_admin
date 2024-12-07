import service from '@/utils/request'

export const APIAddOrUpdateLevelExpConfig = (params: any) => {
	return service.post('/admin/config/level/exp/modify', params)
}

export const APIAddOrUpdateIntegralConfig = (params: any) => {
	return service.post('/admin/config/intergral/config/modify', params)
}

export const APIModifyConfigList = () => {
	return service.get('/admin/config/settle/list')
}
export const APIWithDrawConfigList = () => {
	return service.get('/admin/config/withdraw/list')
}
export const APIWithCommonConfigList = () => {
	return service.get('/admin/config/common/config/list')
}
export const APIWithCommonConfigUpdate = (params: any) => {
	return service.post('/admin/config/common/config/update',params)
}
export const APIGetCallCenterConfigList = () => {
	return service.get('/admin/config/call/center/list')
}
export const APIModifyConfigModify = (params: any) => {
	return service.post('/admin/config/settle/modify', params)
}
export const APIModifyWithdrawConfigModify = (params: any) => {
	return service.post('/admin/config/withdraw/modify', params)
}
export const APIModifyCallCenterModify = (params: any) => {
	return service.post('/admin/config/call/center/update', params)
}
export const APIModifyGoldCoinModify = (params: any) => {
	return service.post('/admin/config/coin/config/modify', params)
}
export const APIModifyMemberModify = (params: any) => {
	return service.post('/admin/config/member/config/modify', params)
}
export const APIAreaList = () => {
	return service.get('/admin/config/area/list')
}
export const APIUseUserAreaSubmit = (params: any) => {
	if (params.id) {
		return service.post('/admin/config/area/update', params)
	} else {
		return service.post('/admin/config/area/save', params)
	}
}

export const APIPayPlatformConfigSubmit = (params: any) => {
	if (params.id) {
		return service.post('/admin/config/pay/platform/update', params)
	} else {
		return service.post('/admin/config/pay/platform/save', params)
	}
}

export const APIPayPlatformConfig = (id: number) => {
	return service.get('/admin/config/pay/platform/' + id)
}

export const useEmailConfigSubmitApi = (dataForm: any) => {
	return service.post('/admin/config/email/edit', dataForm)
}

export const APIRechargeConfigEdit = (dataForm: any) => {
	return service.post('/admin/config/recharge/bonus/config/edit', dataForm)
}

export const APIModifyTaskCoin = (dataForm: any) => {
	return service.post('/admin/task/task/modify', dataForm)
}

export const APIModifyTaskCoinDaily = (dataForm: any) => {
	return service.post('/admin/task/task/modify/daily', dataForm)
}