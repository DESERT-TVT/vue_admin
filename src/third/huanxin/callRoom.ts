import { webConfig } from '@/dataCenter/webConfig';
import { CallType } from '@/im-sdk/types';
import AgoraRTC, {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  IRemoteAudioTrack,
  IRemoteVideoTrack,
} from 'agora-rtc-sdk-ng';
import { EasemobChat } from 'easemob-websdk';
import { getRtcToken } from './api';
// 创建 AgoraRTC 实例
const CallKitClient: IAgoraRTCClient = AgoraRTC.createClient({
  mode: 'rtc',
  codec: 'vp8',
});
type CameraType = 'environment' | 'left' | 'right' | 'user';
/**音视频通话房间
 * 计时，计费，播放
 */
class CallRoom {
  rtcUserId = '';
  token = '';
  channel = '';
  localVoiceTrack?: IMicrophoneAudioTrack;
  localVideoTrack?: ICameraVideoTrack;

  cameraType: CameraType = 'user';

  private loacalPlayer?: HTMLElement;
  private remotePlayer?: HTMLElement;

  private cameraOpen = true;
  private vioceOpen = true;
  private audioOpen = true;

  private targetVideoTrack?: IRemoteVideoTrack;
  private targetAudioTrack?: IRemoteAudioTrack;
  constructor() {
    // todo 这里要测试一下，是不是不进入房间也可以监听到
    this.startListen();
  }

  startListen() {
    CallKitClient.on('user-published', async (user, mediaType) => {
      await CallKitClient.subscribe(user, mediaType);
      if (mediaType === 'video') {
        setTimeout(() => {
          if (this.remotePlayer) {
            user.videoTrack?.play(this.remotePlayer);
          } else {
            this.targetVideoTrack = user.videoTrack;
            console.log('播放对方画面的容器不存在');
          }
        }, 300);
      } else if (mediaType === 'audio') {
        this.targetAudioTrack = user.audioTrack;
        if (this.audioOpen) {
          user.audioTrack?.play();
        }
      }
    });
    CallKitClient.on('user-joined', (user) => {
      console.log('>>>>>>用户加入房间', user);
    });
    CallKitClient.on('user-left', (user, reason) => {
      console.log('>>>>>>用户离开回调触发,离开原因', reason);
    });
  }
  /**设置播放舞台 */
  setStage(localPlayer: HTMLElement, remotePlayer: HTMLElement) {
    this.loacalPlayer = localPlayer;
    this.remotePlayer = remotePlayer;
    if (this.localVideoTrack) {
      this.localVideoTrack.play(this.loacalPlayer);
    }
    if (this.targetVideoTrack) {
      this.targetVideoTrack.play(this.remotePlayer);
    }
  }
  clearStage() {
    this.loacalPlayer = undefined;
    this.remotePlayer = undefined;
  }

  async getAuthToken(
    conn: EasemobChat.Connection,
    userId: string,
    channel: string
  ) {
    if (this.channel === channel && this.rtcUserId && this.token) {
      return true;
    }
    return getRtcToken(conn, { userId, channel }).then((resp) => {
      this.rtcUserId = resp.agoraUserId;
      this.token = resp.accessToken;
      return true;
    });
  }
  async join(channel: string, type: CallType) {
    await this.checkDevice(type);
    const AgoraAppId = webConfig.AgoraAppId;
    await CallKitClient.join(AgoraAppId, channel, this.token, this.rtcUserId);
    this.localVoiceTrack = await AgoraRTC.createMicrophoneAudioTrack();
    this.localVoiceTrack?.setMuted(!this.vioceOpen);
    if (type === 'video') {
      this.localVideoTrack = await AgoraRTC.createCameraVideoTrack({
        facingMode: this.cameraType,
      });
      this.localVideoTrack?.setMuted(!this.cameraOpen);
      if (this.loacalPlayer) {
        this.localVideoTrack.play(this.loacalPlayer);
      } else {
        console.log('播放自己画面的容器不存在');
      }
      if (this.localVoiceTrack && this.localVideoTrack) {
        CallKitClient.publish([this.localVoiceTrack, this.localVideoTrack]);
      } else {
        console.log('获取的音频或者视频录制不存在');
      }
    } else {
      if (this.localVoiceTrack) {
        CallKitClient.publish(this.localVoiceTrack);
      } else {
        console.log('获取的音频录制不存在');
      }
    }
  }
  private async checkDevice(type: CallType) {
    let devices = [];
    try {
      devices = await AgoraRTC.getMicrophones();
    } catch (error) {
      console.log('获取麦克风失败', error);
    }
    if (devices.length < 1) {
      alert('获取麦克风失败');
    }
    if (type === 'video') {
      try {
        devices = await AgoraRTC.getCameras();
      } catch (error) {
        console.log('获取摄像头失败', error);
      }
      if (devices.length < 1) {
        alert('获取摄像头失败');
      }
    }
  }
  /**切换摄像头 */
  async changeCamera() {
    this.localVideoTrack?.close();
    await CallKitClient.unpublish(this.localVideoTrack);
    if (this.cameraType === 'user') {
      this.cameraType = 'environment';
    } else {
      this.cameraType = 'user';
    }
    this.localVideoTrack = await AgoraRTC.createCameraVideoTrack({
      facingMode: this.cameraType,
    });
    if (this.loacalPlayer) {
      this.localVideoTrack.setMuted(!this.cameraOpen);
      this.localVideoTrack.play(this.loacalPlayer);
    } else {
      console.log('播放自己画面的容器不存在');
    }
    await CallKitClient.publish(this.localVideoTrack);
  }
  /**设置自己的摄像头是否开启 */
  setCamera(state: boolean) {
    if (this.cameraOpen === state) return;
    this.cameraOpen = state;
    this.localVideoTrack?.setMuted(!this.cameraOpen);
  }
  /**设置自己的声音 */
  setVoice(state: boolean) {
    if (this.vioceOpen === state) return;
    this.vioceOpen = state;
    this.localVoiceTrack?.setMuted(!this.vioceOpen);
  }
  /**播放音频（对方） */
  setTargetAudio(state: boolean) {
    if (this.audioOpen === state) return;
    this.audioOpen = state;
    if (state) {
      this.targetAudioTrack?.play();
    } else {
      this.targetAudioTrack?.stop();
    }
  }
  exit() {
    this.channel = '';
    this.rtcUserId = '';
    this.token = '';
    this.localVideoTrack?.close();
    this.localVoiceTrack?.close();
    this.localVideoTrack = undefined;
    this.localVoiceTrack = undefined;
    this.targetVideoTrack = undefined;
    this.targetAudioTrack = undefined;
    CallKitClient.leave();
  }
}

export default new CallRoom();
