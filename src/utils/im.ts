import { reactive } from 'vue'
import WebIM, { EasemobChat } from 'easemob-websdk'

class IM implements EasemobChat.EventHandlerType {
	/**做临时保存的 */
	loading = false
	imConn!: EasemobChat.Connection
	messageType = ''
	serverConversations: any[] = []
	imUserId: string = ''
	imToken: string = ''
	userId: string = ''
	pageSize: number = 10
	cursor: string = '-1'
	totalCount: number = 0
	flagLoginOut: boolean = false
	private ready: Promise<EasemobChat.Connection>
	private _readyResolver!: (conn: EasemobChat.Connection) => void

	constructor() {
		this.ready = new Promise<EasemobChat.Connection>(resolve => {
			this._readyResolver = resolve
		})
	}

	init() {
		this.imConn = new WebIM.connection({
			//注意这里的 "K" 需大写。
			appKey: '1196240801208739#kt2'
		})
		this.startListen()
	}

	startListen() {
		this.imConn.addEventHandler('eventName', this)
		// const resp = await this.imConn.getServerConversations({ pageSize: 50, cursor: '' })
		// resp.data?.conversations.forEach((item: any) => {
		// 	this.getHistoryMessages(item)
		// })
	}

	getServerConversations = async () => {
		return await this.imConn.getServerConversations({ pageSize: 50, cursor: '' })
	}
	getHistoryMessages = async (imUserId: string) => {
		let messageType: any[] = []
		if (!this.messageType) {
			messageType = ['txt', 'img', 'audio']
		} else {
			messageType = [this.messageType]
		}
		return await this.imConn.getHistoryMessages({
			targetId: imUserId,
			pageSize: this.pageSize,
			cursor: this.cursor,
			chatType: 'singleChat',
			searchDirection: 'up',
			searchOptions: {
				msgTypes: messageType // 要获取的消息类型的数组。若不传值，会获取所有类型的消息。
			}
		})
	}
	// 获取总条数
	getTotalCount = async (imUserId: string, cursor: string) => {
		await this.imConn
			.getHistoryMessages({
				targetId: imUserId,
				pageSize: 50,
				cursor: cursor,
				chatType: 'singleChat',
				searchDirection: 'up',
				searchOptions: {
					msgTypes: ['txt', 'img', 'audio'] // 要获取的消息类型的数组。若不传值，会获取所有类型的消息。
				}
			})
			.then(async res => {
				if (res.messages.length < 50) {
					im.totalCount = im.totalCount + res.messages.length
				} else {
					if (res.cursor) {
						im.totalCount = im.totalCount + 50
						await this.getTotalCount(imUserId, res.cursor)
					}
				}
			})
	}

	async loginIm(imUserId: string, imToken: string) {
		if (this.flagLoginOut) {
			this.flagLoginOut = false
			await this.imConn.open({ user: imUserId, accessToken: imToken })
		}
		await this.getServerConversations().then(res => {
			this.serverConversations.push(res.data?.conversations)
		})
	}

	logoutIm() {
		this.flagLoginOut = true
		this.imConn.close()
	}

	onConnected = () => {
	}
	// SDK 与环信服务器断开连接。
	onDisconnected = (message?: EasemobChat.ErrorEvent) => {
		this.cursor = '-1'
		this.pageSize = 10
		this.flagLoginOut = true
	}
	// 调用过程中出现错误。
	onError = (message: EasemobChat.ErrorEvent) => {}
}

const im = reactive(new IM())
export default im
