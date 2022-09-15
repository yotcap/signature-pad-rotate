/**
 * 将 base64 转换为文件
 * @param {*} dataurl base64字符串
 * @param {*} filename 文件名，必须带后缀名，如.jpg,.png
 */
 export function dataURL2File (dataurl: string, filename: string): File {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

/**
 * 图片旋转处理 -> base64
 * @param src base64
 * @param edg 旋转角度
 */
export const rotateBase64Img = (src: string, edg: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
  
      let imgW = 0; // 图片宽度
      let imgH = 0; // 图片高度
      let size = 0; // canvas初始大小
  
      if (edg % 90 !== 0) {
        throw new Error('旋转角度必须是90的倍数!');
      }
  
      (edg < 0) && (edg = (edg % 360) + 360);
      const quadrant = (edg / 90) % 4; // 旋转象限
      const cutCoor = { sx: 0, sy: 0, ex: 0, ey: 0 }; // 裁剪坐标
  
      const image = new Image();
      image.src = src;
      image.crossOrigin = 'anonymous';
  
      image.onload = function () {
        imgW = image.width;
        imgH = image.height;
        size = imgW > imgH ? imgW : imgH;
  
        canvas.width = size * 2;
        canvas.height = size * 2;
        switch (quadrant) {
          case 0:
            cutCoor.sx = size;
            cutCoor.sy = size;
            cutCoor.ex = size + imgW;
            cutCoor.ey = size + imgH;
            break;
          case 1:
            cutCoor.sx = size - imgH;
            cutCoor.sy = size;
            cutCoor.ex = size;
            cutCoor.ey = size + imgW;
            break;
          case 2:
            cutCoor.sx = size - imgW;
            cutCoor.sy = size - imgH;
            cutCoor.ex = size;
            cutCoor.ey = size;
            break;
          case 3:
            cutCoor.sx = size;
            cutCoor.sy = size - imgW;
            cutCoor.ex = size + imgH;
            cutCoor.ey = size + imgW;
            break;
        }
  
        ctx.translate(size, size);
        ctx.rotate(edg * Math.PI / 180);
        ctx.drawImage(image, 0, 0);
  
        const imgData = ctx.getImageData(cutCoor.sx, cutCoor.sy, cutCoor.ex, cutCoor.ey);
        if (quadrant % 2 === 0) {
          canvas.width = imgW;
          canvas.height = imgH;
        } else {
          canvas.width = imgH;
          canvas.height = imgW;
        }
        ctx.putImageData(imgData, 0, 0);
  
        resolve(canvas.toDataURL('image/png', 0.7));
      }
    } catch (e) {
      console.log(e);
      reject();
    }
  });
  
}
