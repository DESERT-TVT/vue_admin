import {messageBtn} from '@/utils/message';
import BenzAMRRecorder from 'benz-amr-recorder';

interface VoiceRecord {
  blob: Blob | null;
  duration: number;
}

export class VioceRecorder {
  /**定时器 */
  private timer?: NodeJS.Timeout;

  time = 0;

  private recorder = new BenzAMRRecorder();

  private isReady = false;
  private maxDuration = 0;

  private onEmit?: (data: VoiceRecord) => void;
  private onProgress?: (duration: number) => void;

  /**是否进入录制中 */
  private isEnterRecord = false;

  constructor(maxDuration: number, onProgress?: (duration: number) => void) {
    this.maxDuration = maxDuration;
    this.onProgress = onProgress;
  }

  start(onEmit: (data: VoiceRecord) => void) {
    this.onEmit = onEmit;
    return this.recorder
      .initWithRecord()
      .then(() => {
        this.recorder.startRecord();
        console.log("开始录制",this.isReady);
        
        if (this.isReady) return this.abort();
        this.time = Date.now();
        this.isEnterRecord = true;
        this.timer = setInterval(this.update, 100);
        return true;
      })
      .catch((e) => {
        messageBtn('录制失败');
        return false;
      });
  }

  abort() {
    if (this.recorder.isRecording()) {
      this.recorder.cancelRecord();
    }
    this.onEmit = undefined;
    this.isReady = false;
  }

  async finish() {
    this.isReady = true;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
    if (!this.isEnterRecord) {
      return;
    }
    try {
      if (this.recorder.isRecording()) {
        await this.recorder.finishRecord();
      }
      const blob = this.recorder.getBlob();
      this.onEmit?.({
        blob,
        duration: this.recorder.getDuration(),
      });
    } catch (error) {
      messageBtn('录制失败');
    }
  }

  update = () => {
    const dt = Date.now() - this.time;
    if (dt >= this.maxDuration) {
      this.recorder.finishRecord();
      messageBtn('已达到最大录制时间');
      clearInterval(this.timer);
      this.timer = undefined;
    }
    this.onProgress?.(dt);
  };
}
