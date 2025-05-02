import { isFunc, isDef } from './isType'

/**
 * 生成n1-n2间的随机数，如果取整的话就四舍五入
 * @param n1 小值
 * @param n2 大值
 * @param isInt 是否取整
 * @returns 返回生成随机数
 */
export function randomBetween(n1: number, n2: number, isInt = true) {
  let min = Math.min(n1, n2);
  let max = Math.max(n1, n2);
  let n = Math.random() * (max - min) + min;
  return isInt ? Math.round(n) : n;
}

/**
 * 返回随机整数
 * @param n 上限
 * @param include：是否包含上限 
 * @returns 
 */
export function randomInt(n: number, include = true) {
  let v = Math.random() * n;
  return include ? Math.round(v) : ~~v;
}

/**
 * 生成rgb字符串
 * @param r [0,255]
 * @param g [0,255]
 * @param b [0,255]
 * @param a [0,255]
 * @returns rgb颜色字符串
 */
export function rgb(r: number, g: number, b: number, a?: number) {
  return isDef(a) ? `rgba(${r},${g},${b},${a})` : `rgb(${r},${g},${b})`;
}


type ChannelRange = [number, number]
/**
 * 生成随机rgb颜色
 * @param r r channel范围 [0-255]默认
 * @param g g channel范围 [0-255]默认
 * @param b b channel范围 [0-255]默认
 * @returns 
 */
export function randomRgb(r: ChannelRange = [0, 255], g: ChannelRange = [0, 255], b: ChannelRange = [0, 255]) {
  return rgb(randomBetween(...r), randomBetween(...g), randomBetween(...b));
}

export function randomHexColor() {
  return `#${randomInt(0xFFFFFF).toString(16).padStart(6, '0')}`
}

/**
 * 随机返回数组中的某项
 * @param arr 数组
 * @returns 
 */
export function randomArr<T = unknown>(arr: T[]) {
  return arr[randomInt(arr.length, false)]
}

/**
 * 生成序列 
 * @param start 起始数(包含)
 * @param end 终点数（可能包含）
 * @param map 映射函数，将生成数转换为其他数据
 * @param step，步进
 * @returns 
 */
export function range<T = number>(start: number, end: number, step: number = 1, map?: (n: number) => T) {
  let ret = [] as T[]
  for (let i = start; i <= end; i += step) {
    let r = (isFunc(map) ? map!(i) : i) as T
    ret.push(r);
  }
  return ret;
}

const textPool = [...Array(26)].map((item, index) => {
  return ['a', 'A'].map(item => String.fromCharCode(item.charCodeAt(0) + index))
}).flat()

/**
 * 生成随机长度的字符串
 * @param length 生成字符串的长度
 */
export function getRangomString(length: number, pool?: string[]) {
  return [...Array(randomInt(length))].map(() => randomArr(pool ?? textPool)).join('')
}

/**
 * 生成颜色插值器
 * 计算2颜色的插值
 * @param color1 - 起始颜色
 * @param color2 - 终点颜色
 * @returns {(undefined|(ratio:number)=>string)} 返回空则表示失败,否则返回一个插值函数，ratio:插值比例,取值范围0-1,返回颜色字符串
 */
export function interpolateColor(color1: string, color2: string) {
  if (!OffscreenCanvas) {
    console.warn('不支持OffscreenCanvas')
    return
  }

  const canvas = new OffscreenCanvas(101, 1)
  const ctx = canvas.getContext("2d")!
  const grad = ctx.createLinearGradient(0, 0, 100, 0)
  grad.addColorStop(0, color1)
  grad.addColorStop(1, color2)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 101, 1)
  let all = ctx.getImageData(0, 0, 101, 1).data

  function getIndex(data: Uint8ClampedArray, index: number) {
    return rgb(data[index * 4 + 0], data[index * 4 + 1], data[index * 4 + 2], data[index * 4 + 3])
  }
  /**
   *  插值器
    * @param {number} ratio - 插值比例,0-1
    */
  return (ratio: number) => {
    let x = Math.max(0, Math.min(100, ~~(ratio * 100)))
    return getIndex(all, x)
  }
}