import { MessageBrief, MessageData } from '../types';

export function generateBrief(message: MessageData) {
  let brief = '';
  if (message.type === 'txt') {
    brief = message.msg;
  } else if (message.type === 'img') {
    brief = '图片';
  } else if (message.type === 'audio') {
    brief = '语音';
  } else if (message.type === 'video') {
    brief = '视频';
  } else if (message.type === 'call') {
    if (message.callType === 'audio') {
      brief = '语音';
    } else {
      brief = '视频';
    }
  } else {
    brief = '其他';
  }
  const data: MessageBrief = {
    id: message.id,
    brief,
    sender: message.from,
  };
  return data;
}

export function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = document.createElement('audio');
    audio.preload = 'metadata';

    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(audio.src); // 清理 blob URL
      resolve(audio.duration);
    };

    audio.onerror = (e) => {
      reject(new Error('Failed to load audio metadata'));
    };

    audio.src = URL.createObjectURL(file);
  });
}
