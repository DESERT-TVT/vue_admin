import service from '@/utils/request'
import Oss from 'ali-oss'
import { UploadRequestOptions } from 'element-plus'
import { reactive } from 'vue'

export const useUploadAuthApi = () => {
	return service.get('/server/auth/file/sts')
}

export const useUploadOssApi = async (file: File, path: string, fileName: any, suffix: string, options?: UploadRequestOptions) => {
	let url: string = ''

	// 进度
	const progress = (p: any, _checkpoint: any) => {
		//@ts-ignore
		options?.onProgress({ percent: p * 100 })
	}

	await useUploadAuthApi().then(async (r: any) => {
		const uploadUrl = r.data.uploadUrl
		const client = new Oss({
			secure: true,
			region: r.data.region,
			accessKeyId: r.data.accessKeyId,
			accessKeySecret: r.data.accessKeySecret,
			stsToken: r.data.stsToken,
			bucket: r.data.bucket
		})

		await client.multipartUpload(path + (fileName === null ? r.data.key : fileName) + suffix, file, { progress }).then((r: any) => {
			url = uploadUrl + r.name
		})
	})

	return url
}

export const useVodUploadAuthApi = (fileName: string, videoCallId: number) => {
	const params = { fileName: fileName, videoCallId: videoCallId }
	return service.get('/admin/sys/file/vod', { params: params })
}

export const useVodUploadAuthRefreshApi = (videoId: number) => {
	const params = { videoId: videoId }
	return service.get('/admin/sys/file/vod/refresh', { params: params })
}

export const useCreateUploader = (videoCall: any, options: UploadRequestOptions) => {
	//@ts-ignore
	let uploader = new AliyunUpload.Vod({
		timeout: 60000,
		partSize: Math.round(1048576),
		parallel: 5,
		retryCount: 3,
		retryDuration: 2,
		region: 'cn-shanghai',
		userId: '203793700704213086',
		localCheckpoint: true, // 此参数是禁用服务端缓存，不影响断点续传

		// 添加文件成功
		addFileSuccess: function (uploadInfo: any) {
			// console.log('添加文件成功, 等待上传...')
			console.log('addFileSuccess: ' + uploadInfo.file.name)
		},

		// 开始上传
		onUploadstarted: function (uploadInfo: any) {
			useVodUploadAuthApi(uploadInfo.file.name, videoCall.id).then((res: any) => {
				let uploadAuth = res.data.uploadAuth
				let uploadAddress = res.data.uploadAddress
				let videoId = res.data.videoId
				uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId)
			})
			/*console.log('文件开始上传...')
            console.log(
                'onUploadStarted:' +
                    uploadInfo.file.name +
                    ', endpoint:' +
                    uploadInfo.endpoint +
                    ', bucket:' +
                    uploadInfo.bucket +
                    ', object:' +
                    uploadInfo.object
            )*/
		},

		// 文件上传成功
		onUploadSucceed: function (uploadInfo: any) {
			let index = videoCall.index
			if (!index) {
				// 计算集数
				let fileName = uploadInfo.file.name
				fileName = fileName.substring(0, fileName.lastIndexOf('.'))
				index = fileName.match(/\d+/g)?.pop()
			}

			const episodeForm = reactive({
				index: index,
				videoPath: uploadInfo.videoId,
				videoCallId: videoCall.id,
				id: videoCall.episodeId
			})

			console.log(episodeForm)
			// bannerAdverformSubmitApi(episodeForm)
			//     .then(res => {
			//         options.onSuccess(uploadInfo)
			//     })
			//     .catch(() => {
			//         //@ts-ignore
			//         options.onProgress({ percent: 95 })
			//     })
		},

		// 文件上传失败
		onUploadFailed: function (uploadInfo: any, code: any, message: any) {
			// console.log('文件上传失败')
			console.log('onUploadFailed: file:' + uploadInfo.file.name + ',code:' + code + ', message:' + message)
		},

		// 取消文件上传
		onUploadCanceled: function (uploadInfo: any, code: any, message: any) {
			// console.log('文件已暂停上传')
			console.log('Canceled file: ' + uploadInfo.file.name + ', code: ' + code + ', message:' + message)
		},

		// 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
		onUploadProgress: function (uploadInfo: any, totalSize: any, progress: any) {
			// console.log('文件上传中...')
			// console.log('onUploadProgress:file:' + uploadInfo.file.name + ', fileSize:' + totalSize + ', percent:' + Math.ceil(progress * 100) + '%')
			let progressPercent = Math.ceil(progress * 100)
			//@ts-ignore
			options.onProgress({ percent: progressPercent })
			// console.log(progressPercent)
		},

		// 上传凭证超时
		onUploadTokenExpired: function (uploadInfo: any) {
			// console.log('文件超时，重新获取授权...')
			useVodUploadAuthRefreshApi(uploadInfo.videoId).then((res: any) => {
				let uploadAuth = res.data.uploadAuth
				uploader.resumeUploadWithAuth(uploadAuth)
			})
		},

		// 全部文件上传结束
		onUploadEnd: function (uploadInfo: any) {
			// console.log('文件上传完毕')
		}
	})
	return uploader
}
