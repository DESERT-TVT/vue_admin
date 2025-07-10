import { ImUserData } from '@/im-sdk/types';

export interface UserDetail {
  nickname: string;
  /** 头像 */
  avatar: string;
  /** 性别<br>0：男<br>1：女<br>2：未知 */
  gender: number;
  /** 金币 */
  goldCoins: string;
  /** 主播认证<br>0：未认证<br>1：已认证 */
  online: number;
  /** 语音价格 */
  voiceChatPrice: number;
  /** 视频价格 */
  videoChatPrice: number;
  /** 年龄 */
  age: number;
}
export interface Enhance {
  getUserDetail?: (user?: ImUserData) => Promise<UserDetail | undefined>;
}
