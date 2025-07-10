import {
  offVideo,
  okVideo,
  turnVideo,
  VideoChatHeart,
  wsVideo,
} from '@/api/video';
import dataCenter from '@/dataCenter';
import callDataCenter from '@/im-sdk/callDataCenter';

class CallEvent {
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private accepting = false;
  latestHeartbeatRes?: VideoChatHeart;

  private mapType(inputType: string): 'VIDEO' | 'VOICE' {
    if (inputType === 'video') return 'VIDEO';
    if (inputType === 'audio') return 'VOICE';
    throw new Error(`Invalid type: ${inputType}`);
  }

  // 发起语音或视频
  async startVideoChat(toImUserId: string, type: 'video' | 'audio') {
    const mappedType = this.mapType(type);
    const userId = callDataCenter.userId;
    try {
      const res = await turnVideo({
        toImUserId,
        fromImUserId: userId,
        type: mappedType,
      });
      if (res?.data.code === 0) {
        callDataCenter.call(toImUserId, type);
      }
    } catch (err) {
      console.log(err);
    }
  }
  // 接受语音或视频
  async acceptVideoChat(fromImUserId: string, type: 'video' | 'audio') {
    if (this.accepting) return; // 避免重复
    this.accepting = true;

    const mappedType = this.mapType(type);
    const userId = callDataCenter.userId;
    try {
      const res = await okVideo({
        toImUserId: userId,
        fromImUserId,
        type: mappedType,
      });
      if (res?.data.code === 0) {
        await callDataCenter.accept();
        this.onHeartbeat();
      } else {
        this.rejectVideoChat();
      }
    } catch (err) {
      console.log(err);
    } finally {
      this.accepting = false; // 保证异常后也能解锁
    }
  }

  // 拒绝语音或视频
  async rejectVideoChat() {
    callDataCenter.refuse();
  }

  // 结束/错误语音或视频
  async finishVideoChat(
  ) {
    callDataCenter.finish();
    this.closeHeartbeat();
  }

  // 监听结束方法
  async onFinished(
    toImUserId: string,
    fromImUserId: string,
    type: string
  ) {
    const mappedType = this.mapType(type);
    callDataCenter.finish();
    await offVideo({ toImUserId, fromImUserId, type: mappedType });
    this.closeHeartbeat();
  }

  // 开始心跳
  async onHeartbeat(): Promise<VideoChatHeart | undefined> {
    if (!this.heartbeatTimer) {
      const callHeartbeat = async () => {
        try {
          const res = await wsVideo();
          if (!dataCenter.user.value?.online && !res?.data.data.goldCoins) {
            callDataCenter.finish();
          }
          this.latestHeartbeatRes = res?.data.data;
        } catch (e) {
          console.error('Heartbeat error:', e);
        }
      };

      // 立即执行一次，确保 latestHeartbeatRes 有值
      await callHeartbeat();

      // 后续每 15 秒执行一次
      this.heartbeatTimer = setInterval(callHeartbeat, 15 * 1000);
    }
    return this.latestHeartbeatRes;
  }

  // 停止心跳
  closeHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
}

// 直接实例化
const callEvent = new CallEvent();
export default callEvent;
