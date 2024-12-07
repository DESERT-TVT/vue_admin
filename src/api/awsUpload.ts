import service from '@/utils/request'
import { ElMessage } from 'element-plus'
import axios from 'axios'
export const useUploadAuthApi = () => {
	return service.get('/server/auth/file/sts/aws')
}

export const useUploadAwsApi = async (file: File, suffix: string) => {
	let url
	await useUploadAuthApi().then(async (r: any) => {
		const params = {
			key: r.data.key + suffix,
			file: file,
			accessKeyId: r.data.accessKeyId, //访问登录名
			secretAccessKey: r.data.secretAccessKey, //访问密码
			sessionToken: r.data.sessionToken,
			region: r.data.region,
			bucketName: r.data.bucketName
		}
		try {
			await axios.putForm(r.data.api, params).then((res: any) => {
				if (res.status === 200) {
					url = r.data.url + params.key
				}
			})
		} catch (err) {
			ElMessage.error({
				message: '文件上传失败请稍后重试！',
				duration: 500
			})
		}
	})
	return url
}
