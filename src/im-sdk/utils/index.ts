export function readImageFile(
  file: File
): Promise<{ url: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      console.log(img.naturalWidth, img.naturalHeight, '图片宽高');
      resolve({
        url,
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.onerror = (err) => {
      reject(new Error('图片加载失败'));
    };

    img.src = url;
  });
}
export function readVideoFile(file: File) {
  return new Promise<{
    url: string;
    width: number;
    height: number;
    duration: number;
    cover: string;
  }>((resolve, reject) => {
    // 创建Blob
    const blob = new Blob([file], { type: file.type });

    // 创建预览URL
    const video = document.createElement('video');
    video.src = URL.createObjectURL(blob);
    video.crossOrigin = "anonymous"; // 跨域安全处理，防止 canvas 报错

    video.onloadeddata = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('无法创建 Canvas 上下文'));
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const cover = canvas.toDataURL('image/png');

      resolve({
        url: video.src,
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration,
        cover, // 封面图 base64
      });
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('视频加载失败'));
    };
  });
}

/**
 * 完成action直到成功
 * @param action
 * @param delay 执行间隙
 */
export async function doWhile(
  action: () => Promise<boolean>,
  delay: number = 0
) {
  while (true) {
    const ret = await action();
    if (ret) {
      break;
    }
    await new Promise((rs) => setTimeout(rs, delay));
  }
}
