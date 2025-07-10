export interface CommonResp<T> {
  code: number;
  msg: string;
  data: T;
}

export interface PageQuery {
  /**当前页码 */
  page?: number;
  /**每页条数 */
  limit?: number;
  /**排序字段 */
  order?: string;
  /**是否升序 */
  asc?: boolean;
  /**用户id 自己不传 */
  targetId?: string;
}

export interface BaseUserData {
  userId: number;
  mobile: string;
  email?: string;
  imUserId: string;
  imToken?: string;
}
export interface AuthData extends BaseUserData {
  fillInInfo: boolean;
  accessToken: string;
  refreshToken: string;
  accessTokenExpire: string;
  refreshTokenExpire: string;
}
export interface UserBriefData {
  userId: number;
  nickname: string;
  username: string;
  avatar: string;
  gender: number;
  age: number;
  goddess: number;
  isVip: boolean;
  online: number;
  realer: number;
  isOnline: boolean;
  // lastOnlineTime: string;
  videoChatPrice: number;
  textChatPrice: number;
  voiceChatPrice: number;
  imUserId: string;
  // follow: boolean;
}
export interface UserData extends BaseUserData {
  nickname: string;
  /** 头像 */
  avatar: string;
  /** 年龄 */
  createTime: string;
  age: number;
  /** 性别<br>0：男<br>1：女<br>2：未知 */
  gender: number;
  /** 身高 */
  height: number;
  /** 体重 */
  weight: number;
  /** 邀请码 */
  inviteCode: string;
  /** 邀请链接 */
  inviteUrl: string;
  /** 邀请代理链接 */
  inviteProxyUrl: string;
  /** 邀请主播链接 */
  inviteOnlineUrl: string;
  /** 微信账号 */
  wechatAccount: string;
  /** QQ账号 */
  qqAccount: string;
  /** tg账号 */
  tgAccount: string;
  /** 个性签名文字版 */
  personalitySignText: string;
  /** 个性签名语音版 */
  personalitySignVoice: string;
  /** 城市 */
  city: string;
  /** 职业 */
  occupation: string;
  /** 个性标签 */
  personalityLabels: string[];
  /** 气质标签 */
  temperamentLabels: string[];
  /** 印象标签 */
  impressionLabels: impressionLabelsData[];
  /** 女神认证<br>0：未认证<br>1：已认证 */
  goddess: number;
  /** 是否是vip用户 */
  isVip: boolean;
  /** VIP到期时间 */
  vipExpireTime: string;
  /** 是否已填写邀请码 */
  fillInviteCode: boolean;
  /** 金币 */
  goldCoins: string;
  /** 积分 */
  integral: string;
  /** 经纬度，例如：'123.12345,789.45678' */
  locate: string;
  /** 距离 */
  distance: string;
  /** 最近一次上线时间 */
  lastLoginTimestamp: number;
  /** 最近一次上线时间 */
  lastOnlineTime: string;
  /** 主播认证<br>0：未认证<br>1：已认证 */
  online: number;
  /** 真人认证<br>0：未认证<br>1：已认证 */
  realer: number;
  /** 在线状态 */
  isOnline: boolean;
  /** 背景图片 */
  background: string;
  /** 我是否关注此人 */
  isFollow: boolean;
  /** 环信id */
  imUserId: string;
  /** 环信token */
  imToken: string;
  /** username */
  username: string;
  /** 是否是公会长 */
  isUnionMaster: boolean;
  /** 工会申请状态  1：通过  -1：未申请  0：审核中 */
  unionApply: number;
  /** 公会冻结否 -1:未冻结  1:公会已经冻结 */
  freezeUnion: number;
  /** 是否开启通话 */
  isOpenCall: boolean;
  /** 视频私聊价格 */
  videoChatPrice: number;
  /** 文字私聊价格 */
  textChatPrice: number;
  /** 语音私聊价格 */
  voiceChatPrice: number;
  /** 普通用户免费发动态剩余次数 如果用户为vip则该字段无效（只针对普通用户） */
  normalUserFreeDynamic: number;
  /** 普通用户免费发评论剩余次数 如果用户为vip则该字段无效（只针对普通用户） */
  normalUserFreeComment: number;
  /** 财富值 */
  richExp: number;
  /** 魅力值 */
  charmExp: number;
  /** 财富等级 */
  richLevel: number;
  /** 魅力等级 */
  charmLevel: number;
  /** 联系方式，联系方式列表 */
  userContactList: UserContact[];
  /** 是否为代理 */
  proxy: boolean;
  /** 订阅到期时间 */
  subEndTime: string;
  /** 加v 0 没有 1 有 */
  blueV: 0 | 1;
}

/**数据字典的数据结构 */
export interface MapItem {
  labelValue: string;
  labelName: string;
}
export interface impressionLabelsData {
  /** 印象标签 */
  label: string;
  /** 印象标签数量 */
  count: number;
}
export interface UserContact {
  /** ID */
  id?: string;
  /** 联系方式 */
  contact: string;
  /** 联系方式名称 */
  contactName: string;
  /** 联系方式图标 */
  contactIcon: string;
  /** 联系方式配置id */
  contactId: string;
}

export interface ContactConfig {
  id: number;
  contactName: string;
  contactIcon: string;
}
export interface UnlockRes {
  /* */
  userId: number;
  /*是否解锁联系方式 */
  isUnlockSocialAccount: boolean;
  /*我剩余的免费解锁次数-个人信息 */
  remainFreeUnlock: number;
  /*我剩余的免费解锁次数-社交帐号 */
  remainFreeUnlockSocialAccount: number;
  /*当前用户我对他解锁社交信息状态  -1：未申请 0：审核中  1:已通过 2:审核通过待付费 */
  currentSocialAccountStatus: number;
  /* */
  personalityGift: {
    /* */
    id: number;
    /*礼物名称 */
    giftName: string;
    /*礼物价值 */
    giftValue: number;
    /*礼物图片 */
    giftImg: string;
  };
  /* */
  socialAccountGift: {
    /* */
    id: number;
    /*礼物名称 */
    giftName: string;
    /*礼物价值 */
    giftValue: number;
    /*礼物图片 */
    giftImg: string;
  };
  /*用户是否开启了解锁联系方式需申请  1:开启  0:未开启 */
  contactApply: number;
  /*是否解锁个人主页  1:解锁  0:未解锁（该字段前端已默认为1不需要判断） */
  unlockPersonal: number;
}
