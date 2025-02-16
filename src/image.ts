
/**
 * 加载图片，返回包含图片的image元素
 * @param path 图片路径
 * @returns 
 */
export function loadImage(path: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.src = path;
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (e) => {
      console.error("图片资源加载异常", e);
      reject(e);
    };
  });
}

/**
 * 给定图片路径加载图片，以及展示区域最大尺寸，待图片加载完成后计算出保持宽高比的图片展示尺寸
 * @param path 图片路径
 * @param maxRegionW 展示区域最大宽度
 * @param maxRegionH 展示区域最大高度
 * @returns
 */
export function loadImage4Region(path: string, maxRegionW: number, maxRegionH: number) {
  return loadImage(path).then((res) => {
    let w = maxRegionW,
      h = maxRegionH;
    let r2 = +(w / h).toFixed(2);
    let { width, height } = res;
    let r = width / height;
    if (width >= w) {
      if (r >= r2) {
        return {
          width: w,
          height: (height * w) / width,
          img: res,
        };
      } else {
        return {
          width: (width * h) / height,
          height: h,
          img: res,
        };
      }
    } else {
      if (r >= r2) {
        return {
          width,
          height,
          img: res,
        };
      } else {
        if (height <= h) {
          return {
            width,
            height,
            img: res,
          };
        } else {
          return {
            width: (width * h) / height,
            height: h,
            img: res,
          };
        }
      }
    }
  });
}
