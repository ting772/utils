/**
 * 请求打开麦克风的权限，如成功，则打开麦克风，并返回一个代表麦的MediaStream
 * @returns
 */
export function getMicMediaStream() {
  return navigator.mediaDevices
    .getUserMedia({
      audio: true,
    })
    .then((stream) => {
      console.log(`获取到资源`, stream);
      return stream;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
}
